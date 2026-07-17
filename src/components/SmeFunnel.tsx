import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  HelpCircle, 
  MessageSquare, 
  Zap, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  AlertCircle, 
  RefreshCw, 
  Share2, 
  Send,
  Plus,
  Trash2,
  Database,
  Video,
  ExternalLink
} from 'lucide-react';
import { Lead, QuizLead } from '../types';
import { saveLeadToFirestore } from '../lib/firebase';
import { appendLeadToGoogleSheet } from '../lib/sheets';
import { fetchBookedEvents, isSlotBusy, createCalendarMeetEvent } from '../lib/calendar';

interface SmeFunnelProps {
  onBackToLanding: () => void;
  onEnterAdmin: () => void;
  onAddAdminLead: (newLead: Lead) => void;
  googleToken: string | null;
  googleSpreadsheetId: string;
  onGoogleSignIn?: () => Promise<void>;
}

const PRE_SEEDED_LEADS: QuizLead[] = [
  {
    id: 'sme-lead-1',
    timestamp: '2026-07-15 14:24',
    name: 'Olumide Adenuga',
    businessName: 'Gbagada Gadget Node',
    whatsapp: '+234 803 112 4455',
    email: 'olumide@gbagadagadgets.com',
    industry: 'Retail Flow',
    channels: ['WhatsApp Business', 'Instagram Direct Messages'],
    replyDelay: 'Often (It is hard to keep up with DMs)',
    corePain: 'Replying to DMs constantly',
    timeValuation: 'A lot (₦200,000 - ₦500,000/week)',
    revenueLeakage: 1850000,
    booking: {
      date: '2026-07-18',
      time: '11:30 AM',
      notes: 'Need to automate pricing responses for iPhone 15 stock'
    },
    syncedToSheets: true
  },
  {
    id: 'sme-lead-2',
    timestamp: '2026-07-16 09:12',
    name: 'Chioma Obi',
    businessName: 'Express Lagos Dispatch',
    whatsapp: '+234 812 449 0122',
    email: 'chioma@expressdispatch.ng',
    industry: 'Logistics Flow',
    channels: ['WhatsApp Business', 'Phone Calls', 'Walk-in Storefront'],
    replyDelay: 'All the time, honestly (We are drowning in messages)',
    corePain: 'Tracking shipments manually & answering status inquiries',
    timeValuation: 'Everything (Over ₦500,000/week — I\'m stretched extremely thin)',
    revenueLeakage: 3450000,
    booking: {
      date: '2026-07-20',
      time: '02:00 PM',
      notes: 'Interested in WhatsApp Auto-Reply and live shipment tracking integration'
    },
    syncedToSheets: true
  },
  {
    id: 'sme-lead-3',
    timestamp: '2026-07-16 11:45',
    name: 'Dr. Dele Banjo',
    businessName: 'Lekki Dental Care',
    whatsapp: '+234 703 551 9081',
    email: 'dele@lekkidental.com',
    industry: 'Med Flow',
    channels: ['Instagram Direct Messages', 'Traditional Website Form'],
    replyDelay: 'Sometimes (During busy peak hours)',
    corePain: 'Scheduling patient appointments & admin paperwork',
    timeValuation: 'A lot (₦200,000 - ₦500,000/week)',
    revenueLeakage: 1200000,
    syncedToSheets: true
  }
];

export default function SmeFunnel({ 
  onBackToLanding, 
  onEnterAdmin, 
  onAddAdminLead,
  googleToken,
  googleSpreadsheetId,
  onGoogleSignIn
}: SmeFunnelProps) {
  // Helper to extract the API activation link from Google Calendar 403 error
  const getActivationUrl = (errorStr: string | null): string | null => {
    if (!errorStr) return null;
    const match = errorStr.match(/https:\/\/console\.[^\s"]+/);
    return match ? match[0].replace(/[.,;)]+$/, '') : null;
  };

  // Quiz Step Tracker: 1 to 9
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Quiz Answers State
  const [industry, setIndustry] = useState<string>('Retail Flow');
  const [channels, setChannels] = useState<string[]>([]);
  const [stockTracking, setStockTracking] = useState<string>('');
  const [paymentVerification, setPaymentVerification] = useState<string>('');
  const [replyDelay, setReplyDelay] = useState<string>('');
  const [corePain, setCorePain] = useState<string>('');
  const [customerRetention, setCustomerRetention] = useState<string>('');
  const [timeValuation, setTimeValuation] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Sme Lead History State (persisted to localStorage)
  const [leadsList, setLeadsList] = useState<QuizLead[]>(() => {
    const saved = localStorage.getItem('sme_funnel_leads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return PRE_SEEDED_LEADS;
      }
    }
    return PRE_SEEDED_LEADS;
  });

  // Current calculated diagnostic results state
  const [completedLead, setCompletedLead] = useState<QuizLead | null>(null);

  // Booking Calendar States
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [isBooked, setIsBooked] = useState<boolean>(false);

  // Google Calendar integration states
  const [bookedEvents, setBookedEvents] = useState<any[]>([]);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState<boolean>(false);
  const [calendarSyncError, setCalendarSyncError] = useState<string | null>(null);

  // Google Sheets simulated configurations
  const [sheetsSyncActive, setSheetsSyncActive] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [googleSheetId, setGoogleSheetId] = useState<string>('1aBcdEFgHiJKlMnoPqRStUvWxYz_LagosGrowthSheets_2026');

  // Fetch real-time booked events from Google Calendar to find available slots
  useEffect(() => {
    if (googleToken) {
      setIsLoadingCalendar(true);
      setCalendarSyncError(null);
      
      // Query from 2026-07-17 to 2026-07-25 (covers all slots)
      const startDateIso = '2026-07-17T00:00:00+01:00';
      const endDateIso = '2026-07-25T23:59:59+01:00';
      
      fetchBookedEvents(googleToken, startDateIso, endDateIso)
        .then((events) => {
          setBookedEvents(events);
          console.log(`Fetched ${events.length} Google Calendar events to verify availability.`);
        })
        .catch((err) => {
          console.error('Error in calendar fetch:', err);
          const errMsg = err instanceof Error ? err.message : String(err);
          setCalendarSyncError(errMsg);
        })
        .finally(() => {
          setIsLoadingCalendar(false);
        });
    }
  }, [googleToken]);

  // Sync state changes with local storage
  useEffect(() => {
    localStorage.setItem('sme_funnel_leads', JSON.stringify(leadsList));
  }, [leadsList]);

  // Industry-specific options for Q4 (Core Pain)
  const getPainOptions = () => {
    switch (industry) {
      case 'Logistics Flow':
        return [
          'Tracking shipments manually & answering status inquiries',
          'Chasing invoice payments & receipts',
          'Coordinating dispatch drivers on WhatsApp groups',
          'Answering repetitive "Where is my package?" messages'
        ];
      case 'Retail Flow':
        return [
          'Answering repetitive product questions (price, specs, availability)',
          'Managing stock count & multi-channel inventory updates',
          'Replying to manual Instagram & Facebook Direct Messages',
          'Processing orders & writing paper receipts manually'
        ];
      case 'Property Flow':
        return [
          'Qualifying cold leads on rental & purchase listings',
          'Scheduling and coordinating on-site physical viewings',
          'Chasing tenancy files, agreements, and legal documents',
          'Following up on stale inquiries and older property listings'
        ];
      case 'Hospitality Flow':
        return [
          'Taking food/room orders manually on WhatsApp Business',
          'Coordinating delivery riders & processing kitchen sheets',
          'Answering repetitive "Are you open?" & address questions',
          'Handling table or room reservations manually'
        ];
      case 'Med Flow':
        return [
          'Scheduling patient appointments & coordinating clinic rosters',
          'Sending manual checkout or check-up reminders',
          'Answering repetitive administrative & clinical questions',
          'Handling manual patient intake paperwork and records'
        ];
      default:
        return [
          'Managing manual client chats on social media platforms',
          'Tracking financial ledger records on notebooks/spreadsheets',
          'Coordinating operational staff members & schedules',
          'Chasing late client payments & invoicing'
        ];
    }
  };

  // Toggle channel multiselect (Q2)
  const handleToggleChannel = (ch: string) => {
    if (channels.includes(ch)) {
      setChannels(prev => prev.filter(c => c !== ch));
    } else {
      setChannels(prev => [...prev, ch]);
    }
  };

  // Calculate dynamic weekly/annual leakage based on answers
  const calculateLeakage = () => {
    // Reply Delay multiplier
    let multiplier = 0.15;
    if (replyDelay.includes('Rarely')) multiplier = 0.05;
    if (replyDelay.includes('Sometimes')) multiplier = 0.15;
    if (replyDelay.includes('Often')) multiplier = 0.35;
    if (replyDelay.includes('All the time')) multiplier = 0.55;

    // Time Valuation
    let weekValue = 120000;
    if (timeValuation.includes('Under ₦50,000')) weekValue = 40000;
    if (timeValuation.includes('₦50,000 - ₦200,000')) weekValue = 125000;
    if (timeValuation.includes('₦200,000 - ₦500,000')) weekValue = 350000;
    if (timeValuation.includes('Over ₦50,000')) weekValue = 650000;

    // Core annual loss from time lost + reply delays
    let annualLoss = Math.round(((weekValue * multiplier) + 45000) * 12);

    // Add Stock Coordination leakage
    if (stockTracking.includes('Notebooks')) annualLoss += 280000;
    else if (stockTracking.includes('Spreadsheets')) annualLoss += 150000;
    else if (stockTracking.includes('POS')) annualLoss += 90000;

    // Add Payment Verification leakage
    if (paymentVerification.includes('Manual checking')) annualLoss += 240000;
    else if (paymentVerification.includes('Sharing logins')) annualLoss += 300000;
    else if (paymentVerification.includes('SMS alert')) annualLoss += 180000;

    // Add Customer Retention leakage
    if (customerRetention.includes('Zero follow-up')) annualLoss += 420000;
    else if (customerRetention.includes('Occasional manual')) annualLoss += 200000;
    else if (customerRetention.includes('customer sheets')) annualLoss += 120000;

    return annualLoss;
  };

  // Handle final quiz submission
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !businessName || !whatsapp || !email) {
      alert('Please fill out all contact details to unlock your personalized growth diagnostic.');
      return;
    }

    const computedLeakage = calculateLeakage();
    const now = new Date();
    const timestampStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLead: QuizLead = {
      id: `sme-lead-${Date.now()}`,
      timestamp: timestampStr,
      name,
      businessName,
      whatsapp,
      email,
      industry,
      channels,
      stockTracking,
      paymentVerification,
      replyDelay,
      corePain,
      customerRetention,
      timeValuation,
      revenueLeakage: computedLeakage,
      syncedToSheets: !!googleToken
    };

    // Save locally
    setLeadsList(prev => [newLead, ...prev]);
    setCompletedLead(newLead);
    
    // Save to Firestore
    saveLeadToFirestore(newLead)
      .then(() => console.log('Successfully saved lead to Firestore.'))
      .catch((e) => console.error('Firestore save failed:', e));

    // Automatically stream new high-intent lead to Admin CRM System!
    const adminLead: Lead = {
      id: newLead.id,
      name: `${newLead.name} (${newLead.businessName})`,
      score: computedLeakage > 1500000 ? 'HOT' : 'WARM',
      summary: `Growth Diagnostic Lead. Industry: ${newLead.industry}. Pain Point: ${newLead.corePain}. Stock tracking: ${stockTracking || 'Manual'}. Verification: ${paymentVerification || 'Manual'}. Estimated Revenue Leakage: ₦${computedLeakage.toLocaleString()}/yr. Current channels: ${newLead.channels.join(', ')}.`,
      statusTag: 'Diagnostic Completed'
    };
    onAddAdminLead(adminLead);

    // Sync to Google Sheets if token exists!
    if (googleToken && googleSpreadsheetId) {
      setIsSyncing(true);
      appendLeadToGoogleSheet(googleToken, googleSpreadsheetId, newLead)
        .then(() => {
          console.log('Successfully synced lead to Google Sheets.');
        })
        .catch((err) => {
          console.error('Google Sheets append failed:', err);
        })
        .finally(() => {
          setIsSyncing(false);
        });
    }

    // Set results view
    setCurrentStep(10);
  };

  // Reset quiz states for fresh check
  const handleResetQuiz = () => {
    setCurrentStep(1);
    setChannels([]);
    setStockTracking('');
    setPaymentVerification('');
    setReplyDelay('');
    setCorePain('');
    setCustomerRetention('');
    setTimeValuation('');
    setName('');
    setBusinessName('');
    setWhatsapp('');
    setEmail('');
    setCompletedLead(null);
    setIsBooked(false);
    setSelectedDate('');
    setSelectedTime('');
    setBookingNotes('');
  };

  // Handle Meeting Booking
  const handleBookMeeting = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both a date and a time slot.');
      return;
    }

    let meetLink = '';
    
    if (googleToken && completedLead) {
      setIsSyncing(true);
      try {
        const result = await createCalendarMeetEvent(googleToken, {
          summary: `RetailFlow OS - SME Consultation (${completedLead.businessName})`,
          description: `15-Min System Architecture & Automation Session with ${completedLead.name}.\n\nGrowth Notes: ${bookingNotes || 'None'}\n\nEstimated Annual Revenue Leakage: ₦${completedLead.revenueLeakage.toLocaleString()}`,
          date: selectedDate,
          time: selectedTime,
          attendeeEmail: completedLead.email
        });
        
        meetLink = result.hangoutLink || '';
        console.log('Successfully booked Google Calendar event with Meet link:', meetLink);
      } catch (err) {
        console.error('Google Calendar event creation failed:', err);
        const errMsg = err instanceof Error ? err.message : String(err);
        setCalendarSyncError(errMsg);
      } finally {
        setIsSyncing(false);
      }
    }

    // Update lead list with booking details
    if (completedLead) {
      const updatedLead: QuizLead = {
        ...completedLead,
        booking: {
          date: selectedDate,
          time: selectedTime,
          notes: bookingNotes,
          ...(meetLink ? { meetLink } : {})
        }
      };

      setLeadsList(prev => prev.map(lead => lead.id === completedLead.id ? updatedLead : lead));
      setCompletedLead(updatedLead);

      // Save updated booking to Firestore
      saveLeadToFirestore(updatedLead)
        .then(() => console.log('Firestore lead updated with booking.'))
        .catch((e) => console.error('Firestore booking update failed:', e));

      // Append to Google Sheets if token exists
      if (googleToken && googleSpreadsheetId) {
        setIsSyncing(true);
        appendLeadToGoogleSheet(googleToken, googleSpreadsheetId, updatedLead)
          .then(() => console.log('Successfully synced booking to Google Sheets.'))
          .catch((err) => console.error('Google Sheets booking update failed:', err))
          .finally(() => setIsSyncing(false));
      }
    }

    setIsBooked(true);
  };

  // Export current leads as a standard downloadable CSV file (Very useful for offline selling!)
  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Contact Name', 'Business Name', 'WhatsApp', 'Email', 'Industry', 'Channels', 'Reply Delay Level', 'Core Bottleneck', 'Time Value Level', 'Calculated Leakage (NGN)', 'Consultation Appointment'];
    
    const rows = leadsList.map(lead => [
      lead.timestamp,
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.businessName.replace(/"/g, '""')}"`,
      lead.whatsapp,
      lead.email,
      lead.industry,
      `"${lead.channels.join(', ')}"`,
      `"${lead.replyDelay.replace(/"/g, '""')}"`,
      `"${lead.corePain.replace(/"/g, '""')}"`,
      `"${lead.timeValuation.replace(/"/g, '""')}"`,
      lead.revenueLeakage,
      lead.booking ? `"${lead.booking.date} at ${lead.booking.time}"` : 'Not Booked'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Flow_OS_SME_Diagnostic_Leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete a lead from the spreadsheet logs table
  const handleDeleteLead = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead from the local Google Sheets sync log?')) {
      setLeadsList(prev => prev.filter(lead => lead.id !== id));
    }
  };

  return (
    <div className="bg-[#0A0A0B] text-[#e5e2e3] min-h-screen font-sans selection:bg-blue-600/30 selection:text-white">
      
      {/* Background Lights */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Main Container Header */}
      <header className="sticky top-0 z-50 glass-panel glass-highlight px-6 h-16 flex items-center justify-between border-b border-[#27272A]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToLanding}
            className="p-1.5 hover:bg-[#1C1C1F] border border-[#27272A]/40 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 border-l border-[#27272A]/80 pl-3">
            <div className="w-7 h-7 rounded bg-[#3B82F6] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">SME Growth Hub</span>
              <span className="text-[9px] font-mono text-cyan-400 block uppercase tracking-widest leading-none">Flow OS Funnel Node</span>
            </div>
          </div>
        </div>

        {/* Clean central tagline for the shared funnel page */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-mono text-blue-400">
          <Zap className="w-3.5 h-3.5 text-blue-400 animate-pulse animate-spin-slow" />
          <span>Operational Efficiency & Automation Audit</span>
        </div>

        <button
          onClick={onBackToLanding}
          className="bg-[#3B82F6] hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95"
        >
          Try Interactive Demo OS →
        </button>
      </header>

      {/* Main Section */}
      <main className="max-w-4xl mx-auto p-6 md:p-8 relative z-10 space-y-8">
        
        <div className="space-y-6">
            
            {/* Playbook Stage Header */}
            {currentStep <= 9 && (
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
                  <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Free 60-Second Business Growth Diagnostic</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Calculate Your Revenue Inefficiencies
                </h2>
                <p className="text-xs text-zinc-400 max-w-xl mx-auto leading-relaxed">
                  Discover what manual administrative workflows, delayed chat responses, and spreadsheet coordination are truly costing your operations this month.
                </p>
 
                {/* Progressive Flow Tracker bar */}
                <div className="max-w-md mx-auto pt-4">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1.5">
                    <span>PROGRESS</span>
                    <span>STEP {currentStep} OF 9</span>
                  </div>
                  <div className="w-full bg-[#18181B] border border-[#27272A] rounded-full h-2 overflow-hidden p-0.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / 9) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Industry Selection */}
            {currentStep === 1 && (
              <div className="bg-[#131316] border border-[#27272A] rounded-2xl p-6 md:p-8 space-y-6 animate-scale-up">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Question 1</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">What is your business category?</h3>
                  <p className="text-xs text-zinc-400">Select your industry node to load tailored diagnostic variables and calculation benchmarks.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Retail Flow', desc: 'Gadget shops, fashion, general retail outlets, electronics traders', color: 'blue' },
                    { name: 'Logistics Flow', desc: 'Courier, dispatch, freight forwarders, third-party logistics (3PL)', color: 'cyan' },
                    { name: 'Property Flow', desc: 'Real estate agency, property managers, developers', color: 'indigo' },
                    { name: 'Hospitality Flow', desc: 'Food vendors, restaurants, quick-service eateries, small hotels', color: 'amber' },
                    { name: 'Med Flow', desc: 'Private clinics, diagnostics lab, local healthcare services', color: 'rose' }
                  ].map(ind => (
                    <button
                      key={ind.name}
                      onClick={() => {
                        setIndustry(ind.name);
                        setCurrentStep(2);
                      }}
                      className={`p-5 text-left border rounded-xl transition-all cursor-pointer group flex flex-col justify-between h-36 ${
                        industry === ind.name 
                          ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-white' 
                          : 'bg-[#18181B] border-[#27272A] hover:border-zinc-600 text-zinc-300 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider block mb-1 opacity-65">NODE</span>
                        <span className="font-extrabold text-sm block group-hover:text-[#3B82F6] transition-colors">{ind.name}</span>
                        <span className="text-[10px] text-zinc-400 font-light mt-1.5 block leading-normal line-clamp-3">{ind.desc}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 group-hover:text-white self-end transition-colors">Select Node →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Customer Contact Channels */}
            {currentStep === 2 && (
              <div className="bg-[#131316] border border-[#27272A] rounded-2xl p-6 md:p-8 space-y-6 animate-scale-up">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Question 2</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">How do customers currently reach you to buy or book?</h3>
                  <p className="text-xs text-zinc-400">Select all communication networks currently handled by your staff (choose as many as apply).</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'WhatsApp Business',
                    'Instagram Direct Messages',
                    'Direct Phone Calls',
                    'Walk-in Retail Storefront',
                    'Traditional Website Form',
                    'Facebook Messenger'
                  ].map(ch => {
                    const isSelected = channels.includes(ch);
                    return (
                      <button
                        key={ch}
                        onClick={() => handleToggleChannel(ch)}
                        className={`p-4 border rounded-xl text-left transition-all cursor-pointer flex items-center justify-between font-mono text-xs ${
                          isSelected 
                            ? 'bg-blue-500/10 border-blue-500 text-white font-bold' 
                            : 'bg-[#18181B] border-[#27272A] text-zinc-400 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        <span>{ch}</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-zinc-600'
                        }`}>
                          {isSelected && <span className="text-[10px] font-bold">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-[#27272A]/40 pt-6">
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer border border-transparent hover:border-zinc-700 transition-all"
                  >
                    ← Back
                  </button>
                  <button 
                    disabled={channels.length === 0}
                    onClick={() => setCurrentStep(3)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      channels.length > 0
                        ? 'bg-[#3B82F6] text-white hover:bg-blue-600'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Continue</span> <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Stock Coordination (New!) */}
            {currentStep === 3 && (
              <div className="bg-[#131316] border border-[#27272A] rounded-2xl p-6 md:p-8 space-y-6 animate-scale-up">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Question 3</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">How do you synchronize stock levels between physical storefronts and online chats?</h3>
                  <p className="text-xs text-zinc-400">Inventory mismatches cause lost sales, double-selling friction, and slow fulfillment.</p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { val: 'Notebooks / Mental memory (We often double-sell or guess stock levels)', desc: 'Extremely high risk of manual error and seller friction.' },
                    { val: 'Manual spreadsheets (Takes hours to update, constantly lagging live sales)', desc: 'Frequent out-of-sync moments causing team confusion.' },
                    { val: 'Separate standalone POS (Does not talk to our Instagram or WhatsApp channels)', desc: 'Requires manual copy-pasting of orders between systems.' },
                    { val: 'Fully automated real-time cross-channel inventory sync (Ideal Status)', desc: 'Perfect alignment, instant stock subtraction across all nodes.' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => {
                        setStockTracking(opt.val);
                        setCurrentStep(4);
                      }}
                      className={`p-4 border rounded-xl text-left w-full transition-all cursor-pointer flex items-center justify-between ${
                        stockTracking === opt.val
                          ? 'bg-[#3B82F6]/10 border-blue-500 text-white font-bold'
                          : 'bg-[#18181B] border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{opt.val}</span>
                        <span className="text-[10px] text-zinc-400 font-light mt-0.5 block">{opt.desc}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        stockTracking === opt.val ? 'border-blue-500' : 'border-zinc-600'
                      }`}>
                        {stockTracking === opt.val && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-[#27272A]/40 pt-6">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer border border-transparent hover:border-zinc-700 transition-all"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Payment Verification & Reconciliation (New!) */}
            {currentStep === 4 && (
              <div className="bg-[#131316] border border-[#27272A] rounded-2xl p-6 md:p-8 space-y-6 animate-scale-up">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Question 4</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">How do your sales representatives confirm bank transfer payments?</h3>
                  <p className="text-xs text-zinc-400">Verifying payments manually keeps customers waiting and exposes you to fake transfer scams.</p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { val: 'Manual checking (Sellers wait at counter while we call or text the owner for screenshots)', desc: 'Severe operational bottleneck; ruins direct-to-customer flow.' },
                    { val: 'Sharing single corporate bank login details (Sellers have direct access to credentials)', desc: 'Massive cybersecurity risk and account lockouts.' },
                    { val: 'Checking credit SMS alerts on staff phones (Unreliable alerts, highly vulnerable to scams)', desc: 'High risk of fake payment receipts in high-volume hours.' },
                    { val: 'Automated virtual accounts with instant webhooks to team dashboard (Ideal Status)', desc: 'Payments verified within seconds without owner intervention.' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => {
                        setPaymentVerification(opt.val);
                        setCurrentStep(5);
                      }}
                      className={`p-4 border rounded-xl text-left w-full transition-all cursor-pointer flex items-center justify-between ${
                        paymentVerification === opt.val
                          ? 'bg-[#3B82F6]/10 border-blue-500 text-white font-bold'
                          : 'bg-[#18181B] border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{opt.val}</span>
                        <span className="text-[10px] text-zinc-400 font-light mt-0.5 block">{opt.desc}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        paymentVerification === opt.val ? 'border-blue-500' : 'border-zinc-600'
                      }`}>
                        {paymentVerification === opt.val && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-[#27272A]/40 pt-6">
                  <button 
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer border border-transparent hover:border-zinc-700 transition-all"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Chat/Reply Delays */}
            {currentStep === 5 && (
              <div className="bg-[#131316] border border-[#27272A] rounded-2xl p-6 md:p-8 space-y-6 animate-scale-up">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Question 5</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">How often do you lose customers because replies are too slow or missed entirely?</h3>
                  <p className="text-xs text-zinc-400">Response time directly determines checkout ratios in high-competition digital markets.</p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { val: 'Rarely (Our staff replies within 2-3 minutes)', desc: 'High response discipline, minimal missed opportunities.' },
                    { val: 'Sometimes (During peak operational rush hours)', desc: 'Response cycles drag to 20-40 minutes, causing slight conversion drops.' },
                    { val: 'Often (We find it difficult to keep up with DM volume)', desc: 'Customers wait 1-3 hours, frequently booking with competitors instead.' },
                    { val: 'All the time, honestly (We are literally drowning in chats)', desc: 'Messages get lost for 24 hours. Severe friction, visible customer complaints.' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => {
                        setReplyDelay(opt.val);
                        setCurrentStep(6);
                      }}
                      className={`p-4 border rounded-xl text-left w-full transition-all cursor-pointer flex items-center justify-between ${
                        replyDelay === opt.val
                          ? 'bg-[#3B82F6]/10 border-blue-500 text-white'
                          : 'bg-[#18181B] border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{opt.val}</span>
                        <span className="text-[10px] text-zinc-400 font-light mt-0.5 block">{opt.desc}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        replyDelay === opt.val ? 'border-blue-500' : 'border-zinc-600'
                      }`}>
                        {replyDelay === opt.val && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-[#27272A]/40 pt-6">
                  <button 
                    onClick={() => setCurrentStep(4)}
                    className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer border border-transparent hover:border-zinc-700 transition-all"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: Core Bottleneck/Pain (Tailored dynamically by industry!) */}
            {currentStep === 6 && (
              <div className="bg-[#131316] border border-[#27272A] rounded-2xl p-6 md:p-8 space-y-6 animate-scale-up">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Question 6 — tailored for {industry}</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">What is the ONE task that eats up the most operational hours?</h3>
                  <p className="text-xs text-zinc-400">Pinpoint your largest labor leakage to see how specialized AI Agents recover these lost margins.</p>
                </div>

                <div className="space-y-2.5">
                  {getPainOptions().map(pain => (
                    <button
                      key={pain}
                      onClick={() => {
                        setCorePain(pain);
                        setCurrentStep(7);
                      }}
                      className={`p-4 border rounded-xl text-left w-full transition-all cursor-pointer flex items-center justify-between ${
                        corePain === pain
                          ? 'bg-[#3B82F6]/10 border-blue-500 text-white font-bold'
                          : 'bg-[#18181B] border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs font-medium">{pain}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        corePain === pain ? 'border-blue-500' : 'border-zinc-600'
                      }`}>
                        {corePain === pain && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-[#27272A]/40 pt-6">
                  <button 
                    onClick={() => setCurrentStep(5)}
                    className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer border border-transparent hover:border-zinc-700 transition-all"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7: Customer Retention Strategy (New!) */}
            {currentStep === 7 && (
              <div className="bg-[#131316] border border-[#27272A] rounded-2xl p-6 md:p-8 space-y-6 animate-scale-up">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Question 7</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">What is your current strategy for customer retention and repeat purchases?</h3>
                  <p className="text-xs text-zinc-400">Winning a new customer costs 5x more than retaining an existing buyer. Repeat purchases determine long-term margin health.</p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { val: 'Zero follow-up (Once they buy, we rarely or never contact them again)', desc: 'Significant loss of high-intent customer lifetime value.' },
                    { val: 'Occasional manual broadcast messages (Time-consuming, high spam/block risk)', desc: 'Low conversion, high risk of getting our WhatsApp number banned.' },
                    { val: 'We store customer sheets but struggle with timing or segmentation', desc: 'Valuable contacts sit idle without strategic engagement.' },
                    { val: 'Automated follow-up sequences triggered after purchase to secure repeat deals (Ideal Status)', desc: 'Maximizes customer retention automatically without manual labor.' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => {
                        setCustomerRetention(opt.val);
                        setCurrentStep(8);
                      }}
                      className={`p-4 border rounded-xl text-left w-full transition-all cursor-pointer flex items-center justify-between ${
                        customerRetention === opt.val
                          ? 'bg-[#3B82F6]/10 border-blue-500 text-white font-bold'
                          : 'bg-[#18181B] border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{opt.val}</span>
                        <span className="text-[10px] text-zinc-400 font-light mt-0.5 block">{opt.desc}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        customerRetention === opt.val ? 'border-blue-500' : 'border-zinc-600'
                      }`}>
                        {customerRetention === opt.val && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-[#27272A]/40 pt-6">
                  <button 
                    onClick={() => setCurrentStep(6)}
                    className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer border border-transparent hover:border-zinc-700 transition-all"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 8: Time Valuation */}
            {currentStep === 8 && (
              <div className="bg-[#131316] border border-[#27272A] rounded-2xl p-6 md:p-8 space-y-6 animate-scale-up">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Question 8</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">If you got 5 extra hours back every single week, what is that worth to your business?</h3>
                  <p className="text-xs text-zinc-400">Estimate the high-leverage business value of your recovered leadership time.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Not much', val: 'Not much (Under ₦50,000/week in direct labor/deals)' },
                    { label: 'A little', val: 'A little (₦50,000 - ₦200,000/week)' },
                    { label: 'A lot', val: 'A lot (₦200,000 - ₦500,000/week)' },
                    { label: 'Everything', val: 'Everything (Over ₦500,000/week — I\'m stretched extremely thin)' }
                  ].map(val => (
                    <button
                      key={val.label}
                      onClick={() => {
                        setTimeValuation(val.val);
                        setCurrentStep(9);
                      }}
                      className={`p-5 border rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                        timeValuation === val.val
                          ? 'bg-[#3B82F6]/10 border-blue-500 text-white'
                          : 'bg-[#18181B] border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold uppercase text-zinc-500 tracking-wider block">{val.label}</span>
                      <span className="text-xs font-bold leading-normal mt-2">{val.val}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-[#27272A]/40 pt-6">
                  <button 
                    onClick={() => setCurrentStep(7)}
                    className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer border border-transparent hover:border-zinc-700 transition-all"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 9: Business Details Submission */}
            {currentStep === 9 && (
              <div className="bg-[#131316] border border-[#27272A] rounded-2xl p-6 md:p-8 space-y-6 animate-scale-up">
                <div className="space-y-1.5 text-center max-w-xl mx-auto">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold block">Final Step</span>
                  <h3 className="text-xl font-extrabold text-white">Unlock Your Custom Operational Analysis</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Enter your contact details to calculate your final annual leakage, review automation recommendations, and build your personalized operational growth playbook.
                  </p>
                </div>

                <form onSubmit={handleQuizSubmit} className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Ayomide Sholarin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#18181B] border border-[#27272A] focus:outline-none focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Business / SME Brand Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Lekki Retail Outlet"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-[#18181B] border border-[#27272A] focus:outline-none focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">WhatsApp Number</label>
                      <input 
                        type="tel"
                        required
                        placeholder="e.g. +234 80 1234 5678"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full bg-[#18181B] border border-[#27272A] focus:outline-none focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Email Address</label>
                      <input 
                        type="email"
                        required
                        placeholder="e.g. owner@lekkishop.ng"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#18181B] border border-[#27272A] focus:outline-none focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600"
                      />
                    </div>
                  </div>

                  {/* Secure Data Protection Banner */}
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">🔒 Secure Operational Diagnostic</span>
                      <span className="text-[10px] text-zinc-400 block leading-tight">Your business statistics are confidential and processed securely for diagnostic mapping only.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#27272A]/40 pt-4 mt-6">
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(8)}
                      className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer border border-transparent hover:border-zinc-700 transition-all"
                    >
                      ← Back
                    </button>
                    <button 
                      type="submit"
                      className="bg-blue-600 text-white hover:bg-blue-500 px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
                    >
                      <span>Generate Diagnostic results</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 10: Personalized Results & Dynamic Leakage Dashboard */}
            {currentStep === 10 && completedLead && (
              <div className="space-y-8 animate-scale-up">
                
                {/* Result Hero Banner */}
                <div className="bg-[#131316] border border-[#27272A] rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/5 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#27272A]/40 pb-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-mono uppercase tracking-widest font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Critical Leakage Diagnostic</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                        {completedLead.businessName} Inefficiency Audit
                      </h3>
                      <p className="text-xs text-zinc-400 font-light">
                        Prepared for <span className="font-bold text-zinc-300">{completedLead.name}</span> • Sector Node: <span className="text-blue-400 font-bold font-mono">{completedLead.industry}</span>
                      </p>
                    </div>

                    <div className="bg-[#1A1A1E] border border-[#27272A] rounded-2xl p-4 text-center md:text-right shrink-0">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Estimated Annual Revenue Leakage</span>
                      <span className="text-2xl md:text-3xl font-black text-rose-500 tracking-tight block">
                        ₦{completedLead.revenueLeakage.toLocaleString()}
                      </span>
                      <span className="text-[9px] font-mono text-rose-400/80 bg-rose-500/5 px-2 py-0.5 rounded-full mt-1 inline-block">
                        ~₦{(Math.round(completedLead.revenueLeakage / 12)).toLocaleString()} Lost Monthly
                      </span>
                    </div>
                  </div>

                  {/* Core Insights Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* BottleNeck Analysis */}
                    <div className="space-y-3 bg-[#1C1C20]/40 border border-[#27272A]/40 rounded-xl p-5 text-xs">
                      <h4 className="font-bold text-white uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500" /> Core Bottleneck Diagnosis
                      </h4>
                      <p className="text-zinc-300 leading-relaxed font-light">
                        By relying on <span className="font-bold text-white">{completedLead.channels.join(', ')}</span> and losing critical hours on <span className="font-bold text-white italic">"{completedLead.corePain}"</span>, your operations suffer severe labor inefficiencies.
                      </p>
                      <div className="p-3 bg-[#161619] border border-red-500/10 text-rose-400 rounded-lg">
                        <p className="font-bold">Loss Mechanism:</p>
                        <p className="font-light mt-1">
                          {completedLead.replyDelay.includes('Often') || completedLead.replyDelay.includes('All the time') 
                            ? 'Slow or missed responses act as immediate deal killers. Nigerian high-ticket retail buyers drop checkout carts within 5-10 minutes if not engaged immediately.'
                            : 'Manual administrative tasks are draining valuable hours that should be spent on strategic marketing, supplier scaling, and sales closing.'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Differentiator & Recommendations */}
                    <div className="space-y-3 bg-[#1C1C20]/40 border border-[#27272A]/40 rounded-xl p-5 text-xs">
                      <h4 className="font-bold text-white uppercase font-mono tracking-wider text-cyan-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" /> tailored Flow OS Solutions
                      </h4>
                      <p className="text-zinc-300 leading-relaxed font-light">
                        Deploying specialized Flow OS agents can recover up to <span className="font-bold text-green-400">85% of this leakage</span> by automating repetitive tasks:
                      </p>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        <div className="flex items-start gap-2.5 p-2 bg-[#161619]/60 border border-[#27272A]/30 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-white block">Deploy Auto-Reply Specialist Agent</span>
                            <span className="text-[10px] text-zinc-400 font-light">Automate pricing, specifications, and availability across WhatsApp & IG Shop instantly.</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 p-2 bg-[#161619]/60 border border-[#27272A]/30 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-white block">Connect Central Spreadsheet Integration</span>
                            <span className="text-[10px] text-zinc-400 font-light">Automatically synchronize and log all orders, customer requests, and ledger updates.</span>
                          </div>
                        </div>
                        {completedLead.stockTracking && !completedLead.stockTracking.includes('Fully automated') && (
                          <div className="flex items-start gap-2.5 p-2 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-white block">Deploy Cross-Channel Inventory Sync</span>
                              <span className="text-[10px] text-zinc-400 font-light">Eliminate double-selling by automatically subtracting stock across storefronts and chat channels.</span>
                            </div>
                          </div>
                        )}
                        {completedLead.paymentVerification && !completedLead.paymentVerification.includes('Automated') && (
                          <div className="flex items-start gap-2.5 p-2 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-white block">Deploy Webhook Payment Verification Specialist</span>
                              <span className="text-[10px] text-zinc-400 font-light">Instantly confirm bank transfers without manual owner intervention, guarding against fake receipts.</span>
                            </div>
                          </div>
                        )}
                        {completedLead.customerRetention && !completedLead.customerRetention.includes('Automated') && (
                          <div className="flex items-start gap-2.5 p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-white block">Configure Post-Purchase WhatsApp Retention Loop</span>
                              <span className="text-[10px] text-zinc-400 font-light">Schedule automated follow-ups and feedback triggers to secure lucrative secondary sales.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Operational Audit generated successfully confirmation */}
                  <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <div className="flex-1">
                      <p className="font-bold">Custom Operational Audit Compiled Successfully!</p>
                      <p className="font-light text-[10px] text-zinc-400 mt-0.5">
                        Your efficiency metrics and optimization playbooks have been prepared. Use the scheduling assistant below to book your consultation slot.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 justify-between">
                    <button 
                      onClick={handleResetQuiz}
                      className="w-full sm:w-auto px-4 py-2 border border-[#27272A] hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-all"
                    >
                      ← Reset Diagnostic Quiz
                    </button>

                    <button 
                      onClick={() => {
                        // Open storefront but preset the category or trigger customized demo
                        onBackToLanding();
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-[#27272A] text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      Explore Interactive Demo OS Node
                    </button>
                  </div>
                </div>

                {/* MEETING BOOKER SECTION (Section 2/4 of SME Playbook) */}
                <div className="bg-[#131316] border border-[#27272A] rounded-2xl p-6 md:p-8 space-y-6 relative">
                  <div className="space-y-1.5 text-center max-w-xl mx-auto">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#3B82F6]/10 border border-[#3B82F6]/25 text-[#3B82F6] text-[10px] font-mono uppercase tracking-widest font-bold rounded-full">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>SME Action Step</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white">Book a 15-Min System Architecture Session</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-light">
                      Let's map out your exact customer channels, deploy the AI Agents sandbox for your brand, and configure your live Google Sheets integration. Zero obligation.
                    </p>
                  </div>

                  {!isBooked ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-3xl mx-auto">
                      
                      {/* Left: Scheduler selectors */}
                      <div className="md:col-span-7 space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">1. Select Growth Consultation Date</label>
                            {googleToken ? (
                              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                                {isLoadingCalendar ? (
                                  <>
                                    <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                                    <span className="text-zinc-500">Syncing...</span>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-green-400 font-bold">Calendar Synced</span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span className="text-[9px] font-mono text-zinc-600 uppercase">Offline Mode</span>
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { label: 'Fri 17', val: '2026-07-17', display: 'July 17' },
                              { label: 'Mon 20', val: '2026-07-20', display: 'July 20' },
                              { label: 'Tue 21', val: '2026-07-21', display: 'July 21' },
                              { label: 'Wed 22', val: '2026-07-22', display: 'July 22' },
                            ].map(d => (
                              <button
                                key={d.val}
                                type="button"
                                onClick={() => {
                                  setSelectedDate(d.val);
                                  setSelectedTime(''); // Reset time on date change to re-verify busy slots
                                }}
                                className={`p-3 border rounded-xl text-center transition-all cursor-pointer ${
                                  selectedDate === d.val 
                                    ? 'bg-[#3B82F6]/15 border-blue-500 text-white font-bold' 
                                    : 'bg-[#18181B] border-[#27272A] text-zinc-400 hover:text-white'
                                }`}
                              >
                                <span className="text-[11px] block">{d.label}</span>
                                <span className="text-[8px] font-mono text-zinc-500 mt-1 block">{d.display}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">2. Select Hour Slot (West Africa Time)</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              '09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'
                            ].map(t => {
                              const isBusy = googleToken && selectedDate ? isSlotBusy(selectedDate, t, bookedEvents) : false;
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => setSelectedTime(t)}
                                  className={`p-2.5 border rounded-xl text-center transition-all cursor-pointer font-mono text-xs relative ${
                                    isBusy
                                      ? 'bg-red-500/5 border-red-500/20 text-red-500/30 line-through cursor-not-allowed'
                                      : selectedTime === t 
                                        ? 'bg-[#3B82F6]/15 border-blue-500 text-white font-bold' 
                                        : 'bg-[#18181B] border-[#27272A] text-zinc-400 hover:text-white'
                                  }`}
                                >
                                  {t}
                                  {isBusy && (
                                    <span className="absolute -bottom-1 -right-1 bg-rose-950 text-red-400 text-[7px] font-mono px-1 py-0.5 rounded border border-red-500/20 uppercase font-bold tracking-tight">
                                      Busy
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right: Comments & lock button */}
                      <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">3. Custom Growth Notes (Optional)</label>
                          <textarea 
                            rows={3}
                            placeholder="Tell us about specific automation goals (e.g., 'We struggle with answering Instagram DMs for luxury watches')."
                            value={bookingNotes}
                            onChange={(e) => setBookingNotes(e.target.value)}
                            className="w-full bg-[#18181B] border border-[#27272A] focus:outline-none focus:border-blue-500 rounded-xl p-3 text-xs text-white placeholder-zinc-600 resize-none"
                          />
                        </div>

                        <button
                          onClick={handleBookMeeting}
                          disabled={!selectedDate || !selectedTime || isSyncing}
                          className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            selectedDate && selectedTime && !isSyncing
                              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]' 
                              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          }`}
                        >
                          {isSyncing ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Booking Workspace Session...</span>
                            </>
                          ) : (
                            <>
                              <Calendar className="w-4 h-4" />
                              <span>Lock consultation appointment</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  ) : (
                    /* Meeting Confirmed State */
                    <div className="bg-[#1C1C20]/50 border border-green-500/20 rounded-2xl p-8 max-w-lg mx-auto text-center space-y-4 animate-scale-up">
                      <div className="w-12 h-12 bg-green-500/15 text-green-400 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-6 h-6 animate-pulse" />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-white text-lg">Consultation Scheduled!</h4>
                        <p className="text-xs text-zinc-400">
                          Your system architecture session is fully logged. A confirmation node has been synced to your contact detail.
                        </p>
                      </div>

                      <div className="p-4 bg-[#131316] border border-[#27272A] rounded-xl text-xs text-left divide-y divide-[#27272A]/40 space-y-2">
                        <div className="flex justify-between pb-2">
                          <span className="text-zinc-500">Business Name</span>
                          <span className="font-bold text-white">{completedLead.businessName}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-zinc-500">Representative</span>
                          <span className="font-bold text-white">{completedLead.name}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-zinc-500">Date & Hour Slot</span>
                          <span className="font-bold text-cyan-400 font-mono">{selectedDate} at {selectedTime}</span>
                        </div>
                        {completedLead.booking?.meetLink && (
                          <div className="flex flex-col gap-1.5 py-2.5">
                            <span className="text-zinc-500 font-semibold block">Google Meet Room Link</span>
                            <a 
                              href={completedLead.booking.meetLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-xl font-bold text-blue-400 transition-all font-mono break-all flex items-center justify-center gap-2 text-xs"
                            >
                              <Video className="w-4 h-4 text-blue-400 shrink-0" />
                              <span>Join Google Meet Session</span>
                              <ExternalLink className="w-3 h-3 text-blue-400/70" />
                            </a>
                          </div>
                        )}
                        {bookingNotes && (
                          <div className="pt-2">
                            <span className="text-zinc-500 block mb-1">Growth Notes:</span>
                            <p className="text-zinc-400 font-light italic text-[11px]">"{bookingNotes}"</p>
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-blue-500/5 border border-blue-500/10 text-[10px] text-zinc-400 rounded-xl leading-relaxed">
                        {completedLead.booking?.meetLink ? (
                          <span>📅 A Google Calendar invitation with a <b>Google Meet call</b> has been scheduled and dispatched to <span className="text-white font-mono">{completedLead.email}</span>. Please verify your calendar app.</span>
                        ) : (
                          <span>📅 A Google Calendar invitation draft has been prepared for <span className="text-white font-mono">{completedLead.email}</span>. Our specialist will reach out to connect and map out your custom operating roadmap.</span>
                        )}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

        {/* Sheets Tab Deleted */}

      </main>

    </div>
  );
}
