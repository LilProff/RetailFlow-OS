import { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Zap, 
  Layers, 
  ShieldCheck, 
  MessageSquare, 
  Target, 
  BarChart3, 
  Globe, 
  Maximize2,
  Users,
  ShoppingCart,
  X
} from 'lucide-react';

interface LandingPageProps {
  onEnterAdmin: () => void;
  onEnterCustomer: () => void;
  onEnterSmeFunnel: () => void;
}

export default function LandingPage({ onEnterAdmin, onEnterCustomer, onEnterSmeFunnel }: LandingPageProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  return (
    <div className="bg-[#0A0A0B] text-[#e5e2e3] min-h-screen relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container font-sans">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-panel glass-highlight px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#3B82F6] flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">RetailFlow OS</span>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-on-surface-variant">
            <a href="#features" className="hover:text-white transition-colors">Core Benefits</a>
            <a href="#ai-layers" className="hover:text-white transition-colors">AI Agents</a>
            <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <button 
              onClick={onEnterSmeFunnel}
              className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer text-sm font-semibold border-l border-[#27272A]/80 pl-6"
            >
              SME Growth Hub
            </button>
          </nav>
          
          <button 
            onClick={() => setIsSelectorOpen(true)}
            className="bg-[#3B82F6] text-white hover:bg-blue-600 px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all glow-primary-hover active:scale-95 cursor-pointer"
          >
            Launch Demo OS <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#161618] border border-[#27272A] rounded-full text-xs font-mono uppercase tracking-wider text-cyan-400">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          Lagos Retail Tech Summit Featured OS
        </div>
        
        <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold text-white tracking-tight leading-none max-w-4xl">
          The AI Operating System <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-cyan-400">
            for Modern Retailers
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-light leading-relaxed">
          Unify your WhatsApp, Instagram Shop, retail POS, and ledger accounts. Power your workspace with 5 self-improving AI agents tailored for high-ticket electronics operators in Nigeria.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-xl mx-auto">
          <button 
            onClick={() => setIsSelectorOpen(true)}
            className="w-full sm:w-auto bg-[#3B82F6] text-white hover:bg-blue-600 px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            Launch Interactive OS <Maximize2 className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onEnterSmeFunnel}
            className="w-full sm:w-auto border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.1)]"
          >
            SME Growth Health Check <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
          </button>
        </div>

        {/* Demo Sneak Peek */}
        <div className="w-full mt-12 rounded-2xl overflow-hidden border border-[#27272A] shadow-2xl relative bg-[#131314]/80 p-2 group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => setIsSelectorOpen(true)}
              className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg scale-95 group-hover:scale-100 transition-all cursor-pointer"
            >
              Explore Operations Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpSo-qg0LALUphRXdRe-bsRaIds-8jQj-MtVAuAPXIh2vKmm2KTOZc0kcUFMokT3itbLfn_H83Zm1DCAQeGC7sBhq2ulSwQpE4WASIP9cTfyH5JdtxXt-YdCpKNg4TAEOFtlf126jAss1dSqAEp-2ma23R5V8jFC7NdXih_aCKvg17lBr8q61sx33ZWe_-G_ZJ7GYhINBcaiSCDY8awcEq6WHjFdhugGI_uh7m8civA-YjBj-gl4aLmzyfwDmJ-gLjsKUffpFaM9Yo" 
            alt="RetailFlow Dashboard Preview" 
            className="w-full h-[320px] md:h-[420px] object-cover rounded-xl filter brightness-[0.7] group-hover:brightness-[0.4] transition-all"
          />
        </div>
      </section>

      {/* Real-world Storytelling: The Lagos Retail Dilemma */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-[#1C1C1E]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase text-blue-400 tracking-widest font-bold px-3 py-1 bg-blue-500/5 border border-blue-500/10 rounded-full inline-block">
              A True Story of Chat Commerce
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              The Invisible Toll of Manual Operations
            </h2>
            <div className="space-y-4 text-zinc-400 font-light leading-relaxed text-sm md:text-base">
              <p>
                Meet <span className="font-bold text-white">Chidi</span>, who runs a premium gadget outlet in Lekki. He gets over 150 inquiries daily across Instagram and WhatsApp.
              </p>
              <p>
                During the midday rush, Chidi and his sales reps are overwhelmed. It takes <span className="font-bold text-rose-400">20 minutes to respond</span> to a DM about a MacBook's specs. By then, the buyer has already messaged a competitor in Computer Village and locked in a deal.
              </p>
              <p>
                At checkout, customers wait at the counter while Chidi checks his bank app for transfer verification. Sometimes riders wait outside for 30 minutes just to confirm a ₦500,000 transfer.
              </p>
              <p className="border-l-2 border-cyan-500 pl-4 text-cyan-400 italic">
                "We were working 14 hours a day, yet we were losing up to 30% of our sales due to response delays and inventory mismatch confusion."
              </p>
            </div>
            <div className="pt-4">
              <button 
                onClick={onEnterSmeFunnel}
                className="inline-flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl transition-all cursor-pointer shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
              >
                <span>Calculate Your Business Leakage Now</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Story Visual Timeline */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  step: "01",
                  title: "The Midday Flood",
                  desc: "Chidi receives 40 new DMs on Instagram asking: 'Is this iPhone 15 Pro Max available?'",
                  status: "Chaos in the Inbox",
                  color: "border-red-500/20 text-red-400 bg-red-500/5"
                },
                {
                  step: "02",
                  title: "The 20-Min Lag",
                  desc: "Rep is manually copy-pasting spec sheets from a messy WhatsApp catalog. Buyer moves on.",
                  status: "Lost Conversion",
                  color: "border-orange-500/20 text-orange-400 bg-orange-500/5"
                },
                {
                  step: "03",
                  title: "Bank App Hold",
                  desc: "Customer makes transfer. Staff waits for Chidi (who is driving) to check his corporate token.",
                  status: "Delivery Bottleneck",
                  color: "border-amber-500/20 text-amber-400 bg-amber-500/5"
                },
                {
                  step: "04",
                  title: "Double-Sold Error",
                  desc: "Shop sold the last iPad in-store 10 minutes ago, but the rep just confirmed it online. Friction.",
                  status: "Inventory Mismatch",
                  color: "border-rose-500/20 text-rose-400 bg-rose-500/5"
                }
              ].map(item => (
                <div key={item.step} className="p-5 bg-[#131316] border border-[#27272A] rounded-2xl space-y-3 relative group hover:border-[#27272A]/80 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-zinc-600 group-hover:text-zinc-500 transition-colors">{item.step}</span>
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-white text-sm">{item.title}</h4>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            
            {/* The Solution Callout Banner */}
            <div className="p-6 bg-gradient-to-r from-[#172554]/40 to-[#0c4a6e]/40 border border-[#1e40af]/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">The Solution</span>
                <h4 className="font-bold text-white text-sm">Enter RetailFlow OS Workspace</h4>
                <p className="text-zinc-400 text-[11px] font-light">Auto-replies in 3 seconds. Instant webhook payments. Unified stock sync.</p>
              </div>
              <button 
                onClick={() => setIsSelectorOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs cursor-pointer transition-all shrink-0 shadow-lg"
              >
                Enter Demo Node →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits Breakdown */}
      <section id="features" className="py-20 bg-[#131314]/50 border-y border-[#161618] px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <div className="text-center">
            <span className="text-xs font-mono uppercase text-[#3B82F6] tracking-widest">Business-Critical Impact</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-2">Engineered to drive direct profitability</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Benefit: Increase Revenue */}
            <div className="p-8 rounded-2xl bg-[#161618]/60 border border-[#27272A] flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Increase Revenue</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Automated Instagram DM sales handlers capture high-intent inquiries from Lekki and VI in under 3 minutes, raising cart conversion velocity by up to 24%.
              </p>
            </div>

            {/* Benefit: Reduce Cost */}
            <div className="p-8 rounded-2xl bg-[#161618]/60 border border-[#27272A] flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Reduce Overheads</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Streamline operations with machine-level automated support. Eliminate multiple shift manager salaries while ensuring round-the-clock catalog listings.
              </p>
            </div>

            {/* Benefit: Save Time */}
            <div className="p-8 rounded-2xl bg-[#161618]/60 border border-[#27272A] flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Save Operational Hours</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                End manual copy-pasting of order manifests. Auto-sync finalized chats into instant shipping orders and Ledger entries with a single tap.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* AI Layers Section */}
      <section id="ai-layers" className="py-24 px-6 max-w-6xl mx-auto flex flex-col gap-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase text-cyan-400 tracking-widest">Built-In Smart Systems</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mt-2">The 5 Core AI Agents</h2>
          <p className="text-on-surface-variant mt-3 text-sm md:text-base">
            No training needed. These five specialized cognitive loops continuously sync to monitor stock, benchmark competitors, and close deals in native Nigerian business terms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Agent 1 */}
          <div className="p-6 rounded-xl bg-[#161618] border border-[#27272A] flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Auto-Reply</h3>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Drafts instantly accurate, polite WhatsApp and Instagram specs, availability, and delivery options based on live inventory logs.
              </p>
            </div>
          </div>

          {/* Agent 2 */}
          <div className="p-6 rounded-xl bg-[#161618] border border-[#27272A] flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Sales Closer</h3>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Triggers special temporal bulk pricing or specific promo codes for customers who linger on high-ticket listings like M3 MacBooks.
              </p>
            </div>
          </div>

          {/* Agent 3 */}
          <div className="p-6 rounded-xl bg-[#161618] border border-[#27272A] flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Lead Qualifier</h3>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Scores incoming buyers into HOT/WARM/COLD tiers by matching their questions to purchasing patterns, prioritizing live agents.
              </p>
            </div>
          </div>

          {/* Agent 4 */}
          <div className="p-6 rounded-xl bg-[#161618] border border-[#27272A] flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded bg-amber-500/10 flex items-center justify-center text-amber-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Data Analyst</h3>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Evaluates product velocities daily to suggest optimal restock metrics, local warehouse transfers, and dynamic price margins.
              </p>
            </div>
          </div>

          {/* Agent 5 */}
          <div className="p-6 rounded-xl bg-[#161618] border border-[#27272A] flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Market Watch</h3>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Scrapes regional Lagos tech outlets (Slot, Pointek, Jumia) to alert you about price drops and suggest dynamic, defensive adjustments.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Connect Tools Badges */}
      <section id="integrations" className="py-20 bg-[#131314]/40 border-y border-[#161618] px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <div>
            <span className="text-xs font-mono uppercase text-[#3B82F6] tracking-widest">Zero-Disruption Integration</span>
            <h2 className="text-3xl font-bold text-white mt-2">Connects with your existing tools</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto mt-2 text-sm">
              Keep using your preferred front-ends. RetailFlow OS hooks straight into your channels, POS terminals, and accounting sheets silently.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <span className="px-4 py-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-full font-mono text-xs font-semibold">
              WhatsApp Business
            </span>
            <span className="px-4 py-2 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-full font-mono text-xs font-semibold">
              Instagram Shop
            </span>
            <span className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-mono text-xs font-semibold">
              Google Calendar
            </span>
            <span className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full font-mono text-xs font-semibold">
              Retail POS Terminal
            </span>
            <span className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-mono text-xs font-semibold">
              Sage Ledger
            </span>
            <span className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-mono text-xs font-semibold">
              QuickBooks
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="py-24 px-6 max-w-4xl mx-auto text-center flex flex-col gap-8">
        <div>
          <span className="text-xs font-mono uppercase text-cyan-400 tracking-widest">Straightforward Retention</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-2">Professional SaaS Architecture</h2>
          <p className="text-on-surface-variant text-sm mt-3 max-w-xl mx-auto">
            Our pricing is structured to ensure enterprise-level support, SLA uptime, and secure API keys maintenance.
          </p>
        </div>

        <div className="max-w-md mx-auto w-full p-8 rounded-2xl bg-[#161618] border border-[#27272A] flex flex-col gap-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-xl" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider text-center border-b border-[#27272A] pb-4">
            Enterprise OS Plan
          </h3>
          <div className="flex flex-col gap-4 text-sm text-on-surface-variant border-b border-[#27272A] pb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span>Full deployment of all 5 AI Agents</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span>Unlimited WhatsApp & Instagram integrations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span>Dedicated Lagos support & SLA deployment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span>Real-time Slot/Pointek price scraping algorithms</span>
            </div>
          </div>
          <div className="text-center pt-2">
            <span className="text-2xl font-extrabold text-white">One-Time Setup Fee + Monthly Retainer</span>
            <p className="text-xs text-on-surface-variant mt-2">Zero-commitment cancellation. Billed in Naira.</p>
          </div>
          <button 
            onClick={() => setIsSelectorOpen(true)}
            className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold transition-all text-center cursor-pointer"
          >
            Launch Interactive OS Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#161618] py-12 px-6 text-center text-sm text-on-surface-variant">
        <p>© {new Date().getFullYear()} RetailFlow OS. Built for high-performance Nigerian retail entrepreneurs.</p>
        <button 
          onClick={() => setIsSelectorOpen(true)}
          className="text-[#3B82F6] hover:underline mt-4 cursor-pointer font-semibold block mx-auto"
        >
          Book a Demo & Enter Workspace →
        </button>
      </footer>

      {/* Portals Selection Overlay Dialog Modal */}
      {isSelectorOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#131316] border border-[#27272A] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative animate-scale-up">
            
            <button 
              onClick={() => setIsSelectorOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 hover:bg-zinc-800 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-mono text-blue-400">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Interactive Sales Node Selector</span>
                </div>
                <h3 className="font-extrabold text-2xl text-white">Select Your Portal Node</h3>
                <p className="text-zinc-400 text-xs">Choose which user experience role you want to launch for this RetailFlow Sales Demo.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Node A: Admin Portal */}
                <div 
                  onClick={() => {
                    setIsSelectorOpen(false);
                    onEnterAdmin();
                  }}
                  className="p-5 bg-[#18181B] border border-[#27272A] hover:border-[#3B82F6]/60 hover:bg-[#1D1D22] rounded-xl text-left transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-[#3B82F6] group-hover:bg-[#3B82F6]/20 transition-all">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors text-sm">Admin Workspace</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                        Monitor live pipelines, inbox chats, AI Qualifiers, competitor pricing feeds, and manage full CRM metrics.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-blue-400 font-bold font-mono">
                    <span>Enter Control Room</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Node B: Customer Storefront Portal */}
                <div 
                  onClick={() => {
                    setIsSelectorOpen(false);
                    onEnterCustomer();
                  }}
                  className="p-5 bg-[#18181B] border border-[#27272A] hover:border-cyan-500/60 hover:bg-[#1D1D22] rounded-xl text-left transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors text-sm">Storefront Node</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                        Browse premium gadgets, chat with Aisha AI Concierge, place test orders, and track live delivery.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-cyan-400 font-bold font-mono">
                    <span>Explore Online Shop</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Node C: SME Growth & Diagnostic Portal */}
                <div 
                  onClick={() => {
                    setIsSelectorOpen(false);
                    onEnterSmeFunnel();
                  }}
                  className="p-5 bg-[#18181B] border border-green-600/30 hover:border-green-500/60 hover:bg-[#1D1D22] rounded-xl text-left transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center text-green-400 group-hover:bg-green-500/20 transition-all">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white group-hover:text-green-400 transition-colors text-sm">SME Growth Hub</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                        Complete our 60-second Growth Diagnostic quiz, calculate operational leakage, and book an immediate optimization consultation.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-green-400 font-bold font-mono">
                    <span>Diagnostic Health Check</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
              
              <p className="text-[10px] font-mono text-zinc-600 text-center uppercase tracking-wider">
                Lagos tech deployment node • reactive state synchronized across all portals
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
