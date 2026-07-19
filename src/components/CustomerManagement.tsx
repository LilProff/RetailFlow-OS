import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  TrendingUp, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  MessageSquare, 
  X, 
  Filter, 
  Send,
  AlertCircle,
  TrendingDown,
  ShieldAlert,
  ChevronRight,
  UserCheck,
  Check,
  CheckCircle,
  Info
} from 'lucide-react';
import { CustomerProfile, Order } from '../types';

interface CustomerManagementProps {
  customers: CustomerProfile[];
  orders: Order[];
  onUpdateCustomer: (id: string, updates: Partial<CustomerProfile>) => void;
}

export default function CustomerManagement({ 
  customers, 
  orders, 
  onUpdateCustomer 
}: CustomerManagementProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<'ALL' | 'Satisfied' | 'Neutral' | 'At Risk'>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<'ALL' | 'Lekki' | 'Ikeja' | 'Victoria Island'>('ALL');
  
  // Drawer state
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  
  // Follow up state
  const [followUpChannel, setFollowUpChannel] = useState<'WhatsApp' | 'Email'>('WhatsApp');
  const [followUpText, setFollowUpText] = useState("Hi there! Aisha here from TechHub. We noticed you left a premium device in your cart. Apply code 'LAGOSDEV5' for a 5% instant discount and same-day free delivery across Lekki today!");
  const [followUpSuccess, setFollowUpSuccess] = useState(false);
  const [activeToast, setActiveToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 5000);
  };

  // Filters logic
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.phone.includes(searchQuery);
    
    const matchesSentiment = selectedSentiment === 'ALL' || c.sentiment === selectedSentiment;
    
    let matchesLoc = true;
    if (selectedLocation !== 'ALL') {
      matchesLoc = c.location.toLowerCase().includes(selectedLocation.toLowerCase());
    }

    return matchesSearch && matchesSentiment && matchesLoc;
  });

  // KPI aggregates
  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgSpent = customers.length > 0 ? totalSpentAll / customers.length : 0;
  const satisfiedCount = customers.filter(c => c.sentiment === 'Satisfied').length;
  const atRiskCount = customers.filter(c => c.sentiment === 'At Risk').length;

  const handleOpenCustomer = (customer: CustomerProfile) => {
    setSelectedCustomer(customer);
    setFollowUpSuccess(false);
    
    // Preset contextual text based on client details
    if (customer.sentiment === 'At Risk') {
      setFollowUpText(`Hello ${customer.name}, we want to ensure you're fully satisfied with your TechHub products. Our local team is offering a priority concierge diagnostic service for your order. Let us know when is best to schedule!`);
    } else {
      setFollowUpText(`Hi ${customer.name}! This is TechHub concierge. We appreciate your purchase with us. Here is an exclusive priority invitation to our Lagos Retail Expo on Victoria Island next weekend!`);
    }
  };

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    setFollowUpSuccess(true);
    setTimeout(() => {
      setFollowUpSuccess(false);
      setFollowUpText('');
      showToast(`Follow-up successfully pushed to ${selectedCustomer?.name} via WhatsApp Gateway!`);
    }, 1500);
  };

  const handleUpdateSentiment = (sentiment: CustomerProfile['sentiment']) => {
    if (!selectedCustomer) return;
    onUpdateCustomer(selectedCustomer.id, { sentiment });
    setSelectedCustomer(prev => prev ? { ...prev, sentiment } : null);
    showToast(`Successfully updated sentiment to ${sentiment}!`);
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

      {/* Dynamic Summary KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Total Directory CRM</span>
            <span className="text-2xl font-black text-slate-950">{customers.length}</span>
            <span className="text-[10px] font-mono text-green-600 block font-bold">+12% vs last month</span>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Customer LTV (Avg)</span>
            <span className="text-2xl font-black text-slate-950">₦{Math.round(avgSpent).toLocaleString()}</span>
            <span className="text-[10px] font-mono text-cyan-600 block font-bold">High-Ticket Electronics</span>
          </div>
          <div className="w-10 h-10 bg-cyan-50 text-cyan-700 rounded-xl flex items-center justify-center border border-cyan-100 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">CRM Satisfaction</span>
            <span className="text-2xl font-black text-slate-950">
              {customers.length > 0 ? Math.round((satisfiedCount / customers.length) * 100) : 0}%
            </span>
            <span className="text-[10px] font-mono text-green-600 block font-bold">{satisfiedCount} Satisfied profiles</span>
          </div>
          <div className="w-10 h-10 bg-green-50 text-green-700 rounded-xl flex items-center justify-center border border-green-100 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">At Risk Clients</span>
            <span className="text-2xl font-black text-rose-600">{atRiskCount}</span>
            <span className="text-[10px] font-mono text-rose-600 block font-bold">Requires follow-up</span>
          </div>
          <div className="w-10 h-10 bg-rose-50 text-rose-700 rounded-xl flex items-center justify-center border border-rose-100 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* CRM Search & Filters bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
        
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Search clients by name, email, phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs text-slate-950 placeholder-slate-400 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2.5 items-center w-full lg:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>

          {/* Sentiment Filter */}
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-0.5 text-[10px] font-mono font-bold">
            {(['ALL', 'Satisfied', 'Neutral', 'At Risk'] as const).map(sent => (
              <button
                key={sent}
                onClick={() => setSelectedSentiment(sent)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedSentiment === sent 
                    ? 'bg-white text-slate-950 font-black shadow-xs' 
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {sent === 'ALL' ? 'ALL SENTIMENTS' : sent}
              </button>
            ))}
          </div>

          {/* Location Filter */}
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-0.5 text-[10px] font-mono font-bold font-bold">
            {(['ALL', 'Lekki', 'Ikeja', 'Victoria Island'] as const).map(loc => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedLocation === loc 
                    ? 'bg-white text-slate-950 font-black shadow-xs' 
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {loc === 'ALL' ? 'ALL LOCATIONS' : loc}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Main Table view of Clients */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono text-[10px] uppercase tracking-wider font-extrabold">
                <th className="p-4 pl-6">Client Name</th>
                <th className="p-4">Contact Detail</th>
                <th className="p-4">Delivery Location</th>
                <th className="p-4">Lifetime Spent</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Sentiment Score</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <tr 
                    key={customer.id}
                    onClick={() => handleOpenCustomer(customer)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 pl-6 font-bold text-slate-950 group-hover:text-blue-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold shadow-xs">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-bold text-slate-950">{customer.name}</span>
                          <span className="block text-[9px] font-mono text-slate-400 mt-0.5">CRM ID: {customer.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>
                        <span className="block font-medium">{customer.email}</span>
                        <span className="block text-slate-400 mt-0.5 font-semibold">{customer.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" /> {customer.location}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-950">
                      ₦{customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-400">
                      {customer.orderCount} orders
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-black uppercase ${
                        customer.sentiment === 'Satisfied' ? 'bg-green-50 border border-green-150 text-green-700' :
                        customer.sentiment === 'Neutral' ? 'bg-slate-50 border border-slate-150 text-slate-500' :
                        'bg-rose-50 border border-rose-150 text-rose-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          customer.sentiment === 'Satisfied' ? 'bg-green-500' :
                          customer.sentiment === 'Neutral' ? 'bg-slate-400' :
                          'bg-rose-500'
                        }`} />
                        {customer.sentiment}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCustomer(customer);
                        }}
                        className="text-xs text-blue-700 hover:text-blue-800 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer font-bold"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-bold">
                    No clients matched your search filters. Try adjusting query inputs!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Customer Detail Side Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setSelectedCustomer(null)} />
          
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between p-6 z-10 animate-slide-left overflow-y-auto no-scrollbar">
            
            <div className="space-y-6 pb-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-black text-base shadow-xs">
                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 text-base leading-none">{selectedCustomer.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400 mt-1 block uppercase font-bold">Lagos Client Ledger CRM</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CRM Client stats cards */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase mb-1 font-bold">Lifetime Spent</span>
                  <span className="text-base font-black text-blue-700">₦{selectedCustomer.totalSpent.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase mb-1 font-bold">Fled Orders</span>
                  <span className="text-base font-black text-slate-950">{selectedCustomer.orderCount} Orders</span>
                </div>
              </div>

              {/* Core Details */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-150 pb-1">Profile Metadata</h4>
                
                <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Email: <span className="font-bold text-slate-950">{selectedCustomer.email}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Phone: <span className="font-bold text-slate-950">{selectedCustomer.phone}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Location: <span className="font-bold text-slate-950">{selectedCustomer.location}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Created Date: <span className="font-mono text-slate-950">{selectedCustomer.joinDate}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Last Store Activity: <span className="font-mono text-slate-950">{selectedCustomer.lastActive}</span></span>
                  </div>
                </div>
              </div>

              {/* Sentiment score modifier buttons */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-150 pb-1">Relationship Sentiment</h4>
                
                <div className="flex gap-2">
                  {(['Satisfied', 'Neutral', 'At Risk'] as const).map(sent => (
                    <button
                      key={sent}
                      type="button"
                      onClick={() => handleUpdateSentiment(sent)}
                      className={`flex-1 py-1.5 border rounded-xl text-center font-bold tracking-wider transition-all uppercase text-[9px] cursor-pointer ${
                        selectedCustomer.sentiment === sent 
                          ? sent === 'Satisfied' ? 'bg-green-50 text-green-700 border-green-200' :
                            sent === 'Neutral' ? 'bg-slate-100 text-slate-800 border-slate-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      {sent}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders History list in CRM */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-150 pb-1.5">Purchase Invoices ({orders.filter(o => o.customerName === selectedCustomer.name).length})</h4>
                
                {orders.filter(o => o.customerName === selectedCustomer.name).length > 0 ? (
                  <div className="space-y-2">
                    {orders.filter(o => o.customerName === selectedCustomer.name).map(o => (
                      <div key={o.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-cyan-700 font-bold">{o.id}</span>
                            <span className="text-[10px] text-slate-400 font-mono font-bold">{o.time}</span>
                          </div>
                          <p className="text-slate-800 font-bold mt-1">{o.product}</p>
                          <p className="text-slate-400 text-[10px] font-semibold">Dispatch Location: {o.location}</p>
                        </div>

                        <div className="text-right">
                          <p className="font-mono font-black text-slate-900">₦{o.value.toLocaleString()}</p>
                          <span className={`inline-block px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold mt-1 uppercase ${
                            o.status === 'DELIVERED' ? 'bg-green-50 border border-green-150 text-green-700' :
                            o.status === 'SHIPPED' ? 'bg-blue-50 border border-blue-150 text-blue-700' :
                            'bg-amber-50 border border-amber-150 text-amber-700'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic pl-1 font-semibold">No completed transactions found on this profile.</p>
                )}
              </div>

              {/* Automated WhatsApp/Email followup marketing */}
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-150 pb-1.5">CONCIERGE CRM FOLLOW-UP</h4>
                
                <form onSubmit={handleSendFollowUp} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                    <span className="text-slate-400">Dispatch Channel:</span>
                    <div className="flex gap-2">
                      {(['WhatsApp', 'Email'] as const).map(ch => (
                        <button
                          type="button"
                          key={ch}
                          onClick={() => setFollowUpChannel(ch)}
                          className={`px-2.5 py-0.5 rounded border font-bold transition-all ${
                            followUpChannel === ch 
                              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs' 
                              : 'bg-transparent text-slate-400 border-transparent hover:text-slate-700'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={followUpText}
                    onChange={(e) => setFollowUpText(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl p-3 text-xs text-slate-800 leading-relaxed font-light shadow-xs"
                    placeholder="Enter message text..."
                  />

                  {followUpSuccess ? (
                    <div className="bg-green-50 border border-green-150 text-green-700 p-2.5 rounded-xl text-[11px] font-mono flex items-center gap-1.5 justify-center animate-pulse">
                      <Check className="w-4 h-4 text-green-700" />
                      <span>Concierge template sent via WhatsApp API!</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={!followUpText}
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-[11px] uppercase cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Send Concierge Follow-up
                    </button>
                  )}
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
