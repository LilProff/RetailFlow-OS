import React, { useState } from 'react';
import { 
  COMPETITOR_PRICES 
} from '../data';
import { CompetitorPrice } from '../types';
import { Globe, TrendingDown, TrendingUp, RefreshCw, Sparkles, AlertCircle, MapPin } from 'lucide-react';

export default function MarketWatchView() {
  const [prices, setPrices] = useState<CompetitorPrice[]>(COMPETITOR_PRICES);
  const [syncingItemId, setSyncingItemId] = useState<string | null>(null);

  const handleSyncToBeat = (itemId: string) => {
    setSyncingItemId(itemId);
    
    setTimeout(() => {
      setPrices(prev => prev.map(item => {
        if (item.id === itemId) {
          // Find lowest competitor price
          const lowestComp = Math.min(item.slotPrice, item.pointekPrice, item.jumiaPrice);
          // Beat it by 5,000 Naira
          const targetBeat = lowestComp - 5000;
          
          alert(`AI Market Watch: Beat lowest Lagos competitor price of ₦${lowestComp.toLocaleString()} by ₦5,000. TechHub's retail price is now ₦${targetBeat.toLocaleString()}!`);
          return {
            ...item,
            techHubPrice: targetBeat,
            trend: 'down' as const
          };
        }
        return item;
      }));
      setSyncingItemId(null);
    }, 500);
  };

  const handleRefreshFeed = () => {
    alert("AI scraper: Initiated cron job. Fetched slot.ng, pointekonline.com, and jumia.com.ng catalog tags.");
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Analytics Banner */}
      <div className="glass-panel glass-highlight rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <Globe className="w-4.5 h-4.5" />
            <span className="font-mono text-xs uppercase tracking-wider">Lagos Web Scraper Active</span>
          </div>
          <button 
            onClick={handleRefreshFeed}
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg border border-cyan-500/20 cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refetch Competitor API Feeds
          </button>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Lagos Electronic Competitor Price Benchmarking</h2>
        <p className="text-xs text-on-surface-variant max-w-2xl">
          RetailFlow OS continuously monitors competitor prices from Slot, Pointek, and Jumia. Below are active benchmarks. Use the <strong>Beat Price</strong> actions to maintain our 5% optimal local market lead.
        </p>
      </div>

      {/* Benchmarking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prices.map(item => {
          const isHighest = item.techHubPrice > item.slotPrice && item.techHubPrice > item.pointekPrice;
          const isLowest = item.techHubPrice < item.slotPrice && item.techHubPrice < item.pointekPrice && item.techHubPrice < item.jumiaPrice;

          return (
            <div 
              key={item.id}
              className="glass-panel glass-highlight rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition-all relative group"
            >
              
              <div className="flex items-start gap-4">
                <img 
                  src={item.imageSrc} 
                  alt={item.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover bg-neutral-900 border border-[#27272A]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold ${
                      item.trend === 'up' ? 'text-rose-400' : item.trend === 'down' ? 'text-green-400' : 'text-zinc-400'
                    }`}>
                      {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : item.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                      {item.trend.toUpperCase()} TREND
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white truncate mt-1">
                    {item.product}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-on-surface-variant">TechHub Retail:</span>
                    <span className="font-mono text-sm font-bold text-cyan-400">
                      ₦{item.techHubPrice.toLocaleString()}
                    </span>
                    {isLowest && (
                      <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded font-mono font-bold">
                        Lowest in Lagos
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price comparison breakdown card */}
              <div className="grid grid-cols-3 gap-2.5 bg-[#0A0A0B]/60 p-3 rounded-lg border border-[#27272A]/40 font-mono text-xs">
                
                <div className="text-center">
                  <span className="text-[9px] text-on-surface-variant block mb-1">Slot.ng</span>
                  <span className="font-bold text-white">₦{item.slotPrice.toLocaleString()}</span>
                </div>

                <div className="text-center border-x border-[#27272A]/40">
                  <span className="text-[9px] text-on-surface-variant block mb-1">Pointek</span>
                  <span className="font-bold text-white">₦{item.pointekPrice.toLocaleString()}</span>
                </div>

                <div className="text-center">
                  <span className="text-[9px] text-on-surface-variant block mb-1">Jumia</span>
                  <span className="font-bold text-white">₦{item.jumiaPrice.toLocaleString()}</span>
                </div>

              </div>

              <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#27272A]/30">
                <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                  <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Recommend dynamic repricing beat.</span>
                </div>

                <button 
                  onClick={() => handleSyncToBeat(item.id)}
                  disabled={syncingItemId !== null}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-700 text-black text-[11px] font-mono font-bold px-3 py-1.5 rounded transition-all cursor-pointer"
                >
                  {syncingItemId === item.id ? 'Tuning...' : 'Beat Competitors'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Simulated Lagos Heatmap Grid */}
      <div className="glass-panel glass-highlight rounded-xl p-5 space-y-4">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-cyan-400" /> Competitor Retail Presence Heatmap
          </h3>
          <p className="text-xs text-on-surface-variant">Lagos distribution points and density metrics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          
          <div className="p-4 rounded-lg bg-[#161618] border border-[#27272A]">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-white">Ikeja Distribution</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-on-surface-variant mb-2">High competitive density</p>
            <div className="text-[11px] text-white">
              <div className="flex justify-between"><span>TechHub:</span> <span>Active</span></div>
              <div className="flex justify-between"><span>Slot Store:</span> <span>Direct Outlet</span></div>
              <div className="flex justify-between"><span>Pointek:</span> <span>Mega Hub</span></div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#161618] border border-[#27272A]">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-white">Lekki Phase 1</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>
            <p className="text-[10px] text-on-surface-variant mb-2">Premium buyer density</p>
            <div className="text-[11px] text-white">
              <div className="flex justify-between"><span>TechHub:</span> <span>Premium Hub</span></div>
              <div className="flex justify-between"><span>Slot Store:</span> <span>3 Boutique spots</span></div>
              <div className="flex justify-between"><span>Jumia:</span> <span>Fulfillment ctr</span></div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#161618] border border-[#27272A]">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-white">Victoria Island</span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <p className="text-[10px] text-on-surface-variant mb-2">Corporate volume spikes</p>
            <div className="text-[11px] text-white">
              <div className="flex justify-between"><span>TechHub:</span> <span>Direct Warehouse</span></div>
              <div className="flex justify-between"><span>Slot Store:</span> <span>None</span></div>
              <div className="flex justify-between"><span>Pointek:</span> <span>None</span></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
