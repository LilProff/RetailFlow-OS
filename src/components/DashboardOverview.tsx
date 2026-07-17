import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Filter, 
  Check, 
  TrendingUp, 
  ShoppingCart, 
  Target, 
  User, 
  ArrowUpRight, 
  X,
  Smartphone,
  Laptop,
  HelpCircle
} from 'lucide-react';
import { Order, Message, Lead } from '../types';
import { AI_QA_PAIRS } from '../data';

interface DashboardOverviewProps {
  orders: Order[];
  onAddOrder: (order: Order) => void;
  onChangeOrderStatus: (orderId: string, status: Order['status']) => void;
  messages: Message[];
  onSendMessage: (text: string, channel: 'WhatsApp' | 'Instagram', sender: string) => void;
  onSelectOrder: (order: Order) => void;
  leads: Lead[];
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
}

export default function DashboardOverview({
  orders,
  onAddOrder,
  onChangeOrderStatus,
  messages,
  onSendMessage,
  onSelectOrder,
  leads,
  onUpdateLead
}: DashboardOverviewProps) {
  
  // Search & Filter state for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | Order['status']>('ALL');
  
  // Modal State for New Order
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustLoc, setNewCustLoc] = useState('');
  const [newProduct, setNewProduct] = useState('iPhone 15 Pro');
  const [newValue, setNewValue] = useState('1450000');
  const [newChannel, setNewChannel] = useState<'WhatsApp' | 'Instagram' | 'Web'>('WhatsApp');

  // Unified Inbox State
  const [activeInboxChannel, setActiveInboxChannel] = useState<'ALL' | 'WhatsApp' | 'Instagram'>('ALL');
  const [selectedSender, setSelectedSender] = useState<string>('Emeka Nnamdi');
  const [replyInput, setReplyInput] = useState('');

  // AI Assistant Panel State
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiHistory, setAiHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: "Hello! I'm the TechHub Retail AI. Ask me about Lagos pricing, iPhone stock levels, or bulk discounts." }
  ]);
  const [aiIsTyping, setAiIsTyping] = useState(false);

  // Lead Funnel Tab Filter
  const [leadScoreFilter, setLeadScoreFilter] = useState<'ALL' | Lead['score']>('ALL');

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.product.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats based on current orders state
  const totalRevenueToday = orders
    .filter(o => o.status !== 'NEW') // Count confirmed, shipped, delivered towards revenue
    .reduce((sum, o) => sum + o.value, 4200000); // 4.2M default base today

  const newOrdersCount = orders.filter(o => o.status === 'NEW').length;
  const processingCount = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'SHIPPED').length;

  // Handle adding order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustLoc) return;

    const newOrder: Order = {
      id: `RF-${Math.floor(8800 + Math.random() * 200)}-LX`,
      customerName: newCustName,
      location: newCustLoc,
      product: newProduct,
      value: Number(newValue) || 1200000,
      channel: newChannel,
      status: 'NEW',
      time: 'Just now'
    };

    onAddOrder(newOrder);
    setIsModalOpen(false);
    
    // Clear inputs
    setNewCustName('');
    setNewCustLoc('');
  };

  // Status cycling for convenience on row clicks (NEW -> CONFIRMED -> SHIPPED -> DELIVERED)
  const cycleStatus = (orderId: string, currentStatus: Order['status']) => {
    const statusCycle: Record<Order['status'], Order['status']> = {
      'NEW': 'CONFIRMED',
      'CONFIRMED': 'SHIPPED',
      'SHIPPED': 'DELIVERED',
      'DELIVERED': 'NEW'
    };
    onChangeOrderStatus(orderId, statusCycle[currentStatus]);
  };

  // Inbox threads group by sender
  const threads = Array.from(new Set(messages.map(m => m.sender)));
  const filteredMessages = messages.filter(m => {
    const matchesChannel = activeInboxChannel === 'ALL' || m.channel === activeInboxChannel;
    const matchesSender = m.sender === selectedSender || m.sender === 'TechHub Concierge';
    return matchesChannel && matchesSender;
  });

  // Send message from workspace operator
  const handleSendInboxReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    // Guess sender channel
    const activeThreadMsg = messages.find(m => m.sender === selectedSender);
    const channel = activeThreadMsg ? activeThreadMsg.channel : 'WhatsApp';

    onSendMessage(replyInput, channel, selectedSender);
    setReplyInput('');
  };

  // AI local Keyword Match response engine
  const handleAiAssistantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;

    const userMsg = aiChatInput.trim();
    setAiHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiChatInput('');
    setAiIsTyping(true);

    setTimeout(() => {
      // Analyze user input for keywords
      const queryLower = userMsg.toLowerCase();
      let matchedResponse = "I'm not fully sure about that specific spec, but our core Lagos retail inventory shows robust growth. Try asking about 'MacBook', 'iPhone stock', or 'bulk discounts'.";

      for (const qa of AI_QA_PAIRS) {
        if (qa.keywords.some(kw => queryLower.includes(kw))) {
          matchedResponse = qa.response;
          break;
        }
      }

      setAiHistory(prev => [...prev, { sender: 'ai', text: matchedResponse }]);
      setAiIsTyping(false);
    }, 650);
  };

  // Handle lead upgrade / action (replying / converting)
  const triggerLeadAction = (lead: Lead) => {
    // Select lead as active thread in unified inbox
    setSelectedSender(lead.name);
    // Switch unified channel filter to match lead if possible
    alert(`Initiating chat setup with ${lead.name} (${lead.statusTag}). Drafted response set in your Unified Inbox.`);
  };

  return (
    <div className="space-y-6">
      
      {/* 3 Metric overview grid (Bento style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="glass-panel glass-highlight rounded-xl p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-green-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-2">
            Total Revenue (Today)
          </span>
          <span className="text-3xl font-bold text-white tracking-tight">
            ₦ {totalRevenueToday.toLocaleString()}
          </span>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-green-400">
            <span>+12.5% vs yesterday</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel glass-highlight rounded-xl p-6 flex flex-col">
          <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-2">
            Active Orders Pipeline
          </span>
          <span className="text-3xl font-bold text-white tracking-tight">
            {orders.length}
          </span>
          <div className="mt-4 flex gap-2">
            <span className="text-[10px] bg-blue-500/10 text-[#3B82F6] px-2 py-0.5 rounded border border-blue-500/20 font-mono">
              {newOrdersCount} New
            </span>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
              {processingCount} Processing
            </span>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="glass-panel rounded-xl p-6 flex flex-col lg:col-span-2 relative overflow-hidden ai-glow transition-all cursor-default border-blue-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-[#3B82F6]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                AI Cognitive Assistant Active
              </span>
            </div>
            <span className="text-[10px] font-mono bg-[#161618] px-2 py-0.5 rounded border border-[#27272A] text-on-surface-variant">
              Real-time feed
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            Dynamic Lagos pricing recommended
          </h3>
          <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
            Competitor pricing alerts detected a ₦25,000 drop at Pointek Ikeja for iPhone 15 Pro. Recommend a promotional draft to <strong>Emeka Nnamdi</strong> to secure his bulk purchase today.
          </p>
          <div className="mt-4 pt-2 flex gap-3">
            <button 
              onClick={() => {
                setSelectedSender('Emeka Nnamdi');
                setReplyInput("Hi Emeka, I can apply a special dynamic discount of ₦20,000 per unit for your bulk devs order today.");
              }}
              className="text-[11px] font-mono font-bold text-black bg-[#3B82F6] hover:bg-blue-600 px-3 py-1.5 rounded transition-all cursor-pointer"
            >
              Draft WhatsApp Offer
            </button>
            <button className="text-[11px] font-mono text-[#3B82F6] hover:text-blue-400 transition-colors">
              Compare Price Feeds
            </button>
          </div>
        </div>

      </div>

      {/* Main Grid: Orders on left, Inbox & AI on right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (Orders) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Recent Orders table widget */}
          <div className="glass-panel glass-highlight rounded-xl flex flex-col overflow-hidden">
            
            <div className="p-4 border-b border-[#27272A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#3B82F6]" /> Recent Sales Pipeline
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Click a row to cycle status (NEW → CONFIRMED → SHIPPED → DELIVERED). Click ID to track.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search client/product..." 
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full sm:w-48 bg-[#0A0A0B] border border-[#27272A] text-xs rounded-lg pl-9 pr-3 py-1.5 focus:border-[#3B82F6] outline-none text-white"
                  />
                </div>
                
                {/* Status Filter */}
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-[#0A0A0B] border border-[#27272A] text-xs rounded-lg px-2.5 py-1.5 focus:border-[#3B82F6] outline-none text-on-surface-variant cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#3B82F6] text-white hover:bg-blue-600 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" /> New Record
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#27272A] bg-[#161618]/50 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Channel</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Value (₦)</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-[#27272A]/40">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                        No orders match your active search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => {
                      const isNew = order.status === 'NEW';
                      const isConfirmed = order.status === 'CONFIRMED';
                      const isShipped = order.status === 'SHIPPED';
                      const isDelivered = order.status === 'DELIVERED';

                      return (
                        <tr 
                          key={order.id}
                          className="hover:bg-[#161618]/60 transition-colors cursor-pointer group"
                        >
                          <td 
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectOrder(order);
                            }}
                            className="p-4 font-mono text-cyan-400 font-bold hover:underline"
                          >
                            <span className="flex items-center gap-1">
                              {order.id}
                              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                          </td>
                          <td 
                            onClick={() => cycleStatus(order.id, order.status)}
                            className="p-4"
                          >
                            <div className="font-semibold text-white">{order.customerName}</div>
                            <div className="text-[10px] text-on-surface-variant">{order.location}</div>
                          </td>
                          <td 
                            onClick={() => cycleStatus(order.id, order.status)}
                            className="p-4 text-on-surface-variant"
                          >
                            {order.product}
                          </td>
                          <td 
                            onClick={() => cycleStatus(order.id, order.status)}
                            className="p-4"
                          >
                            <span className="inline-flex items-center gap-1 bg-[#131314] px-2 py-0.5 rounded text-[10px] border border-[#27272A]">
                              {order.channel}
                            </span>
                          </td>
                          <td 
                            onClick={() => cycleStatus(order.id, order.status)}
                            className="p-4"
                          >
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isNew ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                              isConfirmed ? 'bg-blue-500/10 text-[#3B82F6] border border-blue-500/20' :
                              isShipped ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                              'bg-green-500/10 text-green-400 border border-green-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isNew ? 'bg-cyan-400 animate-pulse' :
                                isConfirmed ? 'bg-blue-400' :
                                isShipped ? 'bg-indigo-400' :
                                'bg-green-400'
                              }`} />
                              {order.status}
                            </span>
                          </td>
                          <td 
                            onClick={() => cycleStatus(order.id, order.status)}
                            className="p-4 text-right font-mono font-bold text-white"
                          >
                            ₦{order.value.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-[#27272A] text-center bg-[#131314]/30">
              <span className="text-[11px] text-on-surface-variant">
                Showing {filteredOrders.length} of {orders.length} transaction logs.
              </span>
            </div>

          </div>

          {/* Unified Inbox widget */}
          <div className="glass-panel glass-highlight rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-3">
            
            {/* Thread side list */}
            <div className="border-r border-[#27272A] bg-[#161618]/30 flex flex-col">
              <div className="p-4 border-b border-[#27272A] flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400" /> Unified Inbox
                </h4>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setActiveInboxChannel('ALL')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${activeInboxChannel === 'ALL' ? 'bg-[#3B82F6] text-white' : 'text-on-surface-variant hover:text-white'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setActiveInboxChannel('WhatsApp')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${activeInboxChannel === 'WhatsApp' ? 'bg-green-600 text-white' : 'text-on-surface-variant hover:text-white'}`}
                  >
                    WA
                  </button>
                </div>
              </div>

              <div className="flex-1 max-h-[220px] overflow-y-auto divide-y divide-[#27272A]/30">
                {threads.map(sender => {
                  const lastMsg = messages.filter(m => m.sender === sender).pop();
                  const isSelected = sender === selectedSender;
                  return (
                    <div 
                      key={sender}
                      onClick={() => setSelectedSender(sender)}
                      className={`p-3 cursor-pointer transition-all ${isSelected ? 'bg-[#3B82F6]/10 border-l-2 border-[#3B82F6]' : 'hover:bg-[#161618]'}`}
                    >
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-xs text-white truncate max-w-[120px]">{sender}</span>
                        <span className="text-[9px] font-mono text-on-surface-variant">{lastMsg?.timestamp}</span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant truncate">
                        {lastMsg?.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Chat Thread screen */}
            <div className="md:col-span-2 flex flex-col h-[300px] justify-between bg-[#131314]">
              
              <div className="p-3 border-b border-[#27272A] flex items-center justify-between bg-[#161618]/60">
                <div>
                  <span className="font-bold text-xs text-white">{selectedSender}</span>
                  <p className="text-[9px] text-on-surface-variant">WhatsApp API handshake verified</p>
                </div>
                <span className="text-[9px] font-mono bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>

              {/* Message flow */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-hide bg-[#0A0A0B]/40">
                {filteredMessages.map(m => {
                  const isStaff = !m.isIncoming;
                  return (
                    <div 
                      key={m.id}
                      className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-xl p-2.5 text-xs border ${
                        isStaff 
                          ? 'bg-blue-600/15 border-blue-500/30 text-white rounded-tr-none' 
                          : 'bg-[#161618] border-[#27272A] text-on-surface rounded-tl-none'
                      }`}>
                        <p className="leading-relaxed">{m.text}</p>
                        <span className="text-[8px] font-mono text-on-surface-variant block mt-1 text-right">
                          {m.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendInboxReply} className="p-3 border-t border-[#27272A] bg-[#161618]/30 flex gap-2">
                <input 
                  type="text"
                  placeholder={`Draft dynamic WhatsApp reply to ${selectedSender}...`}
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="flex-1 bg-[#0A0A0B] border border-[#27272A] text-xs rounded-lg px-3 py-2 outline-none text-white focus:border-[#3B82F6]"
                />
                <button 
                  type="submit"
                  className="bg-[#3B82F6] hover:bg-blue-600 text-white p-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

          </div>

        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6">
          
          {/* Lead Qualifier list card */}
          <div className="glass-panel glass-highlight rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Target className="w-4.5 h-4.5 text-indigo-400" /> AI Lead Qualifier Funnel
              </h3>
              <span className="text-[10px] font-mono text-[#3B82F6]">Automation Active</span>
            </div>

            {/* Lead Funnel Tabs */}
            <div className="flex gap-1.5 border-b border-[#27272A] pb-2 mb-3">
              {(['ALL', 'HOT', 'WARM', 'COLD'] as const).map(score => (
                <button
                  key={score}
                  onClick={() => setLeadScoreFilter(score)}
                  className={`text-[9px] font-mono font-bold px-2 py-1 rounded ${
                    leadScoreFilter === score 
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>

            {/* Scrollable funnel */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {leads
                .filter(l => leadScoreFilter === 'ALL' || l.score === leadScoreFilter)
                .map(lead => {
                  const isHot = lead.score === 'HOT';
                  const isWarm = lead.score === 'WARM';
                  return (
                    <div 
                      key={lead.id}
                      onClick={() => triggerLeadAction(lead)}
                      className="p-3 rounded-lg bg-[#161618] border border-[#27272A] hover:border-indigo-500/50 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">
                          {lead.name}
                        </span>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isHot ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          isWarm ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                        }`}>
                          {lead.score}
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant mb-2">
                        {lead.summary}
                      </p>
                      <div className="flex items-center justify-between text-[9px] font-mono text-on-surface-variant border-t border-[#27272A]/40 pt-1.5">
                        <span>Tag: {lead.statusTag}</span>
                        <span className="text-[#3B82F6] hover:underline">Launch Chat →</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* AI Assistant Chat widget */}
          <div className="glass-panel glass-highlight rounded-xl p-4 flex flex-col border-cyan-500/20">
            <div className="flex items-center gap-1.5 mb-3 border-b border-[#27272A] pb-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm text-white">Dynamic AI Analyst</h3>
                <p className="text-[8px] font-mono text-on-surface-variant">Antigravity local cognitive loop</p>
              </div>
            </div>

            {/* Conversation list */}
            <div className="h-[200px] overflow-y-auto space-y-2.5 p-2 rounded-lg bg-[#0A0A0B]/30 mb-3 border border-[#27272A]/40 text-[11px] scrollbar-hide">
              {aiHistory.map((item, idx) => {
                const isAi = item.sender === 'ai';
                return (
                  <div key={idx} className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-2 rounded-xl max-w-[90%] border ${
                      isAi 
                        ? 'bg-[#161618] border-[#27272A] text-cyan-200' 
                        : 'bg-cyan-500/15 border-cyan-500/30 text-white'
                    }`}>
                      {item.text}
                    </div>
                  </div>
                );
              })}
              {aiIsTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#161618] border border-[#27272A] text-on-surface-variant p-2 rounded-xl text-[10px] italic">
                    AI is processing price trends...
                  </div>
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleAiAssistantSubmit} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about MacBook, iPhone stock..." 
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                className="flex-1 bg-[#0A0A0B] border border-[#27272A] text-xs rounded-lg px-2.5 py-1.5 outline-none text-white focus:border-cyan-400"
              />
              <button 
                type="submit" 
                className="bg-cyan-500 text-black hover:bg-cyan-400 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Query
              </button>
            </form>
          </div>

          {/* Quick Data Analyst Insights */}
          <div className="glass-panel glass-highlight rounded-xl p-4">
            <h3 className="font-bold text-sm text-white mb-3">
              Data Analyst Insights
            </h3>
            <div className="space-y-3">
              <div className="p-2.5 rounded-lg bg-[#161618] border-l-2 border-green-500 text-xs">
                <div className="font-bold text-white mb-0.5">Top Performer</div>
                <p className="text-[10px] text-on-surface-variant">
                  <strong>iPhone 15 Pro</strong> is generating 58% of all today's cash velocity, leading ahead of computing gear.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#161618] border-l-2 border-cyan-400 text-xs">
                <div className="font-bold text-white mb-0.5">Trending Sector</div>
                <p className="text-[10px] text-on-surface-variant">
                  Lagos Island Hub is seeing a 24% spike in portable high-end sound and noise-cancelling headphone requests.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* New Order Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A0A0B]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-[#161618] rounded-xl border border-[#27272A] p-6 shadow-2xl glass-highlight">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#3B82F6]" /> Add Sales Record
            </h3>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Customer Name
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Kolawole Davies"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Lagos Location / Hub
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Lekki Phase 1, Lagos"
                  value={newCustLoc}
                  onChange={(e) => setNewCustLoc(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Product
                  </label>
                  <select 
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none cursor-pointer"
                  >
                    <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                    <option value="MacBook Air M3">MacBook Air M3</option>
                    <option value="iPad Pro 12.9&quot;">iPad Pro 12.9&quot;</option>
                    <option value="Sony WH-1000XM5">Sony WH-1000XM5</option>
                    <option value="Galaxy S24 Ultra">Galaxy S24 Ultra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Naira Value (₦)
                  </label>
                  <input 
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3B82F6] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Lead Channel
                </label>
                <div className="flex gap-4">
                  {(['WhatsApp', 'Instagram', 'Web'] as const).map(ch => (
                    <label key={ch} className="flex items-center gap-1.5 text-xs text-white cursor-pointer select-none">
                      <input 
                        type="radio" 
                        name="channel" 
                        checked={newChannel === ch}
                        onChange={() => setNewChannel(ch)}
                        className="text-[#3B82F6] focus:ring-0" 
                      />
                      <span>{ch}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg text-sm transition-all cursor-pointer mt-2"
              >
                Confirm Order Manifest
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
