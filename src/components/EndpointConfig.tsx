import React from 'react';
import { Link, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GAS_URL } from '../lib/api';

export function EndpointConfig() {
  const { role, showToast, refreshData, isLoading } = useStore();

  if (role !== 'admin') {
    return null; // Hanya tampilkan konfigurasi ini untuk admin
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(GAS_URL).then(() => {
      showToast("Tautan disalin ke papan klip!");
    }).catch(() => {
      showToast("Gagal menyalin tautan", "error");
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center bg-slate-50/50 gap-4">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <Link className="w-5 h-5 text-blue-500" />
          Configuration Endpoint
        </h3>
        <button 
          onClick={refreshData}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Connection
        </button>
      </div>
      <div className="p-4 md:p-8">
        <div className="p-4 md:p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Active Script Macro URL</label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-mono text-blue-600 overflow-x-auto whitespace-nowrap md:truncate">
              {GAS_URL}
            </div>
            <button 
              onClick={handleCopy}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:border-slate-300 shadow-sm transition-all whitespace-nowrap"
            >
              Copy Link
            </button>
          </div>
          <div className="mt-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
            <span className="text-slate-400">Status: <strong className="text-emerald-600">Operational</strong></span>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="text-slate-400">Sistem terhubung menggunakan Google Apps Script API.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
