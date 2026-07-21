import { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Zap, 
  ShieldCheck, 
  MessageSquare, 
  Target, 
  BarChart3, 
  Globe, 
  Maximize2,
  Users,
  ShoppingCart,
  X,
  CheckCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  ExternalLink,
  Wallet,
  Menu,
  Shield,
  CreditCard,
  Landmark,
  Instagram,
  Mail
} from 'lucide-react';

interface LandingPageProps {
  onEnterAdmin: () => void;
  onEnterCustomer: () => void;
  onEnterSmeFunnel: () => void;
}

export default function LandingPage({ onEnterAdmin, onEnterCustomer, onEnterSmeFunnel }: LandingPageProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  return (
    <div className="bg-white text-slate-950 min-h-screen relative overflow-x-hidden selection:bg-blue-600/10 selection:text-blue-700 font-sans">
      
      {/* Structural Guideline Frames */}
      <div className="pointer-events-none absolute left-5 top-0 hidden h-full w-px bg-slate-200/80 sm:left-9 md:block lg:left-16"></div>
      <div className="pointer-events-none absolute right-5 top-0 hidden h-full w-px bg-slate-200/80 sm:right-9 md:block lg:right-16"></div>

      {/* Header */}
      <header className="flex lg:pt-8 lg:pb-8 lg:pl-16 lg:pr-16 border-slate-200/80 border-b pt-8 pr-6 pb-8 pl-6 items-center justify-between relative z-50">
        <a href="#home" className="flex items-center gap-4" aria-label="RetailFlow OS homepage">
          <span className="relative h-8 w-8 shrink-0">
            <span className="absolute left-0 top-0 h-2.5 w-2.5 rounded bg-blue-700"></span>
            <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded bg-blue-700"></span>
            <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded bg-blue-700"></span>
            <span className="absolute bottom-0 left-0 h-2.5 w-2.5 rounded bg-blue-700"></span>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded bg-blue-700"></span>
          </span>
          <span className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
            RetailFlow OS
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 xl:flex">
          <a href="#features" className="transition hover:text-blue-700">SME OS Features</a>
          <a href="#solutions" className="transition hover:text-blue-700">Growth Consultation</a>
          <a href="#contact" className="transition hover:text-blue-700">Get Consultation</a>
          <a href="#faq" className="transition hover:text-blue-700">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSelectorOpen(true)}
            className="group inline-flex items-center justify-center overflow-hidden text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(37,84,244,0.36),inset_0_1px_0_rgba(255,255,255,0.38)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 active:translate-y-0 active:scale-[0.99] font-semibold text-white tracking-[-0.02em] bg-gradient-to-br from-[#2f6bff] via-[#2454f4] to-[#1237d8] h-12 w-auto rounded-[16px] pt-0 pr-2.5 pb-0 pl-5 relative shadow-[0_18px_38px_rgba(37,84,244,0.28),inset_0_1px_0_rgba(255,255,255,0.32)] cursor-pointer"
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/24 to-transparent opacity-80"></span>
            <span className="relative z-10 whitespace-nowrap">Open Portal</span>
            <span className="relative z-10 ml-3 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border border-white/15 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)] backdrop-blur-md transition-all duration-300 group-hover:bg-white/22 group-hover:translate-x-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <path d="M7 7h10v10"></path>
                <path d="M7 17 17 7"></path>
              </svg>
            </span>
          </button>
        </div>
      </header>

      {/* Hero Body Grid */}
      <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:pb-32 lg:pt-24 pt-16 pr-6 pb-24 pl-6 lg:pl-16 lg:pr-16 items-center max-w-[1600px] mx-auto">
        <div className="max-w-3xl space-y-7">
          <div className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.08em] text-blue-700">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
              <Sparkles className="h-[18px] w-[18px]" />
            </span>
            Unified AI Sales Operating System
          </div>
          
          <h1 className="max-w-[760px] text-[3.15rem] font-bold leading-[1.03] tracking-tight text-black sm:text-6xl lg:text-[4.55rem] xl:text-[4.85rem]">
            Operational <span className="text-blue-700">intelligence</span> for modern retail.
          </h1>

          <p className="max-w-[590px] text-lg leading-8 text-slate-500 sm:text-xl">
            RetailFlow OS automates sales tracking, customer messaging, AI shopping guidance, and courier logistics into a single, high-conversion workspace.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Primary CTA */}
            <button 
              onClick={() => setIsSelectorOpen(true)}
              className="group inline-flex items-center justify-center overflow-hidden text-[16px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(37,84,244,0.36),inset_0_1px_0_rgba(255,255,255,0.38)] active:translate-y-0 active:scale-[0.99] font-semibold text-white tracking-[-0.02em] bg-gradient-to-br from-[#2f6bff] via-[#2454f4] to-[#1237d8] w-full sm:w-auto h-14 rounded-[18px] pt-0 pr-3 pb-0 pl-7 relative shadow-[0_18px_38px_rgba(37,84,244,0.28),inset_0_1px_0_rgba(255,255,255,0.32)] cursor-pointer"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/24 to-transparent opacity-80"></span>
              <span className="relative z-10 whitespace-nowrap">Launch Demo OS</span>
              <span className="relative z-10 ml-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/15 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)] backdrop-blur-md transition-all duration-300 group-hover:translate-x-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M7 7h10v10"></path>
                  <path d="M7 17 17 7"></path>
                </svg>
              </span>
            </button>

            {/* Secondary CTA */}
            <button 
              onClick={onEnterSmeFunnel}
              className="group relative inline-flex h-14 w-full sm:w-auto items-center justify-center overflow-hidden rounded-[18px] border border-[#d8e1f3] bg-gradient-to-b from-white to-[#f8fbff] pl-7 pr-3 text-[16px] font-semibold tracking-[-0.02em] text-[#06145b] shadow-[0_14px_32px_rgba(15,23,42,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b9c9ee] hover:shadow-[0_18px_42px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,1)] cursor-pointer"
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.12),transparent_55%)] opacity-80"></span>
              <span className="relative z-10 whitespace-nowrap">SME Growth Consultation</span>
              <span className="relative z-10 ml-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[#dfe7f7] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-300 group-hover:scale-[1.03] group-hover:border-[#c3d2f2]">
                <Zap className="h-5 w-5 text-blue-700 animate-pulse" />
              </span>
            </button>
          </div>
        </div>

        {/* Hero Interactive Console Preview */}
        <div className="relative mx-auto h-[580px] w-full max-w-[760px] mt-10 lg:mt-0">
          <div className="absolute right-[2%] top-[17%] h-[360px] w-[360px] rounded-full bg-blue-600/5 blur-3xl"></div>
          <div className="absolute left-0 top-[8%] w-[94%] overflow-hidden rounded-[18px] border border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_16px_44px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#06145b]">
                    RetailFlow OS Core Console
                  </p>
                  <p className="text-xs font-medium text-slate-400">
                    Unified Sales Operations & Ledger
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                Active Node
              </span>
            </div>
            
            <div className="grid lg:grid-cols-[180px_1fr]">
              <aside className="hidden border-r border-slate-200 bg-slate-50/60 p-4 lg:block">
                <div className="space-y-2 text-xs font-semibold text-slate-500">
                  <button className="flex w-full items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 bg-white text-blue-700 shadow-sm" aria-current="true">
                    <Target className="h-4 w-4" />
                    Operations Hub
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-slate-500 hover:text-slate-900">
                    <Users className="h-4 w-4" />
                    Storefront
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-slate-500 hover:text-slate-900">
                    <Clock className="h-4 w-4" />
                    Logistics & Sync
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-slate-500 hover:text-slate-900">
                    <Sparkles className="h-4 w-4" />
                    Aisha AI Agent
                  </button>
                </div>
              </aside>

              <div className="p-5 sm:p-7">
                <div className="grid gap-4 grid-cols-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium text-slate-400">Orders Synced</p>
                    <p className="mt-2 text-xl font-bold tracking-tight text-slate-950">1,248</p>
                    <p className="mt-1 text-[10px] font-semibold text-emerald-600">+18.4% YoY</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium text-slate-400">Ledger Health</p>
                    <p className="mt-2 text-xl font-bold tracking-tight text-slate-950">98%</p>
                    <p className="mt-1 text-[10px] font-semibold text-blue-700">Real-Time</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium text-slate-400">Active Leads</p>
                    <p className="mt-2 text-xl font-bold tracking-tight text-slate-950">High</p>
                    <p className="mt-1 text-[10px] font-semibold text-slate-500">Optimized</p>
                  </div>
                </div>

                <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#06145b]">Real-Time Storefront Transactions</p>
                    <span className="text-xs font-semibold text-blue-700">Sync active</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg bg-blue-50/70 px-3 py-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white font-bold text-xs">A</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800">Aliko Ventures Ltd</p>
                        <p className="text-[10px] font-medium text-slate-500">Aisha AI Recommendation: MacBook Pro M3</p>
                      </div>
                      <p className="text-xs font-semibold text-emerald-600">IN CART</p>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-blue-700 font-bold text-xs">J</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800">Julius Electronics</p>
                        <p className="text-[10px] font-medium text-slate-500">Google Sheets sync completed instantly</p>
                      </div>
                      <p className="text-xs font-semibold text-blue-600">CHECKOUT</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Absolute Overlays matching the Fluxa HTML */}
          <div className="absolute bottom-[4%] right-0 w-[320px] max-w-[70%] rounded-[18px] border border-blue-300/30 bg-[radial-gradient(circle_at_90%_20%,rgba(96,165,250,0.85),transparent_16%),linear-gradient(135deg,#0b2da8_0%,#071855_56%,#0c37c8_100%)] p-6 text-white shadow-[0_30px_60px_rgba(29,78,216,0.34)]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-50">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-blue-700">
                  <CheckCircle className="h-3 w-3 text-blue-700" />
                </span>
                Sheets Sync Verified
              </span>
              <VideoMeetIcon />
            </div>
            <p className="mt-5 text-3xl font-bold tracking-tight">Cloud Ledger</p>
            <p className="mt-2 text-xs leading-5 text-blue-100">
              Transactions auto-recorded into Google Sheets with background secure OAuth proxying.
            </p>
          </div>

          <div className="absolute bottom-[1%] left-[4%] w-[220px] rounded-[16px] border border-slate-200 bg-white p-4 shadow-[0_16px_44px_rgba(15,23,42,0.07)]">
            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle className="h-3 w-3 text-white" />
              </span>
              <p className="text-xs font-semibold text-[#06145b]">Real-Time Sync Ok</p>
            </div>
            <div className="mt-4 flex items-end gap-2 h-12">
              <span className="w-4 rounded-t bg-blue-100" style={{height: '35%'}}></span>
              <span className="w-4 rounded-t bg-blue-200" style={{height: '55%'}}></span>
              <span className="w-4 rounded-t bg-blue-100" style={{height: '30%'}}></span>
              <span className="w-4 rounded-t bg-blue-700" style={{height: '75%'}}></span>
              <span className="w-4 rounded-t bg-cyan-200" style={{height: '45%'}}></span>
              <span className="w-4 rounded-t bg-blue-100" style={{height: '60%'}}></span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Benefits cards */}
      <section id="features" className="border-t border-slate-200 bg-white px-6 py-20 sm:px-9 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] relative">
          
          <div className="grid gap-8 border-y sm:px-8 md:grid-cols-[1fr_0.72fr] md:items-end lg:px-16 lg:py-16 border-slate-200/80 pt-16 pr-6 pb-16 pl-6 gap-x-8 gap-y-8">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.04em] text-blue-700">
                <Sparkles className="h-4 w-4" />
                SME OS Features
              </div>
              <h2 className="max-w-[640px] text-4xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Everything you need to grow your retail business.
              </h2>
            </div>
            <p className="max-w-[430px] text-base leading-7 text-slate-500">
              RetailFlow OS provides a comprehensive suite featuring automated inventory tracking, Aisha AI shopper assistance, competitor benchmarking, and zero-config ledger sync.
            </p>
          </div>

          <div className="grid border-b border-slate-200/80 md:grid-cols-2 xl:grid-cols-4">
            
            {/* Card 1 */}
            <article className="group transition-colors duration-300 hover:bg-slate-50/60 p-10 border-slate-200/80 border-b xl:border-b-0 md:border-r flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <div className="relative h-[160px] overflow-hidden rounded-[24px] border border-slate-200/80 bg-gradient-to-br from-white via-blue-50/80 to-cyan-50/70 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.09)]">
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-300/40 blur-3xl"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.14)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
                  
                  <div className="relative z-10 flex h-full flex-col justify-between rounded-[20px] border border-white/80 bg-white/90 p-3 shadow-[0_16px_36px_rgba(15,23,42,0.07)]">
                    <div className="flex items-center justify-between">
                      <span className="h-2 w-10 rounded-full bg-slate-200"></span>
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-medium text-blue-700">Prospect Intake</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-blue-100 rounded-full"></div>
                      <div className="h-1.5 w-3/4 bg-slate-100 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#06145b]">Growth Consultation Form</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    A custom-built, multi-step page designed to analyze prospects' current situations, calculate their lost margins, and generate immediate growth insights.
                  </p>
                </div>
              </div>

              <span className="mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-700 group-hover:text-white transition duration-300">
                <ChevronRight className="h-4 w-4" />
              </span>
            </article>

            {/* Card 2 */}
            <article className="group transition-colors duration-300 hover:bg-slate-50/60 p-10 border-slate-200/80 border-b xl:border-b-0 xl:border-r flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <div className="relative h-[160px] overflow-hidden rounded-[24px] bg-[#06145b] p-4 shadow-[0_28px_70px_rgba(6,20,91,0.22)]">
                  <div className="absolute -left-14 -top-14 h-36 w-36 rounded-full bg-blue-400/35 blur-3xl"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                  
                  <div className="relative z-10 flex h-full flex-col justify-between rounded-[20px] border border-white/10 bg-white/[0.08] p-3">
                    <span className="text-[10px] text-cyan-300">SECURED GATE</span>
                    <div className="h-2 w-full bg-white/20 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#06145b]">Unified Ledger Sync</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Storefront transactions, client chats, and consultation entries sync to your designated Google Sheets instantly using your secure background credentials.
                  </p>
                </div>
              </div>

              <span className="mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-700 group-hover:text-white transition duration-300">
                <ChevronRight className="h-4 w-4" />
              </span>
            </article>

            {/* Card 3 */}
            <article className="group transition-colors duration-300 hover:bg-slate-50/60 p-10 border-slate-200/80 border-b xl:border-b-0 md:border-r flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <div className="relative h-[160px] overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-[0_26px_70px_rgba(15,23,42,0.1)]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(226,232,240,0.75)_1px,transparent_1px),linear-gradient(to_bottom,rgba(226,232,240,0.75)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                  <div className="relative z-10 flex h-full flex-col justify-between rounded-[20px] bg-slate-50 p-3">
                    <span className="text-[10px] text-blue-700 font-semibold">Conversational Shopcopilot</span>
                    <div className="h-6 w-full bg-blue-100 rounded-lg"></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#06145b]">Aisha AI Shopping Concierge</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Embedded shopping assistant that answers technical product queries, processes discount codes, and drives direct cart checkouts.
                  </p>
                </div>
              </div>

              <span className="mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-700 group-hover:text-white transition duration-300">
                <ChevronRight className="h-4 w-4" />
              </span>
            </article>

            {/* Card 4 */}
            <article className="group transition-colors duration-300 hover:bg-slate-50/60 p-10 flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <div className="relative h-[160px] overflow-hidden rounded-[24px] border border-slate-200/80 bg-gradient-to-br from-blue-50 to-cyan-50 p-3">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(226,232,240,0.65)_1px,transparent_1px),linear-gradient(to_bottom,rgba(226,232,240,0.65)_1px,transparent_1px)] bg-[size:28px_28px] opacity-60"></div>
                  <div className="relative z-10 flex h-full items-center justify-center">
                    <span className="text-xs bg-white border px-3 py-1.5 font-mono shadow-sm rounded-lg text-slate-700">Competitor Price Tracker</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#06145b]">Real-Time Competitor Feed</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Scrapes competitor prices (Slot, Pointek, Jumia) and lets merchants match or beat rates with a single click, protecting retail margins.
                  </p>
                </div>
              </div>

              <span className="mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-700 group-hover:text-white transition duration-300">
                <ChevronRight className="h-4 w-4" />
              </span>
            </article>

          </div>
        </div>
      </section>

      {/* SME Diagnostic CTA Strip */}
      <section id="solutions" className="py-20 bg-slate-50/60 border-y border-slate-200/80 px-6">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono uppercase text-blue-700 tracking-wider bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              Growth Strategy
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Assess your retail situation and prospective growth
            </h2>
            <p className="text-slate-500 leading-relaxed">
              Use our interactive consultation form to run an assessment of current retail deficits, check where your revenue is leaking, and map out your custom growth blueprint instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onEnterSmeFunnel}
                className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white hover:bg-blue-800 px-6 py-3 rounded-xl font-bold text-sm cursor-pointer shadow-lg transition-all"
              >
                <span>Open Consultation Form</span> <Zap className="w-4 h-4 text-white animate-bounce" />
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-950 text-lg">Consultation Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Leaked Margin Calculation</span>
                <span className="font-mono text-slate-900">Analyzed</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-700 h-full rounded-full" style={{width: '100%'}}></div>
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Response Speed Gaps</span>
                <span className="font-mono text-slate-900">Mapped</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{width: '95%'}}></div>
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Growth Potential</span>
                <span className="font-mono text-slate-900">High Confidence</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{width: '98%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Consultation Section replacing Pricing */}
      <section id="contact" className="border-t border-slate-200 bg-white px-6 py-20 sm:px-9 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] relative">
          
          <div className="grid border-b border-slate-200/80 lg:grid-cols-[1.35fr_1fr] pb-16">
            <div className="pt-10">
              <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                <Sparkles className="h-4 w-4" />
                Contact Us & Consultation
              </div>
              <h2 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Ready to optimize your retail workspace?
              </h2>
            </div>
            <div className="flex items-center pt-10 lg:pt-14">
              <div>
                <p className="max-w-xl text-lg leading-8 text-slate-500">
                  Connect directly with our core integration expert. Get a custom, 1-on-1 operational audit to plug revenue leakages and deploy RetailFlow OS for your brand.
                </p>
              </div>
            </div>
          </div>

          <div className="grid border-b border-slate-200/80 lg:grid-cols-3 gap-8 lg:gap-0 mt-12">
            
            {/* WhatsApp Contact Node */}
            <article className="relative flex min-h-[380px] flex-col border-b border-slate-200/80 bg-white px-8 py-12 lg:border-b-0 lg:border-r lg:px-10">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">01</span>
                <span className="border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 rounded-full">
                  Instant Reply
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-950">WhatsApp Business</h3>
                <p className="mt-2 text-sm text-slate-500">Chat directly with Ayomide for instant deployment answers and pricing questions.</p>
              </div>
              <div className="mb-8 border border-slate-100 bg-slate-50/50 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono tracking-wider font-bold">WhatsApp Direct</span>
                  <span className="text-base font-bold text-slate-950 font-mono">+234 802 232 4523</span>
                </div>
              </div>
              <a 
                href="https://wa.me/2348022324523?text=Hello%20Ayomide,%20I'm%20interested%20in%20getting%20a%20consultation%20for%20RetailFlow%20OS."
                target="_blank"
                rel="noreferrer"
                className="group mt-auto relative inline-flex h-12 w-full items-center justify-between overflow-hidden rounded-[14px] border border-green-200 bg-gradient-to-b from-white to-green-50/20 pl-5 pr-2.5 text-sm font-semibold text-green-700 shadow-sm cursor-pointer hover:border-green-300 transition-all hover:bg-green-50/40"
              >
                <span>Get Consultation</span>
                <span className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-white border border-green-100 group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            </article>

            {/* Instagram Contact Node */}
            <article className="relative flex min-h-[380px] flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(219,39,119,0.15),transparent_40%),linear-gradient(150deg,#020617_0%,#0f172a_54%,#020617_100%)] px-8 py-12 text-white lg:px-10">
              <div className="relative mb-8 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-100">02</span>
                <span className="border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-300 rounded-full">Social DM</span>
              </div>
              <div className="relative mb-6">
                <h3 className="text-2xl font-bold text-white">Instagram DM</h3>
                <p className="mt-2 text-sm text-slate-300">Follow us, view operational case studies, and send a direct message for consultation.</p>
              </div>
              <div className="relative mb-8 border border-white/10 bg-white/5 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono tracking-wider font-bold">Instagram Handle</span>
                  <span className="text-base font-bold text-white font-mono">@asksasdev</span>
                </div>
              </div>
              <a 
                href="https://instagram.com/asksasdev"
                target="_blank"
                rel="noreferrer"
                className="group mt-auto relative inline-flex h-12 w-full items-center justify-between overflow-hidden rounded-[14px] bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 pl-5 pr-2.5 text-sm font-semibold text-white cursor-pointer hover:shadow-md transition-all"
              >
                <span>Get Consultation</span>
                <span className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/10 group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            </article>

            {/* Email Contact Node */}
            <article className="relative flex min-h-[380px] flex-col border-b border-slate-200/80 bg-white px-8 py-12 lg:border-b-0 lg:px-10">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">03</span>
                <span className="border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 rounded-full">Official Mail</span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-950">Email Support</h3>
                <p className="mt-2 text-sm text-slate-500">Submit your operational ledger spreadsheets or schedule requests via formal email.</p>
              </div>
              <div className="mb-8 border border-slate-100 bg-slate-50/50 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono tracking-wider font-bold">Mailbox Address</span>
                  <span className="text-sm font-bold text-slate-950 font-mono break-all">ayomidesholarin13@gmail.com</span>
                </div>
              </div>
              <a 
                href="mailto:ayomidesholarin13@gmail.com?subject=RetailFlow%20OS%20Consultation%20Request"
                className="group mt-auto relative inline-flex h-12 w-full items-center justify-between overflow-hidden rounded-[14px] border border-blue-200 bg-gradient-to-b from-white to-blue-50/20 pl-5 pr-2.5 text-sm font-semibold text-blue-700 shadow-sm cursor-pointer hover:border-blue-300 transition-all hover:bg-blue-50/40"
              >
                <span>Get Consultation</span>
                <span className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-white border border-blue-100 group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            </article>

          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="bg-slate-50/40 border-t border-slate-200 py-20 px-6">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-12">
          <aside className="space-y-6">
            <span className="text-xs font-mono uppercase text-blue-700 tracking-wider">FAQ</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Frequently asked questions.</h2>
            <p className="text-slate-500 leading-relaxed text-sm">
              Learn how RetailFlow OS secures your sales ledger, powers real-time competitor tracking, and automates checkouts safely in Firestore.
            </p>
          </aside>
          
          <div className="divide-y divide-slate-200 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <details className="group py-4" open>
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-slate-950">
                <span>How does the Google Sheets sales ledger sync help my retail operations?</span>
                <span className="text-blue-700 group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Whenever a client places an order on your Customer Storefront, the system automatically registers the transaction, customer contact details, and inventory changes inside your secure Firestore database. This data can be instantly synchronized directly into your Google Sheets spreadsheets, providing an error-free, real-time sales ledger.
              </p>
            </details>

            <details className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-slate-950">
                <span>Who is Aisha AI Shopping Concierge and how does she help me sell?</span>
                <span className="text-blue-700 group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Aisha AI is our server-side shopping assistant integrated directly into your storefront. She understands technical details across your catalog, can run real-time checks on stock availability, suggest ideal color/storage combinations, and handle client inquiries instantly, turning cold traffic into warm, high-converting orders.
              </p>
            </details>

            <details className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-slate-950">
                <span>How does the Competitor Price Scraper / Market Watch work?</span>
                <span className="text-blue-700 group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                The integrated Market Watch console monitors the current market rates and pricing benchmarks of top competitors. It calculates high, low, and average prices in real-time, helping you make high-margin pricing decisions and dynamically launch flash sales on high-demand gadgets.
              </p>
            </details>

            <details className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-slate-950">
                <span>How do I get a custom operational audit and start the consultation?</span>
                <span className="text-blue-700 group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Simply click on any of our "Get Consultation" buttons to reach out directly to Ayomide. You can connect with us instantly via WhatsApp (+234 802 232 4523), schedule a deep dive over email (ayomidesholarin13@gmail.com), or slide into our Instagram DMs (@asksasdev). We'll set up your database, configure your initial products, and guide you through optimization.
              </p>
            </details>

            <details className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-slate-950">
                <span>Can I track customer details and repeat orders easily?</span>
                <span className="text-blue-700 group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Absolutely. RetailFlow OS is designed as a complete CRM system. It maps and groups purchase histories, customer lifecycles, and top buyers automatically in your Admin Dashboard, so you can reward your loyal buyers with exclusive discounts.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Huge Brand Mark Footer Area */}
      <footer className="border-t border-slate-200/80 bg-white">
        <div className="grid border-b border-slate-200/80 lg:grid-cols-2 max-w-[1600px] mx-auto">
          <div className="px-8 py-8 lg:py-12 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex items-center">
            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black leading-tight tracking-tighter text-slate-950 select-none">
              RETAILFLOW
            </h2>
          </div>
          <div className="flex items-center px-8 py-8 lg:py-12">
            <p className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tighter text-blue-700 select-none">
              OPERATIONS REIMAGINED
            </p>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto py-6 px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RetailFlow OS. Built in Lagos. SOC 2 Compliant.</p>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-blue-700">Privacy Policy</a>
            <a href="#features" className="hover:text-blue-700">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Node Selector Overlay Dialog */}
      {isSelectorOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative animate-scale-up text-slate-950">
            
            <button 
              onClick={() => setIsSelectorOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 space-y-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RetailFlow OS Gateway Selector</span>
                </div>
                <h3 className="font-bold text-2xl text-slate-900">Select Your Workspace Perspective</h3>
                <p className="text-slate-500 text-xs">Choose which operational role you want to experience in this RetailFlow OS deployment.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Node A: Admin Portal */}
                <div 
                  onClick={() => {
                    setIsSelectorOpen(false);
                    onEnterAdmin();
                  }}
                  className="p-6 bg-slate-50/50 border border-slate-200 hover:border-blue-700 hover:bg-white rounded-xl text-left transition-all cursor-pointer group flex flex-col justify-between hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-all">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-sm">Admin Dashboard</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 font-light">
                        Monitor live transactions, Aisha AI shopping query logs, real-time competitor feeds, and direct ledger Google Sheets synchronization.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-blue-700 font-bold font-mono">
                    <span>Enter Workspace</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Node B: Storefront Client Demo */}
                <div 
                  onClick={() => {
                    setIsSelectorOpen(false);
                    onEnterCustomer();
                  }}
                  className="p-6 bg-slate-50/50 border border-slate-200 hover:border-blue-700 hover:bg-white rounded-xl text-left transition-all cursor-pointer group flex flex-col justify-between hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-cyan-50 border border-cyan-100 rounded-lg flex items-center justify-center text-cyan-700 group-hover:bg-blue-700 group-hover:text-white transition-all">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-sm">Customer Storefront</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 font-light">
                        Interact with our retail device catalog, send real-time chat inquiries to Aisha AI, place test orders, and track delivery.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-blue-700 font-bold font-mono">
                    <span>Open Storefront</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Node C: Diagnostic Funnel */}
                <div 
                  onClick={() => {
                    setIsSelectorOpen(false);
                    onEnterSmeFunnel();
                  }}
                  className="p-6 bg-slate-50/50 border border-slate-200 hover:border-blue-700 hover:bg-white rounded-xl text-left transition-all cursor-pointer group flex flex-col justify-between hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-all">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-sm">Consultation Form</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 font-light">
                        Experience the client assessment page to map lost margins, analyze situation benchmarks, and request strategy sessions.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-blue-700 font-bold font-mono">
                    <span>Open Form</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
              
              <p className="text-[10px] font-mono text-slate-400 text-center uppercase tracking-wider">
                RetailFlow OS Gateway Node • Live state synchronization enabled
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

function VideoMeetIcon() {
  return (
    <svg className="h-8 w-8 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4zM14 16H5V8h9v8z" />
    </svg>
  );
}
