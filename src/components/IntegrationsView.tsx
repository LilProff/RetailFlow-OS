import React, { useState } from 'react';
import { Integration, QuizLead } from '../types';
import { appendLeadToGoogleSheet } from '../lib/sheets';
import { createCalendarMeetEvent } from '../lib/calendar';
import { 
  X, 
  Settings, 
  Sparkles, 
  Check, 
  MessageSquare, 
  Instagram, 
  Calendar, 
  TrendingUp, 
  FolderPlus, 
  Radio, 
  FileCheck,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Database,
  CheckCircle,
  Info,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
  Terminal,
  Activity
} from 'lucide-react';

interface IntegrationsViewProps {
  integrations: Integration[];
  onToggleIntegration: (id: string) => void;
  onConnectIntegration: (id: string) => void;
  
  // Real Google Sheets props
  googleUser: any;
  googleToken: string | null;
  onGoogleSignIn: () => Promise<void>;
  onGoogleSignOut: () => Promise<void>;
  googleSpreadsheetId: string;
  onSetGoogleSpreadsheetId: (id: string) => void;
  onCreateNewSheet: () => Promise<void>;
  onTestSheetsSync: () => Promise<void>;

  // Theme settings
  darkMode: boolean;
  onToggleDarkMode: () => void;

  // Sync Diagnostics
  rawLeads: QuizLead[];
}

export default function IntegrationsView({
  integrations,
  onToggleIntegration,
  onConnectIntegration,
  googleUser,
  googleToken,
  onGoogleSignIn,
  onGoogleSignOut,
  googleSpreadsheetId,
  onSetGoogleSpreadsheetId,
  onCreateNewSheet,
  onTestSheetsSync,
  darkMode,
  onToggleDarkMode,
  rawLeads
}: IntegrationsViewProps) {
  
  const [selectedInt, setSelectedInt] = useState<Integration | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSheetsConfig, setShowSheetsConfig] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isTestingSheet, setIsTestingSheet] = useState(false);
  const [activeToast, setActiveToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Sync Diagnostics States
  const [selectedLeadId, setSelectedLeadId] = useState<string>('demo-lead-tester');
  const [diagnosticsLogs, setDiagnosticsLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [SYSTEM] Diagnostics console online. Connect Google account to verify live handshakes.`
  ]);
  const [isRunningDiagSheets, setIsRunningDiagSheets] = useState(false);
  const [isRunningDiagCal, setIsRunningDiagCal] = useState(false);

  const addLog = (msg: string) => {
    setDiagnosticsLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const demoLead: QuizLead = {
    id: 'demo-lead-tester',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    name: 'Amaka Lagos Tester',
    businessName: 'Lagos Flow Test Ltd',
    whatsapp: '+234 800 TEST FLOW',
    email: 'tester@flowos.com',
    industry: 'Retail Flow',
    channels: ['WhatsApp Business', 'Instagram Shop'],
    replyDelay: 'Often',
    corePain: 'Manual messaging bottlenecks',
    timeValuation: 'A lot',
    revenueLeakage: 1200000,
    booking: {
      date: '2026-07-20',
      time: '10:00 AM',
      notes: 'Test lead sync connection is working perfectly!'
    },
    syncedToSheets: false
  };

  const activeLeads = rawLeads && rawLeads.length > 0 ? rawLeads : [demoLead];
  const activeLead = activeLeads.find(l => l.id === selectedLeadId) || activeLeads[0];

  const handleManualSyncSheets = async (lead: QuizLead) => {
    if (!googleToken) {
      addLog('❌ Sync Failed: No active Google OAuth Token. Please connect above.');
      return;
    }
    if (!googleSpreadsheetId) {
      addLog('❌ Sync Failed: Missing Google Spreadsheet ID. Use "Create Fresh Sheet" or paste one.');
      return;
    }

    setIsRunningDiagSheets(true);
    addLog(`⏳ Initializing Google Sheets handshake for lead: ${lead.name}...`);
    addLog(`📡 Target Spreadsheet ID: "${googleSpreadsheetId}"`);
    addLog(`📡 Target range configured: 'Growth_Leads!A:K'`);
    addLog(`🔐 Header payload configured with Google Bearer Token...`);

    try {
      await appendLeadToGoogleSheet(googleToken, googleSpreadsheetId, lead);
      addLog(`✨ API RESPONSE: 200 OK. Successfully appended lead row to sheet tab "Growth_Leads"!`);
      showToast('Successfully verified Google Sheets row append! Click the spreadsheet link below to view it.', 'success');
    } catch (err: any) {
      const errMsg = err.message || String(err);
      addLog(`❌ Google Sheets API Error: ${errMsg}`);
      addLog(`💡 Troubleshooting Guide:`);
      addLog(`   1. Did you grant Google Sheets permissions during login? (Check both boxes!)`);
      addLog(`   2. Is the spreadsheet ID valid and owned by your account?`);
      showToast(`Sheets sync verification failed. See diagnostics console below.`, 'info');
    } finally {
      setIsRunningDiagSheets(false);
    }
  };

  const handleManualSyncCalendar = async (lead: QuizLead) => {
    if (!googleToken) {
      addLog('❌ Calendar Sync Failed: No active Google OAuth Token. Please connect above.');
      return;
    }
    if (!lead.booking) {
      addLog('❌ Calendar Sync Skipped: Selected lead has no consultation date & hour scheduled.');
      return;
    }

    setIsRunningDiagCal(true);
    addLog(`⏳ Scheduling consultation with Google Calendar API for lead: ${lead.name}...`);
    addLog(`📅 Scheduled Time slot: ${lead.booking.date} at ${lead.booking.time} (WAT)`);
    addLog(`🔐 Sending request with automated Google Meet video meeting room generation...`);

    try {
      const result = await createCalendarMeetEvent(googleToken, {
        summary: `RetailFlow OS - SME Consultation (${lead.businessName})`,
        description: `15-Min System Architecture Session with ${lead.name}.\n\nGrowth Notes: ${lead.booking.notes || 'None'}\n\nEstimated Annual Revenue Leakage: ₦${lead.revenueLeakage.toLocaleString()}`,
        date: lead.booking.date,
        time: lead.booking.time,
        attendeeEmail: lead.email
      });

      addLog(`✨ API RESPONSE: 200 OK. Event successfully created with ID: "${result.eventId}"`);
      if (result.hangoutLink) {
        addLog(`📹 Google Meet Synced Room URI: ${result.hangoutLink}`);
      }
      showToast('Successfully verified Google Calendar sync and generated a Google Meet room!', 'success');
    } catch (err: any) {
      const errMsg = err.message || String(err);
      addLog(`❌ Google Calendar API Error: ${errMsg}`);
      addLog(`💡 Troubleshooting Guide:`);
      addLog(`   1. Did you grant Google Calendar permissions during login? (Verify both checkbox scopes!)`);
      addLog(`   2. Make sure your primary calendar has not been modified or deleted.`);
      showToast(`Calendar sync verification failed. See diagnostics console below.`, 'info');
    } finally {
      setIsRunningDiagCal(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 5000);
  };

  // Handle clicking Connect button on integration card
  const handleConnectClick = (int: Integration) => {
    if (int.id === 'int-sheets' || int.id === 'int-4') {
      if (googleToken) {
        if (int.id === 'int-sheets') {
          setShowSheetsConfig(true);
        } else {
          showToast('Google Calendar is already connected and active for lead scheduling.', 'info');
        }
      } else {
        // Run Google OAuth flow
        setIsConnecting(true);
        onGoogleSignIn()
          .then(() => {
            onConnectIntegration('int-sheets');
            onConnectIntegration('int-4');
            if (int.id === 'int-sheets') {
              setShowSheetsConfig(true);
            } else {
              showToast('Successfully connected Google Workspace Calendar & Meet! Customers can now book meetings on your calendar.');
            }
          })
          .catch(err => {
            console.error('Google sign-in error:', err);
            showToast(`Sign-In failed: ${err.message || err}`, 'info');
          })
          .finally(() => {
            setIsConnecting(false);
          });
      }
    } else {
      if (int.isConnected) {
        onToggleIntegration(int.id);
      } else {
        setSelectedInt(int);
      }
    }
  };

  // Perform mock OAuth simulator authorization
  const authorizeConnection = () => {
    if (!selectedInt) return;
    setIsConnecting(true);

    setTimeout(() => {
      onConnectIntegration(selectedInt.id);
      setIsConnecting(false);
      setSelectedInt(null);
      showToast(`Integration Successful! ${selectedInt.name} is now connected and synced with your local Lagos retail node.`);
    }, 1200);
  };

  // Trigger Google Sheet creation
  const handleCreateNewSheet = async () => {
    setIsCreatingSheet(true);
    try {
      await onCreateNewSheet();
      showToast('Success! Created a brand new "RetailFlow OS" Google Sheet and configured it as your sync ledger.');
    } catch (error: any) {
      showToast(`Failed to create spreadsheet: ${error.message || error}`, 'info');
    } finally {
      setIsCreatingSheet(false);
    }
  };

  // Trigger Sheet Sync Test
  const handleTestSync = async () => {
    setIsTestingSheet(true);
    try {
      await onTestSheetsSync();
      showToast('Mock Sync Successful! Written test row to your Google Sheet. Open the sheet to verify your columns.');
    } catch (error: any) {
      showToast(`Sync test failed: ${error.message || error}`, 'info');
    } finally {
      setIsTestingSheet(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="fixed top-4 right-4 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 max-w-md animate-slide-left border border-slate-800">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0">
            {activeToast.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
          </div>
          <p className="text-xs font-medium leading-normal">{activeToast.message}</p>
        </div>
      )}

      {/* Settings & Preferences Head Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2 text-blue-700 mb-2 font-bold">
            <Settings className="w-4 h-4 animate-spin-slow" />
            <span className="font-mono text-xs uppercase tracking-wider font-extrabold">Integrations Hub</span>
          </div>
          <h2 className="text-xl font-black text-slate-950 mb-2">Connect Your Existing Channels & Ledgers</h2>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            RetailFlow OS sits on top of your existing social storefronts and financial software. Link your feeds below. The AI layers will automatically begin indexing items, drafts, and price queries.
          </p>
        </div>

        {/* Workspace Theme Preference Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/[0.02] rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-2 text-purple-600 mb-2 font-bold">
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="font-mono text-xs uppercase tracking-wider font-extrabold">Workspace Settings</span>
            </div>
            <h2 className="text-base font-extrabold text-slate-950 mb-1.5">Theme Preference</h2>
            <p className="text-xs text-slate-500 leading-normal">
              Toggle between Light and Dark interface modes to customize your workspace environment.
            </p>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
              Current: {darkMode ? 'Dark Slate' : 'Light Slate'}
            </span>
            <button
              id="theme-toggle-settings"
              onClick={onToggleDarkMode}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                darkMode
                  ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>Use Light Theme</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-700" />
                  <span>Use Dark Theme</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(int => {
          // Both Google Sheets and Google Calendar use the real googleToken to determine connection
          const isConnected = (int.id === 'int-sheets' || int.id === 'int-4') ? !!googleToken : int.isConnected;

          return (
            <div 
              key={int.id}
              className={`bg-white border rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all relative shadow-sm ${
                isConnected ? 'border-green-300 ring-1 ring-green-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* Icon switcher */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    int.iconType === 'whatsapp' ? 'bg-green-50 text-green-600 border border-green-100' :
                    int.iconType === 'instagram' ? 'bg-pink-50 text-pink-600 border border-pink-100' :
                    int.iconType === 'pos' ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' :
                    int.iconType === 'gcal' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    int.iconType === 'sage' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    int.iconType === 'sheets' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {int.iconType === 'whatsapp' && <MessageSquare className="w-5 h-5" />}
                    {int.iconType === 'instagram' && <Instagram className="w-5 h-5" />}
                    {int.iconType === 'pos' && <Radio className="w-5 h-5 animate-pulse" />}
                    {int.iconType === 'gcal' && <Calendar className="w-5 h-5" />}
                    {int.iconType === 'sage' && <FileCheck className="w-5 h-5" />}
                    {int.iconType === 'quickbooks' && <FolderPlus className="w-5 h-5" />}
                    {int.iconType === 'sheets' && <FileSpreadsheet className="w-5 h-5" />}
                  </div>

                  <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isConnected 
                      ? 'bg-green-50 border border-green-100 text-green-700' 
                      : 'bg-slate-100 border border-slate-200 text-slate-500'
                  }`}>
                    {isConnected ? 'Active & Synced' : 'Disconnected'}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-950 text-base">{int.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono font-bold mt-0.5 block">{int.tag}</span>
                  <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-light">
                    {int.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono font-bold">
                  {(int.id === 'int-sheets' || int.id === 'int-4') ? (googleToken ? 'Authenticated API' : 'Google OAuth 2.0') : (isConnected ? 'OAuth Node Ver.' : 'Requires API Consent')}
                </span>

                <div className="flex gap-2">
                  {int.id === 'int-sheets' && isConnected && (
                    <button 
                      onClick={() => setShowSheetsConfig(true)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border border-slate-250 text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                    >
                      Configure
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (int.id === 'int-sheets' || int.id === 'int-4') {
                        if (isConnected) {
                          onGoogleSignOut().then(() => {
                            showToast('Successfully disconnected Google Workspace integrations.', 'info');
                          });
                        } else {
                          handleConnectClick(int);
                        }
                      } else {
                        handleConnectClick(int);
                      }
                    }}
                    disabled={isConnecting}
                    className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isConnected 
                        ? 'border border-rose-200 bg-rose-50/50 text-rose-700 hover:bg-rose-50' 
                        : 'bg-blue-700 hover:bg-blue-800 text-white shadow-xs'
                    }`}
                  >
                    {isConnecting ? 'Signing In...' : (isConnected ? 'Disconnect' : 'Connect')}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Live Integration Sync & Diagnostics Console */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">🔌 Live Integration Sync & Diagnostics Console</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Verify API connections, run direct diagnostic handshakes, and debug Google scope permissions.</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {googleSpreadsheetId && (
              <a 
                href={`https://docs.google.com/spreadsheets/d/${googleSpreadsheetId}/edit`} 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Open Spreadsheet ↗</span>
              </a>
            )}
            <a 
              href="https://calendar.google.com/" 
              target="_blank" 
              rel="noreferrer" 
              className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/35 border border-blue-100 dark:border-blue-900/50 rounded-xl text-blue-700 dark:text-blue-400 font-bold hover:underline flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Open Calendar ↗</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel: Trigger diagnostics */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
                STEP 1: SELECT DIAGNOSTIC LEAD TARGET
              </span>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Available Leads</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-3 py-2 focus:border-blue-500 dark:focus:border-blue-400 outline-none text-slate-900 dark:text-slate-100 font-mono font-semibold cursor-pointer"
                >
                  {activeLeads.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.businessName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl space-y-2 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{activeLead.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Leakage</span>
                  <span className="font-bold text-red-600 dark:text-red-400">₦{activeLead.revenueLeakage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scheduled slot</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">
                    {activeLead.booking ? `${activeLead.booking.date} at ${activeLead.booking.time}` : 'Not scheduled'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
                STEP 2: RUN TEST HANDSHAKE
              </span>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleManualSyncSheets(activeLead)}
                  disabled={!googleToken || isRunningDiagSheets}
                  className="px-3 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 rounded-xl text-[11px] font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRunningDiagSheets ? 'animate-spin' : ''}`} />
                  <span>{isRunningDiagSheets ? 'Syncing...' : 'Sync to Sheets'}</span>
                </button>

                <button
                  onClick={() => handleManualSyncCalendar(activeLead)}
                  disabled={!googleToken || isRunningDiagCal || !activeLead.booking}
                  className="px-3 py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 rounded-xl text-[11px] font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isRunningDiagCal ? 'Booking...' : 'Book Calendar'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: Console debugger logs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 h-[310px]">
            <div className="bg-slate-950 dark:bg-black rounded-2xl border border-slate-800 p-4 font-mono text-[10px] text-slate-300 flex-1 flex flex-col overflow-hidden shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2 text-slate-500 font-extrabold">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-blue-500" />
                  <span>RETAILFLOW_HANDSHAKE_DEBUGLOG.TXT</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span>LIVE CONSOLE</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800 pr-1 select-text">
                {diagnosticsLogs.map((log, idx) => (
                  <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              <strong className="text-slate-950 dark:text-slate-200 font-extrabold block mb-1">💡 Troubleshooting Google Scope Permissions:</strong>
              When signing in with your Google Workspace Account, Google displays a security checklist where you <b>must check the specific checkboxes</b> to allow Sheets and Calendar access. If these are unchecked, writes will fail with a <code>403 Forbidden</code> error. To fix this, click <b>Disconnect</b>, clear your cookies, and click <b>Connect</b> again, ensuring all checkboxes are checked!
            </div>
          </div>

        </div>
      </div>

      {/* Real Google Sheets Configuration Modal */}
      {showSheetsConfig && googleToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowSheetsConfig(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl space-y-6 animate-scale-up">
            <button 
              onClick={() => setShowSheetsConfig(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-150 flex items-center justify-center text-emerald-600">
                <FileSpreadsheet className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950">Google Sheets Integration</h3>
                <p className="text-xs text-emerald-600 font-mono font-bold">Connection Status: Active & Secured</p>
              </div>
            </div>

            {googleUser && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                {googleUser.photoURL ? (
                  <img src={googleUser.photoURL} alt={googleUser.displayName} className="w-8 h-8 rounded-full border border-slate-150" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                    {googleUser.email ? googleUser.email[0].toUpperCase() : 'G'}
                  </div>
                )}
                <div>
                  <span className="text-xs font-bold text-slate-950 block">{googleUser.displayName || 'Google Account Owner'}</span>
                  <span className="text-[10px] text-slate-400 block font-mono font-bold">{googleUser.email}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block font-bold">Target Spreadsheet ID</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={googleSpreadsheetId}
                    onChange={(e) => onSetGoogleSpreadsheetId(e.target.value)}
                    placeholder="Enter your Google Spreadsheet ID"
                    className="flex-1 bg-slate-50 border border-slate-250 focus:outline-none focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-950 placeholder-slate-400 font-mono font-medium"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block leading-tight font-semibold">
                  You can find this ID in your Google Sheet URL: <code>https://docs.google.com/spreadsheets/d/<b>SPREADSHEET_ID</b>/edit</code>
                </span>
                {googleSpreadsheetId && (
                  <div className="pt-1">
                    <a 
                      href={`https://docs.google.com/spreadsheets/d/${googleSpreadsheetId}/edit`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 hover:text-emerald-700 transition-all font-mono"
                    >
                      <span>Open Connected Google Sheet ↗</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleCreateNewSheet}
                  disabled={isCreatingSheet}
                  className="flex-1 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 disabled:bg-slate-100 disabled:text-slate-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isCreatingSheet ? 'Creating Drive Sheet...' : 'Create Fresh Sheet for Me'}</span>
                </button>

                <button
                  onClick={handleTestSync}
                  disabled={isTestingSheet || !googleSpreadsheetId}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-250 disabled:opacity-50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-4 h-4 ${isTestingSheet ? 'animate-spin' : ''}`} />
                  <span>{isTestingSheet ? 'Syncing...' : 'Test Sync / Write Row'}</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-150 flex items-center justify-between">
              <button
                onClick={() => {
                  onGoogleSignOut();
                  setShowSheetsConfig(false);
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Disconnect Account
              </button>
              <button
                onClick={() => setShowSheetsConfig(false)}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white border border-transparent rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mock OAuth Simulator Modal (for other services) */}
      {selectedInt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedInt(null)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl animate-scale-up">
            <button 
              onClick={() => setSelectedInt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-blue-50 border border-blue-150 flex items-center justify-center text-blue-700">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950">OAuth Secure Handshake</h3>
                <p className="text-[10px] text-slate-400 font-mono font-bold">auth.retailflow.com/lagos</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 mb-6">
              <p className="text-xs text-slate-800 font-medium">
                <strong className="text-slate-950">RetailFlow OS (TechHub Lagos Node)</strong> is requesting authorization to connect with your official <strong className="text-slate-950">{selectedInt.name}</strong> API:
              </p>
              <div className="space-y-1.5 text-[11px] text-slate-500 font-mono font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="text-green-600">✔</span> <span>Read stock lists and pricing tags</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-600">✔</span> <span>Push finalized order data and buyer receipts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-600">✔</span> <span>Draft and trigger automated responder hooks</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedInt(null)}
                className="flex-1 border border-slate-250 hover:bg-slate-50 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              
              <button 
                onClick={authorizeConnection}
                disabled={isConnecting}
                className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-100 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              >
                {isConnecting ? 'Syncing Catalog...' : 'Authorize Connection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
