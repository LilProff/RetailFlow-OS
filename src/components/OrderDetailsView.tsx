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
    <div className="space-y-6 animate-fade-in">
      
      {/* Return button */}
      <button 
        onClick={onClose}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-250 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Sales Pipeline
      </button>

      {/* Header card info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {order.channel}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">{order.time}</span>
            </div>
            <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
              Sales Tracker: <span className="text-blue-700 font-mono font-black">{order.id}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
              Client: <strong className="text-slate-900 font-bold">{order.customerName}</strong> | Destination: <strong className="text-slate-900 font-bold">{order.location}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-left md:text-right">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">Total Invoice Value</span>
              <span className="text-xl font-black text-slate-950 font-mono">
                ₦{order.value.toLocaleString()}
              </span>
            </div>

            <button 
              onClick={handleSimulateNextStep}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Simulate Transit Step
            </button>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline (left columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h3 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-blue-700" /> Active Delivery Timeline
          </h3>

          <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isPast = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} className="relative flex gap-4 items-start">
                  
                  {/* Timeline point */}
                  <div className={`absolute left-[-21px] w-6 h-6 rounded-full flex items-center justify-center border transition-all z-10 ${
                    isCurrent ? 'bg-blue-700 text-white border-blue-700 scale-110 shadow-xs' :
                    isPast ? 'bg-green-50 text-green-700 border-green-200' :
                    'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div>
                    <h4 className={`text-sm font-bold ${isCurrent ? 'text-slate-950' : isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.label}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-light">
                      {step.desc}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Lagos Logistics map representation (right) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="font-bold text-sm text-slate-950 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-600" /> Logistics Route Schematic
            </h3>
            <p className="text-[10px] text-slate-400 font-bold">Lagos Mainland to Island Expressway corridor</p>
          </div>

          {/* Map display */}
          <div className="relative h-[200px] rounded-xl bg-slate-50 border border-slate-200 p-4 overflow-hidden flex flex-col justify-between">
            <div className="absolute top-4 left-4 font-mono text-[9px] text-cyan-700 font-bold">Node: Ikeja (Warehouse)</div>
            <div className="absolute bottom-4 right-4 font-mono text-[9px] text-blue-700 font-bold">Node: {order.location}</div>
            
            {/* Styled path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M 40 40 Q 150 50 150 100 T 260 160" 
                fill="none" 
                stroke="#E2E8F0" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
              <path 
                d="M 40 40 Q 150 50 150 100 T 260 160" 
                fill="none" 
                stroke={order.status === 'DELIVERED' ? '#16A34A' : '#1D4ED8'} 
                strokeWidth="2" 
                strokeLinecap="round"
                className="animate-pulse"
              />
              
              {/* Dynamic pulse dot representing carrier */}
              {order.status === 'CONFIRMED' && <circle cx="85" cy="42" r="5" fill="#1D4ED8" className="animate-ping" />}
              {order.status === 'SHIPPED' && <circle cx="150" cy="100" r="5" fill="#1D4ED8" className="animate-ping" />}
              {order.status === 'DELIVERED' && <circle cx="260" cy="160" r="5" fill="#16A34A" />}
            </svg>

            {/* Custom dots */}
            <div className="flex justify-between items-center z-10">
              <div className="w-3 h-3 bg-white rounded-full border border-slate-300 shadow-sm" />
              <div className="w-3 h-3 bg-white rounded-full border border-slate-300 shadow-sm" />
            </div>
            
            <div className="text-center font-mono text-[8px] text-slate-400 z-10 pointer-events-none font-bold">
              Third-Party Delivery API: Courier Dispatch Verified
            </div>
          </div>

          {/* Logs */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider mb-1 font-bold">
              Dynamic Courier Manifest
            </span>
            <div className="space-y-1 text-[9px] font-mono text-cyan-800 leading-tight">
              {logisticsLogs.map((log, index) => (
                <div key={index} className="flex gap-1.5">
                  <span className="text-cyan-600 font-bold">▶</span> <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
