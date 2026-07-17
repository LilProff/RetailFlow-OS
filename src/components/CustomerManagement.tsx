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
  Check
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
    }, 3500);
  };

  const handleUpdateSentiment = (sentiment: CustomerProfile['sentiment']) => {
    if (!selectedCustomer) return;
    onUpdateCustomer(selectedCustomer.id, { sentiment });
    setSelectedCustomer(prev => prev ? { ...prev, sentiment } : null);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Summary KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#161619] border border-[#27272A] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Total Directory CRM</span>
            <span className="text-2xl font-extrabold text-white">{customers.length}</span>
            <span className="text-[10px] font-mono text-green-400 block">+12% vs last month</span>
          </div>
          <div className="w-10 h-10 bg-blue-500/10 text-[#3B82F6] rounded-xl flex items-center justify-center border border-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#161619] border border-[#27272A] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Customer LTV (Avg)</span>
            <span className="text-2xl font-extrabold text-white">₦{Math.round(avgSpent).toLocaleString()}</span>
            <span className="text-[10px] font-mono text-cyan-400 block">High-Ticket Electronics</span>
          </div>
          <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center border border-cyan-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#161619] border border-[#27272A] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">CRM Satisfaction</span>
            <span className="text-2xl font-extrabold text-white">
              {customers.length > 0 ? Math.round((satisfiedCount / customers.length) * 100) : 0}%
            </span>
            <span className="text-[10px] font-mono text-green-400 block">{satisfiedCount} Satisfied profiles</span>
          </div>
          <div className="w-10 h-10 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center border border-green-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#161619] border border-[#27272A] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">At Risk Clients</span>
            <span className="text-2xl font-extrabold text-rose-400">{atRiskCount}</span>
            <span className="text-[10px] font-mono text-rose-400 block">Requires follow-up</span>
          </div>
          <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center border border-rose-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* CRM Search & Filters bar */}
      <div className="p-4 bg-[#161619] border border-[#27272A] rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Search clients by name, email, phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1C1C1F] border border-[#27272A] focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </div>

          {/* Sentiment Filter */}
          <div className="flex bg-[#1B1B1F] border border-[#27272A] rounded-xl p-0.5 text-[11px] font-mono">
            {(['ALL', 'Satisfied', 'Neutral', 'At Risk'] as const).map(sent => (
              <button
                key={sent}
                onClick={() => setSelectedSentiment(sent)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedSentiment === sent 
                    ? 'bg-zinc-800 text-white font-bold' 
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                {sent === 'ALL' ? 'ALL SENTIMENTS' : sent}
              </button>
            ))}
          </div>

          {/* Location Filter */}
          <div className="flex bg-[#1B1B1F] border border-[#27272A] rounded-xl p-0.5 text-[11px] font-mono">
            {(['ALL', 'Lekki', 'Ikeja', 'Victoria Island'] as const).map(loc => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedLocation === loc 
                    ? 'bg-zinc-800 text-white font-bold' 
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                {loc === 'ALL' ? 'ALL LOCATIONS' : loc}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Main Table view of Clients */}
      <div className="bg-[#161619] border border-[#27272A] rounded-2xl overflow-hidden shadow">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#27272A] bg-[#1D1D21] text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                <th className="p-4 pl-6">Client Name</th>
                <th className="p-4">Contact Detail</th>
                <th className="p-4">Delivery Location</th>
                <th className="p-4">Lifetime Spent</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Sentiment Score</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/40">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <tr 
                    key={customer.id}
                    onClick={() => handleOpenCustomer(customer)}
                    className="hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 pl-6 font-bold text-white group-hover:text-[#3B82F6] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span>{customer.name}</span>
                          <span className="block text-[9px] font-mono text-zinc-500 mt-0.5">CRM ID: {customer.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-300">
                      <div>
                        <span className="block">{customer.email}</span>
                        <span className="block text-zinc-500 mt-0.5">{customer.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-300">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-500" /> {customer.location}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      ₦{customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono font-medium text-zinc-400">
                      {customer.orderCount} orders
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase ${
                        customer.sentiment === 'Satisfied' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        customer.sentiment === 'Neutral' ? 'bg-zinc-800 text-zinc-400 border border-transparent' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          customer.sentiment === 'Satisfied' ? 'bg-green-500' :
                          customer.sentiment === 'Neutral' ? 'bg-zinc-500' :
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
                        className="text-xs text-blue-400 hover:text-white px-3 py-1.5 bg-[#1B1B1F] hover:bg-blue-600 border border-blue-500/20 hover:border-blue-500 rounded-lg transition-all cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-500 font-medium">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setSelectedCustomer(null)} />
          
          <div className="relative w-full max-w-lg bg-[#161619] h-full shadow-2xl border-l border-[#27272A] flex flex-col justify-between p-6 z-10 animate-slide-left overflow-y-auto no-scrollbar">
            
            <div className="space-y-6 pb-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#27272A]/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#3B82F6] flex items-center justify-center font-bold text-base">
                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-none">{selectedCustomer.name}</h3>
                    <span className="text-[10px] font-mono text-zinc-500 mt-1 block uppercase">Lagos Client Ledger CRM</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CRM Client stats cards */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#1C1C1F] p-4 rounded-xl border border-[#27272A]/60">
                  <span className="text-[10px] text-zinc-500 block uppercase mb-1">Lifetime Spent</span>
                  <span className="text-base font-extrabold text-[#3B82F6]">₦{selectedCustomer.totalSpent.toLocaleString()}</span>
                </div>
                <div className="bg-[#1C1C1F] p-4 rounded-xl border border-[#27272A]/60">
                  <span className="text-[10px] text-zinc-500 block uppercase mb-1">Fled Orders</span>
                  <span className="text-base font-extrabold text-white">{selectedCustomer.orderCount} Orders</span>
                </div>
              </div>

              {/* Core Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-zinc-300 uppercase tracking-widest text-[10px] border-b border-[#27272A] pb-1">Profile Metadata</h4>
                
                <div className="space-y-2.5 text-xs text-zinc-300 font-light">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-500" />
                    <span>Email: <span className="font-medium text-white">{selectedCustomer.email}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-500" />
                    <span>Phone: <span className="font-medium text-white">{selectedCustomer.phone}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-500" />
                    <span>Location: <span className="font-medium text-white">{selectedCustomer.location}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <span>Created Date: <span className="font-mono text-white">{selectedCustomer.joinDate}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <span>Last Store Activity: <span className="font-mono text-white">{selectedCustomer.lastActive}</span></span>
                  </div>
                </div>
              </div>

              {/* Sentiment score modifier buttons */}
              <div className="space-y-3">
                <h4 className="font-bold text-zinc-300 uppercase tracking-widest text-[10px] border-b border-[#27272A] pb-1">Relationship Sentiment</h4>
                
                <div className="flex gap-2">
                  {(['Satisfied', 'Neutral', 'At Risk'] as const).map(sent => (
                    <button
                      key={sent}
                      type="button"
                      onClick={() => handleUpdateSentiment(sent)}
                      className={`flex-1 py-1.5 border rounded-lg text-center font-bold tracking-wider transition-all uppercase text-[9px] cursor-pointer ${
                        selectedCustomer.sentiment === sent 
                          ? sent === 'Satisfied' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                            sent === 'Neutral' ? 'bg-zinc-800 text-zinc-300 border-zinc-700' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-[#1C1C1F] border-[#27272A] text-zinc-500 hover:text-white'
                      }`}
                    >
                      {sent}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders History list in CRM */}
              <div className="space-y-3">
                <h4 className="font-bold text-zinc-300 uppercase tracking-widest text-[10px] border-b border-[#27272A] pb-1.5">Purchase Invoices ({orders.filter(o => o.customerName === selectedCustomer.name).length})</h4>
                
                {orders.filter(o => o.customerName === selectedCustomer.name).length > 0 ? (
                  <div className="space-y-2">
                    {orders.filter(o => o.customerName === selectedCustomer.name).map(o => (
                      <div key={o.id} className="p-3 bg-[#1C1C1F] border border-[#27272A] rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-cyan-400 font-bold">{o.id}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">{o.time}</span>
                          </div>
                          <p className="text-white font-medium mt-1">{o.product}</p>
                          <p className="text-zinc-500 text-[10px]">Dispatch Location: {o.location}</p>
                        </div>

                        <div className="text-right">
                          <p className="font-mono font-extrabold text-white">₦{o.value.toLocaleString()}</p>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-mono font-bold mt-1 uppercase ${
                            o.status === 'DELIVERED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            o.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500 italic pl-1">No completed transactions found on this profile.</p>
                )}
              </div>

              {/* Automated WhatsApp/Email followup marketing */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-zinc-300 uppercase tracking-widest text-[10px] border-b border-[#27272A] pb-1.5">CONCIERGE CRM FOLLOW-UP</h4>
                
                <form onSubmit={handleSendFollowUp} className="p-4 bg-[#1C1C1F] border border-[#27272A]/80 rounded-xl space-y-3.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-400">Dispatch Channel:</span>
                    <div className="flex gap-2">
                      {(['WhatsApp', 'Email'] as const).map(ch => (
                        <button
                          type="button"
                          key={ch}
                          onClick={() => setFollowUpChannel(ch)}
                          className={`px-2 py-0.5 rounded border transition-all ${
                            followUpChannel === ch 
                              ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-blue-500/20' 
                              : 'bg-transparent text-zinc-500 border-transparent hover:text-white'
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
                    className="w-full bg-[#161619] border border-[#27272A] focus:outline-none rounded-xl p-3 text-xs text-white placeholder-zinc-600 leading-relaxed font-light"
                    placeholder="Enter message text..."
                  />

                  {followUpSuccess ? (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-2.5 rounded-xl text-[11px] font-mono flex items-center gap-1.5 justify-center animate-pulse">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Concierge template sent via WhatsApp API!</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={!followUpText}
                      className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-[11px] uppercase cursor-pointer"
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
