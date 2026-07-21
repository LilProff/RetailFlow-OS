import React, { useState } from 'react';
import { 
  COMPETITOR_PRICES 
} from '../data';
import { CompetitorPrice } from '../types';
import { Globe, TrendingDown, TrendingUp, RefreshCw, Sparkles, AlertCircle, MapPin, CheckCircle, Info } from 'lucide-react';

export default function MarketWatchView() {
  const [prices, setPrices] = useState<CompetitorPrice[]>(COMPETITOR_PRICES);
  const [syncingItemId, setSyncingItemId] = useState<string | null>(null);
  const [activeToast, setActiveToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 5000);
  };

  const handleSyncToBeat = (itemId: string) => {
    setSyncingItemId(itemId);
    
    setTimeout(() => {
      setPrices(prev => prev.map(item => {
        if (item.id === itemId) {
          // Find lowest competitor price
          const lowestComp = Math.min(item.slotPrice, item.pointekPrice, item.jumiaPrice);
          // Beat it by 5,000 Naira
          const targetBeat = lowestComp - 5000;
          
          showToast(`AI Market Watch: Beat lowest Lagos competitor price of ₦${lowestComp.toLocaleString()} by ₦5,000. TechHub's retail price is now ₦${targetBeat.toLocaleString()}!`);
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
    showToast("AI scraper: Initiated cron job. Fetched slot.ng, pointekonline.com, and jumia.com.ng catalog tags.", "info");
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold">
            <Globe className="w-4.5 h-4.5" />
            <span className="font-mono text-xs uppercase tracking-wider font-extrabold">Lagos Web Scraper Active</span>
          </div>
          <button 
            onClick={handleRefreshFeed}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-450 hover:text-cyan-800 bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 px-3.5 py-2 rounded-xl border border-cyan-200 dark:border-cyan-900/40 cursor-pointer transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refetch Competitor API Feeds
          </button>
        </div>
        <h2 className="text-xl font-black text-slate-950 dark:text-white mb-2">Lagos Electronic Competitor Price Benchmarking</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          RetailFlow OS continuously monitors competitor prices from Slot, Pointek, and Jumia. Below are active benchmarks. Use the <strong className="text-slate-900 dark:text-slate-300 font-bold">Beat Price</strong> actions to maintain our 5% optimal local market lead.
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
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all relative group shadow-sm"
            >
              
              <div className="flex items-start gap-4">
                <img 
                  src={item.imageSrc} 
                  alt={item.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-contain bg-slate-50 dark:bg-slate-950 p-1 border border-slate-100 dark:border-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold">
                      {item.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold ${
                      item.trend === 'up' ? 'text-rose-600 dark:text-rose-400' : item.trend === 'down' ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : item.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                      {item.trend.toUpperCase()} TREND
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white truncate mt-1">
                    {item.product}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">TechHub Retail:</span>
                    <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-400">
                      ₦{item.techHubPrice.toLocaleString()}
                    </span>
                    {isLowest && (
                      <span className="text-[9px] bg-green-50 dark:bg-green-950/40 border border-green-150 dark:border-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-mono font-bold">
                        Lowest in Lagos
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price comparison breakdown card */}
              <div className="grid grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60 font-mono text-xs">
                
                <div className="text-center">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block mb-1 font-bold">Slot.ng</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 animate-pulse">₦{item.slotPrice.toLocaleString()}</span>
                </div>

                <div className="text-center border-x border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block mb-1 font-bold">Pointek</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">₦{item.pointekPrice.toLocaleString()}</span>
                </div>

                <div className="text-center">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block mb-1 font-bold">Jumia</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">₦{item.jumiaPrice.toLocaleString()}</span>
                </div>

              </div>

              <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>Dynamic lead margin strategy active.</span>
                </div>

                <button 
                  onClick={() => handleSyncToBeat(item.id)}
                  disabled={syncingItemId !== null}
                  className="bg-blue-700 hover:bg-blue-800 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-400 text-white text-[11px] font-mono font-black px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {syncingItemId === item.id ? 'Tuning...' : 'Beat Competitors'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Simulated Lagos Heatmap Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <div>
          <h3 className="font-bold text-sm text-slate-950 dark:text-white flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Competitor Retail Presence Heatmap
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Lagos distribution points and density metrics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-900 dark:text-white">Ikeja Distribution</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mb-2">High competitive density</p>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
              <div className="flex justify-between"><span>TechHub:</span> <span className="text-slate-900 dark:text-slate-100 font-bold">Active</span></div>
              <div className="flex justify-between"><span>Slot Store:</span> <span className="text-slate-900 dark:text-slate-100 font-bold">Direct Outlet</span></div>
              <div className="flex justify-between"><span>Pointek:</span> <span className="text-slate-900 dark:text-slate-100 font-bold">Mega Hub</span></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-900 dark:text-white">Lekki Phase 1</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mb-2">Premium buyer density</p>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
              <div className="flex justify-between"><span>TechHub:</span> <span className="text-slate-900 dark:text-slate-100 font-bold">Premium Hub</span></div>
              <div className="flex justify-between"><span>Slot Store:</span> <span className="text-slate-900 dark:text-slate-100 font-bold">3 Spots</span></div>
              <div className="flex justify-between"><span>Jumia:</span> <span className="text-slate-900 dark:text-slate-100 font-bold">Fulfillment ctr</span></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-900 dark:text-white">Victoria Island</span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mb-2">Corporate volume spikes</p>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
              <div className="flex justify-between"><span>TechHub:</span> <span className="text-slate-900 dark:text-slate-100 font-bold">Direct Warehouse</span></div>
              <div className="flex justify-between"><span>Slot Store:</span> <span className="text-slate-900 dark:text-slate-100 font-bold">None</span></div>
              <div className="flex justify-between"><span>Pointek:</span> <span className="text-slate-900 dark:text-slate-100 font-bold">None</span></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
