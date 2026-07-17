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
import { Sparkles, TrendingUp, AlertTriangle, ArrowUpRight, Zap, BadgeAlert } from 'lucide-react';

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
  { name: 'iPhone 15 Pro', Stock: 45, Velocity: 12 },
  { name: 'MacBook M3', Stock: 15, Velocity: 8 },
  { name: 'iPad Pro', Stock: 20, Velocity: 4 },
  { name: 'Sony XM5', Stock: 35, Velocity: 15 },
  { name: 'S24 Ultra', Stock: 10, Velocity: 5 },
];

export default function AnalyticsHub() {
  const [discountApplied, setDiscountApplied] = useState(false);
  const [restockInitiated, setRestockInitiated] = useState<string | null>(null);

  const handleApplyDiscount = () => {
    setDiscountApplied(true);
    alert("AI Sales Closer: Instantly generated a 3% seasonal promo code and sent it to active cart-abandoners via WhatsApp!");
  };

  const handleRestock = (product: string) => {
    setRestockInitiated(product);
    setTimeout(() => {
      alert(`AI Inventory: Auto-generated a Purchase Order (PO) for 25x ${product} and synced it with your Retail POS ledger.`);
      setRestockInitiated(null);
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Analytics Banner */}
      <div className="glass-panel glass-highlight rounded-xl p-6 relative overflow-hidden ai-glow">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 text-[#3B82F6] mb-2 font-semibold">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider">Predictive Data Analyst Active</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">High-Ticket Elektroniks Volume Forecast</h2>
        <p className="text-xs text-on-surface-variant max-w-2xl">
          Based on historical weekend buying spikes in Lekki Phase 1 and Ikeja stores, we project a <strong>15.4% surge</strong> in computing device sales over the next 48 hours. Let the autonomous models pre-allocate stock levels.
        </p>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Revenue & Forecast */}
        <div className="glass-panel glass-highlight rounded-xl p-4 flex flex-col h-[360px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Daily Cash Velocity vs AI Forecast</h3>
              <p className="text-[10px] text-on-surface-variant font-mono">Billed in Naira (₦)</p>
            </div>
            <span className="text-[10px] font-mono bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">
              Trend Up
            </span>
          </div>

          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#03B5D3" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#03B5D3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis dataKey="name" stroke="#8c909f" fontSize={10} tickLine={false} />
                <YAxis 
                  stroke="#8c909f" 
                  fontSize={10} 
                  tickLine={false} 
                  tickFormatter={(val) => `₦${(val / 1000000).toFixed(1)}M`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161618', borderColor: '#27272A', color: '#fff' }}
                  formatter={(value: any) => [`₦${value.toLocaleString()}`]}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Forecast" stroke="#03B5D3" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorFore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Product Velocity vs Stock levels */}
        <div className="glass-panel glass-highlight rounded-xl p-4 flex flex-col h-[360px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Stock Level vs Sales Velocity</h3>
              <p className="text-[10px] text-on-surface-variant">Daily units sold compared to shelf inventory</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
              5 SKU Logs
            </span>
          </div>

          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VELOCITY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis dataKey="name" stroke="#8c909f" fontSize={10} tickLine={false} />
                <YAxis stroke="#8c909f" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161618', borderColor: '#27272A', color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, color: '#e5e2e3' }} />
                <Bar dataKey="Stock" fill="#3b82f6" radius={[4, 4, 0, 0]} name="In Stock Units" />
                <Bar dataKey="Velocity" fill="#e11d48" radius={[4, 4, 0, 0]} name="Daily Velocity Units" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Dynamic Recommendation cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-white">Dynamic Restock & Margin Tuning Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Action 1 */}
          <div className="glass-panel rounded-xl p-5 border-amber-500/20 relative flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Stock Deficit Warning</span>
              </div>
              <h4 className="font-bold text-white text-sm">MacBook Air M3 Stock Deficit</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Ikeja store is carrying only 3 MacBook units while weekend bulk requests are scored high-velocity.
              </p>
            </div>
            <button 
              onClick={() => handleRestock('MacBook Air M3')}
              disabled={restockInitiated !== null}
              className="mt-4 w-full bg-[#3B82F6] hover:bg-blue-600 disabled:bg-gray-700 text-white font-bold py-2 rounded text-xs transition-colors cursor-pointer"
            >
              {restockInitiated === 'MacBook Air M3' ? 'Processing order...' : 'Approve 25x Ikeja Restock'}
            </button>
          </div>

          {/* Action 2 */}
          <div className="glass-panel rounded-xl p-5 border-cyan-500/20 relative flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Zap className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Dynamic Pricing Option</span>
              </div>
              <h4 className="font-bold text-white text-sm">Convert iPad Pro Abandoned Carts</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                6 active Lagos shoppers have left high-spec iPad Pros in their web baskets over the last 12 hours.
              </p>
            </div>
            <button 
              onClick={handleApplyDiscount}
              disabled={discountApplied}
              className={`mt-4 w-full font-bold py-2 rounded text-xs transition-colors cursor-pointer ${
                discountApplied 
                  ? 'bg-green-600/20 text-green-400 border border-green-500/20' 
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black'
              }`}
            >
              {discountApplied ? '✓ 3% Coupon Dispatched' : 'Apply 3% Flash Discount'}
            </button>
          </div>

          {/* Action 3 */}
          <div className="glass-panel rounded-xl p-5 border-rose-500/20 relative flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rose-400">
                <BadgeAlert className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Competitor Watch alert</span>
              </div>
              <h4 className="font-bold text-white text-sm">Pointek S24 price dropped</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Pointek just dropped S24 pricing by ₦15,000 on Lagos Mainland. Recommend dynamic defense.
              </p>
            </div>
            <button 
              onClick={() => handleRestock('Galaxy S24 Ultra')}
              disabled={restockInitiated !== null}
              className="mt-4 w-full border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-bold py-2 rounded text-xs transition-colors cursor-pointer"
            >
              Analyze Dynamic Price Defense
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
