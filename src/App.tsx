import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShoppingCart, 
  BarChart3, 
  Globe, 
  Settings, 
  Clock, 
  LogOut, 
  UserCheck, 
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Users,
  Sun,
  Moon,
  Package
} from 'lucide-react';

// Types and Initial Data
import { Order, Message, Lead, Integration, CustomerProfile, Product, QuizLead } from './types';
import { 
  INITIAL_ORDERS, 
  INITIAL_MESSAGES, 
  INITIAL_LEADS, 
  INITIAL_INTEGRATIONS,
  INITIAL_CUSTOMERS,
  PRODUCTS
} from './data';

// Custom Components
import LandingPage from './components/LandingPage';
import DashboardOverview from './components/DashboardOverview';
import AnalyticsHub from './components/AnalyticsHub';
import MarketWatchView from './components/MarketWatchView';
import IntegrationsView from './components/IntegrationsView';
import OrderDetailsView from './components/OrderDetailsView';
import CustomerStorefront from './components/CustomerStorefront';
import CustomerManagement from './components/CustomerManagement';
import SmeFunnel from './components/SmeFunnel';
import InventoryManager from './components/InventoryManager';

// Firebase & Google Sheets Integration
import { initAuth, googleSignIn, logout, listenToLeads, subscribeToGoogleConfig, saveGoogleConfig } from './lib/firebase';
import { createSmeLeadsSpreadsheet, appendLeadToGoogleSheet } from './lib/sheets';

export default function App() {
  
  // Navigation View controller
  // 'landing' | 'overview' | 'analytics' | 'market' | 'integrations' | 'tracking' | 'crm' | 'store' | 'sme-funnel'
  const [view, setView] = useState<'landing' | 'overview' | 'analytics' | 'market' | 'integrations' | 'tracking' | 'crm' | 'store' | 'sme-funnel'>('landing');

  // Dark Mode preference state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sme_dark_mode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sme_dark_mode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  // Unified application state
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [rawLeads, setRawLeads] = useState<QuizLead[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem('sme_products_inventory');
    return cached ? JSON.parse(cached) : PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('sme_products_inventory', JSON.stringify(products));
  }, [products]);
  
  // Selected Order for Tracking
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // System time ticker
  const [systemTime, setSystemTime] = useState<string>('');

  // Google Sheets Integration State
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [googleSpreadsheetId, setGoogleSpreadsheetId] = useState<string>(() => {
    const cached = localStorage.getItem('sme_google_spreadsheet_id');
    if (!cached || cached === '1aBcdEFgHiJKlMnoPqRStUvWxYz_LagosGrowthSheets_2026') {
      localStorage.setItem('sme_google_spreadsheet_id', '1SKF9b5C3kPF6swLjKpZEFul2z_0g4UuJyfL3Ckqh7BM');
      return '1SKF9b5C3kPF6swLjKpZEFul2z_0g4UuJyfL3Ckqh7BM';
    }
    return cached;
  });

  const handleSetGoogleSpreadsheetId = async (id: string) => {
    setGoogleSpreadsheetId(id);
    localStorage.setItem('sme_google_spreadsheet_id', id);
    if (googleToken) {
      try {
        await saveGoogleConfig(googleToken, id, googleUser?.email || 'admin');
      } catch (err) {
        console.error('Failed to sync updated spreadsheet ID to Firestore:', err);
      }
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync with Firestore leads & Auth on mount
  useEffect(() => {
    const unsubscribeAuth = initAuth(
      async (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        setIntegrations(prev => prev.map(int => (int.id === 'int-sheets' || int.id === 'int-4') ? { ...int, isConnected: true, tag: 'Active & Synced' } : int));
        try {
          let storedSpreadsheetId = localStorage.getItem('sme_google_spreadsheet_id');
          if (!storedSpreadsheetId || storedSpreadsheetId === '1aBcdEFgHiJKlMnoPqRStUvWxYz_LagosGrowthSheets_2026') {
            storedSpreadsheetId = '1SKF9b5C3kPF6swLjKpZEFul2z_0g4UuJyfL3Ckqh7BM';
            localStorage.setItem('sme_google_spreadsheet_id', storedSpreadsheetId);
          }
          await saveGoogleConfig(token, storedSpreadsheetId, user.email || 'admin');
        } catch (err) {
          console.error('Error auto-saving google credentials to Firestore:', err);
        }
      },
      () => {
        setGoogleUser(null);
      }
    );

    const unsubscribeLeads = listenToLeads((firestoreLeads) => {
      setRawLeads(firestoreLeads);
      if (firestoreLeads.length > 0) {
        const mappedLeads: Lead[] = firestoreLeads.map(ql => ({
          id: ql.id,
          name: `${ql.name} (${ql.businessName})`,
          score: ql.revenueLeakage > 1500000 ? 'HOT' : 'WARM',
          summary: `Industry: ${ql.industry}. Pain Point: ${ql.corePain}. Leakage: ₦${ql.revenueLeakage.toLocaleString()}/yr. Booking: ${ql.booking ? `${ql.booking.date} @ ${ql.booking.time}` : 'None'}. Contact: ${ql.whatsapp} | ${ql.email}`,
          statusTag: ql.booking ? 'Consultation Booked' : 'Diagnostic Completed'
        }));
        setLeads(mappedLeads);
      } else {
        setLeads(INITIAL_LEADS);
      }
    });

    // Real-time sync of Shared Google configuration
    const unsubscribeGoogleConfig = subscribeToGoogleConfig((config) => {
      if (config && config.accessToken) {
        setGoogleToken(config.accessToken);
        setGoogleSpreadsheetId(config.spreadsheetId);
        setIntegrations(prev => prev.map(int => (int.id === 'int-sheets' || int.id === 'int-4') ? { ...int, isConnected: true, tag: 'Active & Synced' } : int));
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeLeads();
      unsubscribeGoogleConfig();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        setIntegrations(prev => prev.map(int => (int.id === 'int-sheets' || int.id === 'int-4') ? { ...int, isConnected: true, tag: 'Active & Synced' } : int));
        // Save to shared Firestore config so anyone booking is routed automatically!
        await saveGoogleConfig(result.accessToken, googleSpreadsheetId, result.user.email || 'admin');
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      throw err;
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await logout();
      setGoogleUser(null);
      setGoogleToken(null);
      setIntegrations(prev => prev.map(int => (int.id === 'int-sheets' || int.id === 'int-4') ? { ...int, isConnected: false, tag: 'Real-Time Sync' } : int));
      // Optionally clear the config from Firestore so customer views don't try to use logged-out token
      await saveGoogleConfig('', '', '');
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const handleCreateNewSheet = async () => {
    if (!googleToken) {
      throw new Error('Please connect your Google Account first.');
    }
    try {
      const newSheetId = await createSmeLeadsSpreadsheet(googleToken, 'RetailFlow OS - SME Diagnostic Leads');
      handleSetGoogleSpreadsheetId(newSheetId);
    } catch (err: any) {
      console.error('Create sheet error:', err);
      throw err;
    }
  };

  const handleTestSheetsSync = async () => {
    if (!googleToken || !googleSpreadsheetId) {
      throw new Error('Google Sheets is not fully configured.');
    }
    
    const testLead = {
      id: `test-lead-${Date.now()}`,
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
      syncedToSheets: true
    };

    try {
      await appendLeadToGoogleSheet(googleToken, googleSpreadsheetId, testLead);
    } catch (err: any) {
      console.error('Test sync error:', err);
      throw err;
    }
  };

  // Action: Add new Sales Order
  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    // Update products stock levels based on products ordered
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        // Find if product name is mentioned in the order details (e.g. "2x iPhone 15 Pro, 1x MacBook Air M3")
        const regex = new RegExp(`(\\d+)x\\s+${p.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');
        const match = newOrder.product.match(regex);
        if (match) {
          const qty = parseInt(match[1], 10) || 1;
          return { ...p, stock: Math.max(0, p.stock - qty) };
        } else if (newOrder.product.toLowerCase().includes(p.name.toLowerCase())) {
          return { ...p, stock: Math.max(0, p.stock - 1) };
        }
        return p;
      });
    });
    
    // Auto-generate high-intent Lead from new order
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: newOrder.customerName,
      score: 'HOT',
      summary: `Auto-generated. Client successfully filed order manifest ${newOrder.id} (${newOrder.product}) at ${newOrder.location}.`,
      statusTag: 'Order Placed'
    };
    setLeads(prev => [newLead, ...prev]);
  };

  // Action: Cycle or Change status of Sales Order
  const handleChangeOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    
    // If tracking active order, keep selectedOrder state in sync
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  // Action: Send client reply (Inbox)
  const handleSendMessage = (text: string, channel: 'WhatsApp' | 'Instagram', sender: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const operatorMsg: Message = {
      id: `msg-${Date.now()}`,
      channel,
      sender,
      text,
      timestamp,
      isIncoming: false
    };
    setMessages(prev => [...prev, operatorMsg]);
  };

  // Action: Select Order for Visual Live Tracking
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setView('tracking');
  };

  // Action: Toggle connected switches
  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        const isNowConnected = !int.isConnected;
        return {
          ...int,
          isConnected: isNowConnected,
          tag: isNowConnected ? 'Automation Active' : 'Offline'
        };
      }
      return int;
    }));
  };

  // Action: Complete OAuth simulation connection
  const handleConnectIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        return {
          ...int,
          isConnected: true,
          tag: 'Authorized & Synced'
        };
      }
      return int;
    }));
  };

  // Enter operating system CTA callbacks
  const handleEnterAdmin = () => {
    setView('overview');
  };

  const handleEnterCustomer = () => {
    setView('store');
  };

  // Render Customer Storefront directly if active (no Admin sidebar wrap)
  if (view === 'store') {
    return (
      <CustomerStorefront 
        onBackToLanding={() => setView('landing')}
        onAddOrder={(newOrder) => {
          handleAddOrder(newOrder);
        }}
        onSelectOrder={(order) => {
          setSelectedOrder(order);
          setView('tracking');
        }}
        existingOrders={orders}
        products={products}
      />
    );
  }

  // Render Sme Funnel if active
  if (view === 'sme-funnel') {
    return (
      <SmeFunnel 
        onBackToLanding={() => setView('landing')}
        onEnterAdmin={handleEnterAdmin}
        onAddAdminLead={(newLead) => setLeads(prev => [newLead, ...prev])}
        googleToken={googleToken}
        googleSpreadsheetId={googleSpreadsheetId}
        onGoogleSignIn={handleGoogleSignIn}
      />
    );
  }

  // Render Landing Page if active
  if (view === 'landing') {
    return (
      <LandingPage 
        onEnterAdmin={handleEnterAdmin} 
        onEnterCustomer={handleEnterCustomer} 
        onEnterSmeFunnel={() => setView('sme-funnel')}
      />
    );
  }

  const currentViewTitle = () => {
    switch(view) {
      case 'overview': return 'Sales Operations Desk';
      case 'analytics': return 'Dynamic Analytics Hub';
      case 'market': return 'Competitor Feed Scrapers';
      case 'integrations': return 'System Integrations & APIs';
      case 'tracking': return 'Live Delivery Express Tracker';
      case 'crm': return 'Customer Database & CRM Directory';
      case 'inventory': return 'Inventory & Stock Manager';
      default: return 'Lagos Admin Console';
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen flex flex-col md:flex-row font-sans selection:bg-blue-600/10 selection:text-blue-900 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Dynamic Background Glows */}
      <div className="fixed top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Workspace Sidebar Shell */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 z-40 relative md:sticky md:top-0 md:h-screen shadow-sm dark:bg-slate-900 dark:border-slate-800">
        
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-2 px-2 py-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-950 block leading-none">RetailFlow OS</span>
              <span className="text-[9px] font-mono text-blue-700 mt-1 block tracking-wider uppercase font-bold">Lagos Admin Node</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setView('overview')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2.5 transition-all ${
                view === 'overview' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <ShoppingCart className="w-4.5 h-4.5" /> Operations Pipeline
            </button>

            <button
              onClick={() => setView('inventory')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2.5 transition-all ${
                view === 'inventory' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Package className="w-4.5 h-4.5" /> Manage Stocks
            </button>

            <button
              onClick={() => setView('analytics')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2.5 transition-all ${
                view === 'analytics' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" /> Strategic Analytics
            </button>

            <button
              onClick={() => setView('market')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2.5 transition-all ${
                view === 'market' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Globe className="w-4.5 h-4.5" /> Market Scrapers
            </button>

            <button
              onClick={() => setView('integrations')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2.5 transition-all ${
                view === 'integrations' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Settings className="w-4.5 h-4.5" /> Connect Channels
            </button>

            <button
              onClick={() => setView('crm')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2.5 transition-all ${
                view === 'crm' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Users className="w-4.5 h-4.5" /> Client Directory CRM
            </button>
          </nav>
        </div>

        {/* Lower operator credits / logout */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 px-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Operator Node Online
            </span>
          </div>

          <button
            onClick={() => setView('landing')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-300 transition-all flex items-center gap-2 cursor-pointer border border-transparent"
          >
            <LogOut className="w-4 h-4" /> Exit Workspace
          </button>
        </div>

      </aside>

      {/* Main Container Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header navbar bar */}
        <header className="bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-200/80 sticky top-0 z-30 shadow-sm dark:bg-slate-900/80 dark:border-slate-800">
          <div>
            <h1 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
              {currentViewTitle()}
            </h1>
            <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">TechHub Lagos • Ikeja Node Active</p>
          </div>

          {/* Quick System Metrics indicators */}
          <div className="flex items-center gap-3">
            
            <button
              id="theme-toggle-header"
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-400 transition-all cursor-pointer flex items-center justify-center shadow-xs"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-700" />}
            </button>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-blue-700 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>LAGOS: {systemTime || '--:--:--'}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-100 rounded-xl text-[11px] font-mono text-green-700 font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>SLA: 99.9% OK</span>
            </div>

          </div>
        </header>

        {/* View body scroll container */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {view === 'overview' && (
            <DashboardOverview 
              orders={orders}
              onAddOrder={handleAddOrder}
              onChangeOrderStatus={handleChangeOrderStatus}
              messages={messages}
              onSendMessage={handleSendMessage}
              onSelectOrder={handleSelectOrder}
              leads={leads}
              onUpdateLead={(id, updates) => setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))}
              products={products}
              onNavigate={setView}
            />
          )}

          {view === 'analytics' && (
            <AnalyticsHub />
          )}

          {view === 'market' && (
            <MarketWatchView />
          )}

          {view === 'integrations' && (
            <IntegrationsView 
              integrations={integrations}
              onToggleIntegration={handleToggleIntegration}
              onConnectIntegration={handleConnectIntegration}
              googleUser={googleUser}
              googleToken={googleToken}
              onGoogleSignIn={handleGoogleSignIn}
              onGoogleSignOut={handleGoogleSignOut}
              googleSpreadsheetId={googleSpreadsheetId}
              onSetGoogleSpreadsheetId={handleSetGoogleSpreadsheetId}
              onCreateNewSheet={handleCreateNewSheet}
              onTestSheetsSync={handleTestSheetsSync}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              rawLeads={rawLeads}
            />
          )}

          {view === 'tracking' && selectedOrder && (
            <OrderDetailsView 
              order={selectedOrder}
              onClose={() => setView('overview')}
              onChangeOrderStatus={handleChangeOrderStatus}
            />
          )}

          {view === 'crm' && (
            <CustomerManagement 
              customers={customers}
              orders={orders}
              onUpdateCustomer={(id, updates) => setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))}
            />
          )}

          {view === 'inventory' && (
            <InventoryManager 
              products={products}
              onUpdateProducts={setProducts}
            />
          )}

        </div>

      </main>

    </div>
  );
}
