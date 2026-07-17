import React, { useState } from 'react';
import { Integration } from '../types';
import { 
  X, 
  Settings, 
  Sparkles, 
  Check, 
  MessageSquare, 
  Instagram, 
  Calendar, 
  TrendingUp, 
  FolderPlus, 
  Radio, 
  FileCheck,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Database
} from 'lucide-react';

interface IntegrationsViewProps {
  integrations: Integration[];
  onToggleIntegration: (id: string) => void;
  onConnectIntegration: (id: string) => void;
  
  // Real Google Sheets props
  googleUser: any;
  googleToken: string | null;
  onGoogleSignIn: () => Promise<void>;
  onGoogleSignOut: () => Promise<void>;
  googleSpreadsheetId: string;
  onSetGoogleSpreadsheetId: (id: string) => void;
  onCreateNewSheet: () => Promise<void>;
  onTestSheetsSync: () => Promise<void>;
}

export default function IntegrationsView({
  integrations,
  onToggleIntegration,
  onConnectIntegration,
  googleUser,
  googleToken,
  onGoogleSignIn,
  onGoogleSignOut,
  googleSpreadsheetId,
  onSetGoogleSpreadsheetId,
  onCreateNewSheet,
  onTestSheetsSync
}: IntegrationsViewProps) {
  
  const [selectedInt, setSelectedInt] = useState<Integration | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSheetsConfig, setShowSheetsConfig] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isTestingSheet, setIsTestingSheet] = useState(false);

  // Handle clicking Connect button on integration card
  const handleConnectClick = (int: Integration) => {
    if (int.id === 'int-sheets' || int.id === 'int-4') {
      if (googleToken) {
        if (int.id === 'int-sheets') {
          setShowSheetsConfig(true);
        } else {
          alert('Google Calendar is already connected and active for lead scheduling.');
        }
      } else {
        // Run Google OAuth flow
        setIsConnecting(true);
        onGoogleSignIn()
          .then(() => {
            onConnectIntegration('int-sheets');
            onConnectIntegration('int-4');
            if (int.id === 'int-sheets') {
              setShowSheetsConfig(true);
            } else {
              alert('Successfully connected Google Workspace Calendar & Meet! Customers can now book meetings on your calendar.');
            }
          })
          .catch(err => {
            console.error('Google sign-in error:', err);
          })
          .finally(() => {
            setIsConnecting(false);
          });
      }
    } else {
      if (int.isConnected) {
        onToggleIntegration(int.id);
      } else {
        setSelectedInt(int);
      }
    }
  };

  // Perform mock OAuth simulator authorization
  const authorizeConnection = () => {
    if (!selectedInt) return;
    setIsConnecting(true);

    setTimeout(() => {
      onConnectIntegration(selectedInt.id);
      setIsConnecting(false);
      setSelectedInt(null);
      alert(`Integration Successful! ${selectedInt.name} is now connected and synced with your local Lagos retail node.`);
    }, 1200);
  };

  // Trigger Google Sheet creation
  const handleCreateNewSheet = async () => {
    setIsCreatingSheet(true);
    try {
      await onCreateNewSheet();
      alert('Success! Created a brand new "RetailFlow OS - SME Diagnostic Leads" Google Sheet and configured it as your sync ledger.');
    } catch (error: any) {
      alert(`Failed to create spreadsheet: ${error.message || error}`);
    } finally {
      setIsCreatingSheet(false);
    }
  };

  // Trigger Sheet Sync Test
  const handleTestSync = async () => {
    setIsTestingSheet(true);
    try {
      await onTestSheetsSync();
      alert('Mock Sync Successful! Written test row to your Google Sheet. Open the sheet to verify your columns.');
    } catch (error: any) {
      alert(`Sync test failed: ${error.message || error}`);
    } finally {
      setIsTestingSheet(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Settings Head */}
      <div className="glass-panel glass-highlight rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 text-[#3B82F6] mb-2 font-semibold">
          <Settings className="w-4 h-4 animate-spin-slow" />
          <span className="font-mono text-xs uppercase tracking-wider">Integrations Hub</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Connect Your Existing Channels & Ledgers</h2>
        <p className="text-xs text-on-surface-variant max-w-2xl">
          RetailFlow OS sits on top of your existing social storefronts and financial software. Link your feeds below. The AI layers will automatically begin indexing items, drafts, and price queries.
        </p>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(int => {
          // Both Google Sheets and Google Calendar use the real googleToken to determine connection
          const isConnected = (int.id === 'int-sheets' || int.id === 'int-4') ? !!googleToken : int.isConnected;

          return (
            <div 
              key={int.id}
              className={`glass-panel glass-highlight rounded-xl p-6 flex flex-col justify-between space-y-4 transition-all relative ${
                isConnected ? 'border-green-500/30' : 'hover:border-zinc-500/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* Icon switcher */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    int.iconType === 'whatsapp' ? 'bg-[#25D366]/10 text-[#25D366]' :
                    int.iconType === 'instagram' ? 'bg-pink-500/10 text-pink-400' :
                    int.iconType === 'pos' ? 'bg-cyan-500/10 text-cyan-400' :
                    int.iconType === 'gcal' ? 'bg-blue-500/10 text-blue-400' :
                    int.iconType === 'sage' ? 'bg-green-500/10 text-green-400' :
                    int.iconType === 'sheets' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {int.iconType === 'whatsapp' && <MessageSquare className="w-5 h-5" />}
                    {int.iconType === 'instagram' && <Instagram className="w-5 h-5" />}
                    {int.iconType === 'pos' && <Radio className="w-5 h-5 animate-pulse" />}
                    {int.iconType === 'gcal' && <Calendar className="w-5 h-5" />}
                    {int.iconType === 'sage' && <FileCheck className="w-5 h-5" />}
                    {int.iconType === 'quickbooks' && <FolderPlus className="w-5 h-5" />}
                    {int.iconType === 'sheets' && <FileSpreadsheet className="w-5 h-5" />}
                  </div>

                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                    isConnected 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                  }`}>
                    {isConnected ? 'Active & Synced' : 'Disconnected'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{int.name}</h3>
                  <span className="text-[10px] text-on-surface-variant font-mono mt-0.5 block">{int.tag}</span>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                    {int.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#27272A]/30 flex items-center justify-between">
                <span className="text-[10px] text-on-surface-variant font-mono">
                  {(int.id === 'int-sheets' || int.id === 'int-4') ? (googleToken ? 'Authenticated API' : 'Google OAuth 2.0') : (isConnected ? 'OAuth Node Ver.' : 'Requires API Consent')}
                </span>

                <div className="flex gap-2">
                  {int.id === 'int-sheets' && isConnected && (
                    <button 
                      onClick={() => setShowSheetsConfig(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border border-[#27272A] text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                    >
                      Configure
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (int.id === 'int-sheets' || int.id === 'int-4') {
                        if (isConnected) {
                          onGoogleSignOut().then(() => {
                            alert('Successfully disconnected Google Workspace integrations.');
                          });
                        } else {
                          handleConnectClick(int);
                        }
                      } else {
                        handleConnectClick(int);
                      }
                    }}
                    disabled={isConnecting}
                    className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      isConnected 
                        ? 'border border-red-500/20 text-red-400 hover:bg-red-500/10' 
                        : 'bg-[#3B82F6] hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isConnecting ? 'Signing In...' : (isConnected ? 'Disconnect' : 'Connect')}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Real Google Sheets Configuration Modal */}
      {showSheetsConfig && googleToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A0A0B]/80 backdrop-blur-md" onClick={() => setShowSheetsConfig(false)} />
          
          <div className="relative w-full max-w-lg bg-[#161618] rounded-2xl border border-[#27272A] p-6 shadow-2xl glass-highlight space-y-6">
            <button 
              onClick={() => setShowSheetsConfig(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Google Sheets Integration</h3>
                <p className="text-xs text-emerald-400 font-mono">Connection Status: Active & Secured</p>
              </div>
            </div>

            {googleUser && (
              <div className="p-3 bg-[#0A0A0B] border border-[#27272A] rounded-xl flex items-center gap-3">
                {googleUser.photoURL ? (
                  <img src={googleUser.photoURL} alt={googleUser.displayName} className="w-8 h-8 rounded-full border border-emerald-500/30" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    {googleUser.email ? googleUser.email[0].toUpperCase() : 'G'}
                  </div>
                )}
                <div>
                  <span className="text-xs font-bold text-white block">{googleUser.displayName || 'Google Account Owner'}</span>
                  <span className="text-[10px] text-zinc-400 block font-mono">{googleUser.email}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">Target Spreadsheet ID</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={googleSpreadsheetId}
                    onChange={(e) => onSetGoogleSpreadsheetId(e.target.value)}
                    placeholder="Enter your Google Spreadsheet ID"
                    className="flex-1 bg-[#0A0A0B] border border-[#27272A] focus:outline-none focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 font-mono"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 block leading-tight">
                  You can find this ID in your Google Sheet URL: <code>https://docs.google.com/spreadsheets/d/<b>SPREADSHEET_ID</b>/edit</code>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleCreateNewSheet}
                  disabled={isCreatingSheet}
                  className="flex-1 px-4 py-2.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isCreatingSheet ? 'Creating Drive Sheet...' : 'Create Fresh Sheet for Me'}</span>
                </button>

                <button
                  onClick={handleTestSync}
                  disabled={isTestingSheet || !googleSpreadsheetId}
                  className="flex-1 px-4 py-2.5 bg-[#1C1C20] hover:bg-[#27272E] text-zinc-200 border border-[#27272A] disabled:opacity-50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isTestingSheet ? 'animate-spin' : ''}`} />
                  <span>{isTestingSheet ? 'Syncing...' : 'Test Sync / Write Row'}</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#27272A]/40 flex items-center justify-between">
              <button
                onClick={() => {
                  onGoogleSignOut();
                  setShowSheetsConfig(false);
                }}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Disconnect Account
              </button>
              <button
                onClick={() => setShowSheetsConfig(false)}
                className="px-5 py-2 bg-[#1C1C20] hover:bg-[#27272A] border border-[#27272A] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mock OAuth Simulator Modal (for other services) */}
      {selectedInt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A0A0B]/80 backdrop-blur-md" onClick={() => setSelectedInt(null)} />
          
          <div className="relative w-full max-w-md bg-[#161618] rounded-xl border border-[#27272A] p-6 shadow-2xl glass-highlight">
            <button 
              onClick={() => setSelectedInt(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">OAuth Secure Handshake</h3>
                <p className="text-[10px] text-on-surface-variant font-mono">auth.retailflow.com/lagos</p>
              </div>
            </div>

            <div className="bg-[#0A0A0B] p-4 rounded-lg border border-[#27272A]/60 space-y-3 mb-6">
              <p className="text-xs text-white">
                <strong>RetailFlow OS (TechHub Lagos Node)</strong> is requesting authorization to connect with your official <strong>{selectedInt.name}</strong> API:
              </p>
              <div className="space-y-1.5 text-[11px] text-on-surface-variant font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-green-400">✔</span> <span>Read stock lists and pricing tags</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-400">✔</span> <span>Push finalized order data and buyer receipts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-400">✔</span> <span>Draft and trigger automated responder hooks</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedInt(null)}
                className="flex-1 border border-[#27272A] hover:bg-[#161618] text-white py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              
              <button 
                onClick={authorizeConnection}
                disabled={isConnecting}
                className="flex-1 bg-[#3B82F6] hover:bg-blue-600 disabled:bg-zinc-700 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                {isConnecting ? 'Syncing Catalog...' : 'Authorize Connection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
