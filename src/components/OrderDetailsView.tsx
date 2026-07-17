import React, { useState } from 'react';
import { Order } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  Play, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface OrderDetailsViewProps {
  order: Order;
  onClose: () => void;
  onChangeOrderStatus: (orderId: string, status: Order['status']) => void;
}

export default function OrderDetailsView({
  order,
  onClose,
  onChangeOrderStatus
}: OrderDetailsViewProps) {
  
  const [logisticsLogs, setLogisticsLogs] = useState<string[]>([
    '09:15 AM - Automated inventory stock verification pass passed.',
    '09:47 AM - Customer invoice drafted and dispatched to buyer.',
  ]);

  const statusSteps: Array<{ key: Order['status']; label: string; desc: string; icon: any }> = [
    { key: 'NEW', label: 'Order Received', desc: 'Added to retail queue', icon: Clock },
    { key: 'CONFIRMED', label: 'AI Confirmed', desc: 'Packaged & invoice synced', icon: Package },
    { key: 'SHIPPED', label: 'Dispatched', desc: 'In transit via Lagos express', icon: Truck },
    { key: 'DELIVERED', label: 'Received', desc: 'Delivered at client location', icon: CheckCircle },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);

  // Function to simulate next logistics hop
  const handleSimulateNextStep = () => {
    if (order.status === 'DELIVERED') {
      onChangeOrderStatus(order.id, 'NEW');
      setLogisticsLogs(['09:15 AM - Reset logistics loop. Verification initiated.']);
      return;
    }

    const nextStatusMap: Record<Order['status'], Order['status']> = {
      'NEW': 'CONFIRMED',
      'CONFIRMED': 'SHIPPED',
      'SHIPPED': 'DELIVERED',
      'DELIVERED': 'NEW'
    };

    const nextStatus = nextStatusMap[order.status];
    onChangeOrderStatus(order.id, nextStatus);

    // Append beautiful situational lagos logistics logs
    const logMap: Record<Order['status'], string> = {
      'CONFIRMED': '10:14 AM - AI closer matched pricing. Payment confirmation recorded.',
      'SHIPPED': '11:30 AM - Dispatched from Ikeja Warehouse, heading towards Lekki Toll Gate.',
      'DELIVERED': '12:45 PM - Driver arrived. Delivery signature confirmed.',
      'NEW': '09:15 AM - Loop Reset.'
    };

    setLogisticsLogs(prev => [...prev, logMap[nextStatus]]);
  };

  return (
    <div className="space-y-6">
      
      {/* Return button */}
      <button 
        onClick={onClose}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-white bg-[#161618] border border-[#27272A] px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Sales Pipeline
      </button>

      {/* Header card info */}
      <div className="glass-panel glass-highlight rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 px-2 py-0.5 rounded font-bold">
                {order.channel}
              </span>
              <span className="text-xs font-mono text-on-surface-variant">{order.time}</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Sales Tracker: <span className="text-cyan-400 font-mono">{order.id}</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Client: <strong>{order.customerName}</strong> | Destination: <strong>{order.location}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-mono text-on-surface-variant block uppercase">Total Invoice Value</span>
              <span className="text-xl font-extrabold text-white font-mono">
                ₦{order.value.toLocaleString()}
              </span>
            </div>

            <button 
              onClick={handleSimulateNextStep}
              className="bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Simulate Transit Step
            </button>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline (left columns) */}
        <div className="lg:col-span-2 glass-panel glass-highlight rounded-xl p-6 space-y-6">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-[#3B82F6]" /> Active Delivery Timeline
          </h3>

          <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#27272A]">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isPast = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} className="relative flex gap-4 items-start">
                  
                  {/* Timeline point */}
                  <div className={`absolute left-[-21px] w-6 h-6 rounded-full flex items-center justify-center border transition-all z-10 ${
                    isCurrent ? 'bg-[#3B82F6] text-white border-[#3B82F6] scale-110 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                    isPast ? 'bg-[#161618] text-green-400 border-green-500/50' :
                    'bg-[#0A0A0B] text-zinc-600 border-[#27272A]'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div>
                    <h4 className={`text-sm font-bold ${isCurrent ? 'text-white' : isPast ? 'text-white/80' : 'text-zinc-500'}`}>
                      {step.label}
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {step.desc}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Lagos Logistics map representation (right) */}
        <div className="glass-panel glass-highlight rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" /> Logistics Route Schematic
            </h3>
            <p className="text-[10px] text-on-surface-variant">Lagos Mainland to Island Expressway corridor</p>
          </div>

          {/* Map display */}
          <div className="relative h-[200px] rounded-lg bg-[#0A0A0B] border border-[#27272A]/80 p-4 overflow-hidden flex flex-col justify-between">
            <div className="absolute top-4 left-4 font-mono text-[9px] text-cyan-400">Node: Ikeja (Warehouse)</div>
            <div className="absolute bottom-4 right-4 font-mono text-[9px] text-[#3B82F6]">Node: {order.location}</div>
            
            {/* Styled path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M 40 40 Q 150 50 150 100 T 260 160" 
                fill="none" 
                stroke="#27272A" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
              <path 
                d="M 40 40 Q 150 50 150 100 T 260 160" 
                fill="none" 
                stroke={order.status === 'DELIVERED' ? '#22c55e' : '#3B82F6'} 
                strokeWidth="2" 
                strokeLinecap="round"
                className="animate-pulse"
              />
              
              {/* Dynamic pulse dot representing carrier */}
              {order.status === 'CONFIRMED' && <circle cx="85" cy="42" r="5" fill="#3B82F6" className="animate-ping" />}
              {order.status === 'SHIPPED' && <circle cx="150" cy="100" r="5" fill="#3B82F6" className="animate-ping" />}
              {order.status === 'DELIVERED' && <circle cx="260" cy="160" r="5" fill="#22c55e" />}
            </svg>

            {/* Custom dots */}
            <div className="flex justify-between items-center z-10">
              <div className="w-3 h-3 bg-white rounded-full border border-black shadow" />
              <div className="w-3 h-3 bg-white rounded-full border border-black shadow" />
            </div>
            
            <div className="text-center font-mono text-[8px] text-on-surface-variant z-10 pointer-events-none">
              Third-Party Delivery API: Courier Dispatch Verified
            </div>
          </div>

          {/* Logs */}
          <div className="bg-[#0A0A0B]/60 p-3 rounded-lg border border-[#27272A]/40 space-y-1.5">
            <span className="text-[10px] font-mono text-on-surface-variant block uppercase tracking-wider mb-1">
              Dynamic Courier Manifest
            </span>
            <div className="space-y-1 text-[9px] font-mono text-cyan-200/90 leading-tight">
              {logisticsLogs.map((log, index) => (
                <div key={index} className="flex gap-1.5">
                  <span>▶</span> <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
