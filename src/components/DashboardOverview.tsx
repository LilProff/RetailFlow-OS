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
import { Order, Message, Lead, Product } from '../types';
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
  products: Product[];
  onNavigate: (view: string) => void;
}

export default function DashboardOverview({
  orders,
  onAddOrder,
  onChangeOrderStatus,
  messages,
  onSendMessage,
  onSelectOrder,
  leads,
  onUpdateLead,
  products,
  onNavigate
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

  const lowStockCount = products ? products.filter(p => p.stock > 0 && p.stock <= 4).length : 0;
  const outOfStockCount = products ? products.filter(p => p.stock === 0).length : 0;
  const totalProductsCount = products ? products.length : 0;

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
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 flex flex-col relative overflow-hidden group shadow-sm">
          <div className="absolute top-4 right-4 text-green-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold mb-2 block">
            Total Revenue (Today)
          </span>
          <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
            ₦{totalRevenueToday.toLocaleString()}
          </span>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-semibold">
            <span>+12.5% vs yesterday</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-sm">
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold mb-2 block">
            Active Orders Pipeline
          </span>
          <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
            {orders.length}
          </span>
          <div className="mt-4 flex gap-2">
            <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/50 font-mono font-bold">
              {newOrdersCount} New
            </span>
            <span className="text-[10px] bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 px-2 py-0.5 rounded-full border border-sky-100 dark:border-sky-900/50 font-mono font-bold">
              {processingCount} Processing
            </span>
          </div>
        </div>

        {/* Metric 3: Stocks & Inventory Levels */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold mb-2 block">
              Stock & Inventory Levels
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                {totalProductsCount}
              </span>
              <span className="text-xs text-slate-400 font-mono">Catalog Items</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                lowStockCount > 0 
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/40' 
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
              }`}>
                {lowStockCount} Low Stock
              </span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                outOfStockCount > 0 
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/40' 
                  : 'bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800'
              }`}>
                {outOfStockCount} Out of Stock
              </span>
            </div>
            <button 
              onClick={() => onNavigate('inventory')}
              className="text-[10px] font-mono font-extrabold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-left hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Stocks & Add Inventory ↗</span>
            </button>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/40 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-sm group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-transparent pointer-events-none" />
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
                AI Cognitive Assistant
              </span>
            </div>
            <span className="text-[10px] font-mono bg-slate-50 dark:bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
              Live Feed
            </span>
          </div>
          <h3 className="text-xs font-black text-slate-950 dark:text-white mb-1 leading-tight">
            Dynamic Lagos pricing recommended
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed font-light">
            Competitor pricing alerts detected a ₦25,000 drop at Pointek Ikeja for iPhone 15 Pro. Recommend a promotional draft.
          </p>
          <div className="mt-3 pt-1 flex gap-2.5">
            <button 
              onClick={() => {
                setSelectedSender('Emeka Nnamdi');
                setReplyInput("Hi Emeka, I can apply a special dynamic discount of ₦20,000 per unit for your bulk devs order today.");
              }}
              className="text-[10px] font-mono font-bold text-white bg-blue-700 hover:bg-blue-800 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-xs"
            >
              Draft Offer
            </button>
            <button 
              onClick={() => onNavigate('market')}
              className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
            >
              Compare Feeds
            </button>
          </div>
        </div>

      </div>

      {/* Main Grid: Orders on left, Inbox & AI on right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (Orders) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Recent Orders table widget */}
          <div className="bg-white border border-slate-200/80 rounded-2xl flex flex-col overflow-hidden shadow-sm">
            
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-700" /> Recent Sales Pipeline
                </h3>
                <p className="text-xs text-slate-500 font-light">
                  Click a row to cycle status (NEW → CONFIRMED → SHIPPED → DELIVERED). Click ID to track.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search client/product..." 
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full sm:w-48 bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:border-blue-700 outline-none text-slate-900"
                  />
                </div>
                
                {/* Status Filter */}
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:border-blue-700 outline-none text-slate-600 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-700 text-white hover:bg-blue-800 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> New Record
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="p-4 font-bold">ID</th>
                    <th className="p-4 font-bold">Customer</th>
                    <th className="p-4 font-bold">Product</th>
                    <th className="p-4 font-bold">Channel</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Value (₦)</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
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
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        >
                          <td 
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectOrder(order);
                            }}
                            className="p-4 font-mono text-blue-700 font-extrabold hover:underline"
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
                            <div className="font-bold text-slate-950">{order.customerName}</div>
                            <div className="text-[10px] text-slate-400 font-light">{order.location}</div>
                          </td>
                          <td 
                            onClick={() => cycleStatus(order.id, order.status)}
                            className="p-4 text-slate-600 font-medium"
                          >
                            {order.product}
                          </td>
                          <td 
                            onClick={() => cycleStatus(order.id, order.status)}
                            className="p-4"
                          >
                            <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full text-[10px] border border-slate-200 text-slate-600 font-medium">
                              {order.channel}
                            </span>
                          </td>
                          <td 
                            onClick={() => cycleStatus(order.id, order.status)}
                            className="p-4"
                          >
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                              isNew ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' :
                              isConfirmed ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                              isShipped ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                              'bg-green-50 text-green-700 border border-green-100'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isNew ? 'bg-cyan-500 animate-pulse' :
                                isConfirmed ? 'bg-blue-500' :
                                isShipped ? 'bg-indigo-500' :
                                'bg-green-500'
                              }`} />
                              {order.status}
                            </span>
                          </td>
                          <td 
                            onClick={() => cycleStatus(order.id, order.status)}
                            className="p-4 text-right font-mono font-extrabold text-slate-950"
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

            <div className="p-3 border-t border-slate-100 text-center bg-slate-50">
              <span className="text-[11px] text-slate-400 font-medium">
                Showing {filteredOrders.length} of {orders.length} transaction logs.
              </span>
            </div>

          </div>

          {/* Unified Inbox widget */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 shadow-sm">
            
            {/* Thread side list */}
            <div className="border-r border-slate-100 bg-slate-50/50 flex flex-col">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-700" /> Unified Inbox
                </h4>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setActiveInboxChannel('ALL')}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeInboxChannel === 'ALL' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setActiveInboxChannel('WhatsApp')}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeInboxChannel === 'WhatsApp' ? 'bg-green-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    WA
                  </button>
                </div>
              </div>

              <div className="flex-1 max-h-[220px] overflow-y-auto divide-y divide-slate-100">
                {threads.map(sender => {
                  const lastMsg = messages.filter(m => m.sender === sender).pop();
                  const isSelected = sender === selectedSender;
                  return (
                    <div 
                      key={sender}
                      onClick={() => setSelectedSender(sender)}
                      className={`p-3 cursor-pointer transition-all ${isSelected ? 'bg-blue-50/60 border-l-2 border-blue-700 font-semibold' : 'hover:bg-slate-50/40'}`}
                    >
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-xs text-slate-950 truncate max-w-[120px]">{sender}</span>
                        <span className="text-[9px] font-mono text-slate-400 font-semibold">{lastMsg?.timestamp}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate font-light">
                        {lastMsg?.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Chat Thread screen */}
            <div className="md:col-span-2 flex flex-col h-[300px] justify-between bg-white">
              
              <div className="p-3 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="font-bold text-xs text-slate-950">{selectedSender}</span>
                  <p className="text-[9px] text-slate-400 font-medium">WhatsApp API handshake verified</p>
                </div>
                <span className="text-[9px] font-mono bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-bold">
                  Connected
                </span>
              </div>

              {/* Message flow */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-hide bg-slate-50/30">
                {filteredMessages.map(m => {
                  const isStaff = !m.isIncoming;
                  return (
                    <div 
                      key={m.id}
                      className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-2.5 text-xs border ${
                        isStaff 
                          ? 'bg-blue-50 border-blue-100 text-blue-900 rounded-tr-none' 
                          : 'bg-white border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                      }`}>
                        <p className="leading-relaxed font-light">{m.text}</p>
                        <span className="text-[8px] font-mono text-slate-400 block mt-1 text-right font-medium">
                          {m.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendInboxReply} className="p-3 border-t border-slate-200 bg-slate-50/30 flex gap-2">
                <input 
                  type="text"
                  placeholder={`Draft dynamic WhatsApp reply to ${selectedSender}...`}
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 outline-none text-slate-900 focus:border-blue-700 placeholder-slate-400"
                />
                <button 
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white p-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
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
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-950 flex items-center gap-1.5">
                <Target className="w-4.5 h-4.5 text-indigo-700" /> AI Lead Qualifier Funnel
              </h3>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Automation Active</span>
            </div>

            {/* Lead Funnel Tabs */}
            <div className="flex gap-1.5 border-b border-slate-100 pb-2 mb-3">
              {(['ALL', 'HOT', 'WARM', 'COLD'] as const).map(score => (
                <button
                  key={score}
                  onClick={() => setLeadScoreFilter(score)}
                  className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full ${
                    leadScoreFilter === score 
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
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
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-white transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-xs text-slate-950 group-hover:text-indigo-700 transition-colors">
                          {lead.name}
                        </span>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                          isHot ? 'bg-red-50 text-red-700 border border-red-100' :
                          isWarm ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {lead.score}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mb-2 font-light line-clamp-2">
                        {lead.summary}
                      </p>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-200/40 pt-1.5 font-bold">
                        <span>Tag: {lead.statusTag}</span>
                        <span className="text-blue-700 group-hover:underline">Launch Chat →</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* AI Assistant Chat widget */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col shadow-sm">
            <div className="flex items-center gap-1.5 mb-3 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-cyan-600 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm text-slate-950">Dynamic AI Analyst</h3>
                <p className="text-[8px] font-mono text-slate-400 uppercase font-semibold">Antigravity local cognitive loop</p>
              </div>
            </div>

            {/* Conversation list */}
            <div className="h-[200px] overflow-y-auto space-y-2.5 p-2 rounded-xl bg-slate-50 mb-3 border border-slate-200 text-[11px] scrollbar-hide">
              {aiHistory.map((item, idx) => {
                const isAi = item.sender === 'ai';
                return (
                  <div key={idx} className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-2 rounded-2xl max-w-[90%] border ${
                      isAi 
                        ? 'bg-white border-slate-200 text-slate-850 shadow-sm' 
                        : 'bg-cyan-50 border-cyan-100 text-cyan-900 font-medium'
                    }`}>
                      {item.text}
                    </div>
                  </div>
                );
              })}
              {aiIsTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-400 p-2 rounded-2xl text-[10px] italic">
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
                className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded-xl px-2.5 py-1.5 outline-none text-slate-900 focus:border-cyan-500 placeholder-slate-400"
              />
              <button 
                type="submit" 
                className="bg-cyan-50 border border-cyan-200 text-cyan-800 hover:bg-cyan-100 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Query
              </button>
            </form>
          </div>

          {/* Quick Data Analyst Insights */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-950 mb-3">
              Data Analyst Insights
            </h3>
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-slate-50 border-l-2 border-green-500 text-xs">
                <div className="font-bold text-slate-900 mb-0.5">Top Performer</div>
                <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                  <strong>iPhone 15 Pro</strong> is generating 58% of all today's cash velocity, leading ahead of computing gear.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border-l-2 border-cyan-500 text-xs">
                <div className="font-bold text-slate-900 mb-0.5">Trending Sector</div>
                <p className="text-[10px] text-slate-500 font-light leading-relaxed">
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
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fade-in" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl animate-scale-up">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-950 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-700" /> Add Sales Record
            </h3>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 font-bold">
                  Customer Name
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Kolawole Davies"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 font-bold">
                  Lagos Location / Hub
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Lekki Phase 1, Lagos"
                  value={newCustLoc}
                  onChange={(e) => setNewCustLoc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 font-bold">
                    Product
                  </label>
                  <select 
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-700 outline-none cursor-pointer"
                  >
                    <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                    <option value="MacBook Air M3">MacBook Air M3</option>
                    <option value="iPad Pro 12.9&quot;">iPad Pro 12.9&quot;</option>
                    <option value="Sony WH-1000XM5">Sony WH-1000XM5</option>
                    <option value="Galaxy S24 Ultra">Galaxy S24 Ultra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 font-bold">
                    Naira Value (₦)
                  </label>
                  <input 
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-700 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 font-bold">
                  Lead Channel
                </label>
                <div className="flex gap-4">
                  {(['WhatsApp', 'Instagram', 'Web'] as const).map(ch => (
                    <label key={ch} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none font-medium">
                      <input 
                        type="radio" 
                        name="channel" 
                        checked={newChannel === ch}
                        onChange={() => setNewChannel(ch)}
                        className="text-blue-700 focus:ring-0 cursor-pointer" 
                      />
                      <span>{ch}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all cursor-pointer mt-2 shadow-sm"
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
