import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Sparkles, TrendingUp, AlertTriangle, ArrowUpRight, Zap, BadgeAlert, CheckCircle, Info } from 'lucide-react';

const REVENUE_DATA = [
  { name: 'Mon', Revenue: 3400000, Forecast: 3400000 },
  { name: 'Tue', Revenue: 4100000, Forecast: 4100000 },
  { name: 'Wed', Revenue: 3800000, Forecast: 3800000 },
  { name: 'Thu', Revenue: 4200000, Forecast: 4500000 },
  { name: 'Fri', Revenue: 4800000, Forecast: 5200000 },
  { name: 'Sat', Revenue: 5900000, Forecast: 6400000 },
  { name: 'Sun', Revenue: 6200000, Forecast: 7100000 },
];

const VELOCITY_DATA = [
  { name: 'iPhone 15', Stock: 45, Velocity: 12 },
  { name: 'MacBook M3', Stock: 15, Velocity: 8 },
  { name: 'iPad Pro', Stock: 20, Velocity: 4 },
  { name: 'Sony XM5', Stock: 35, Velocity: 15 },
  { name: 'S24 Ultra', Stock: 10, Velocity: 5 },
];

export default function AnalyticsHub() {
  const [discountApplied, setDiscountApplied] = useState(false);
  const [restockInitiated, setRestockInitiated] = useState<string | null>(null);
  const [activeToast, setActiveToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 5000);
  };

  const handleApplyDiscount = () => {
    setDiscountApplied(true);
    showToast("AI Sales Closer: Instantly generated a 3% seasonal promo code and sent it to active cart-abandoners via WhatsApp!");
  };

  const handleRestock = (product: string) => {
    setRestockInitiated(product);
    setTimeout(() => {
      showToast(`AI Inventory: Auto-generated a Purchase Order (PO) for 25x ${product} and synced it with your Retail POS ledger.`);
      setRestockInitiated(null);
    }, 450);
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
      
      {/* Visual Analytics Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 text-blue-700 mb-2.5 font-bold">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider font-extrabold">Predictive Data Analyst Active</span>
        </div>
        <h2 className="text-xl font-black text-slate-950 mb-2">High-Ticket Elektroniks Volume Forecast</h2>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Based on historical weekend buying spikes in Lekki Phase 1 and Ikeja stores, we project a <strong className="text-slate-900 font-bold">15.4% surge</strong> in computing device sales over the next 48 hours. Let the autonomous models pre-allocate stock levels.
        </p>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Revenue & Forecast */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col h-[380px] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-950">Daily Cash Velocity vs AI Forecast</h3>
              <p className="text-[10px] text-slate-400 font-mono font-bold">Billed in Naira (₦)</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-green-50 border border-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Trend Up
            </span>
          </div>

          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0369A1" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#0369A1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={10} 
                  tickLine={false} 
                  tickFormatter={(val) => `₦${(val / 1000000).toFixed(1)}M`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  formatter={(value: any) => [`₦${value.toLocaleString()}`]}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#1D4ED8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Forecast" stroke="#0369A1" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorFore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Product Velocity vs Stock levels */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col h-[380px] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-950">Stock Level vs Sales Velocity</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Daily units sold compared to shelf inventory</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              5 SKU Logs
            </span>
          </div>

          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VELOCITY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, color: '#334155', fontWeight: 'bold' }} />
                <Bar dataKey="Stock" fill="#2563EB" radius={[4, 4, 0, 0]} name="In Stock Units" />
                <Bar dataKey="Velocity" fill="#E11D48" radius={[4, 4, 0, 0]} name="Daily Velocity Units" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Dynamic Recommendation cards */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-base text-slate-950">Dynamic Restock & Margin Tuning Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Action 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 border-amber-200 relative flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-amber-700 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase font-black tracking-wider">Stock Deficit Warning</span>
              </div>
              <h4 className="font-black text-slate-950 text-sm">MacBook Air M3 Stock Deficit</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Ikeja store is carrying only 3 MacBook units while weekend bulk requests are scored high-velocity.
              </p>
            </div>
            <button 
              onClick={() => handleRestock('MacBook Air M3')}
              disabled={restockInitiated !== null}
              className="mt-5 w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
            >
              {restockInitiated === 'MacBook Air M3' ? 'Processing order...' : 'Approve 25x Ikeja Restock'}
            </button>
          </div>

          {/* Action 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 border-cyan-200 relative flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-700 font-bold">
                <Zap className="w-4 h-4 animate-pulse" />
                <span className="font-mono text-[10px] uppercase font-black tracking-wider">Dynamic Pricing Option</span>
              </div>
              <h4 className="font-black text-slate-950 text-sm">Convert iPad Pro Abandoned Carts</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                6 active Lagos shoppers have left high-spec iPad Pros in their web baskets over the last 12 hours.
              </p>
            </div>
            <button 
              onClick={handleApplyDiscount}
              disabled={discountApplied}
              className={`mt-5 w-full font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                discountApplied 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs'
              }`}
            >
              {discountApplied ? '✓ 3% Coupon Dispatched' : 'Apply 3% Flash Discount'}
            </button>
          </div>

          {/* Action 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 border-rose-200 relative flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-rose-700 font-bold">
                <BadgeAlert className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase font-black tracking-wider">Competitor Watch alert</span>
              </div>
              <h4 className="font-black text-slate-950 text-sm">Pointek S24 price dropped</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Pointek just dropped S24 pricing by ₦15,000 on Lagos Mainland. Recommend dynamic defense.
              </p>
            </div>
            <button 
              onClick={() => handleRestock('Galaxy S24 Ultra')}
              disabled={restockInitiated !== null}
              className="mt-5 w-full border border-rose-200 bg-rose-50/20 hover:bg-rose-50 text-rose-700 font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Analyze Dynamic Price Defense
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
