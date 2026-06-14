import React from 'react';
import { BookMarked, Settings, LogOut, User, ShieldCheck, EyeOff, Layers, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getIcon, cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  onOpenAdminSettings: () => void;
}

export function Sidebar({ onOpenAdminSettings }: SidebarProps) {
  const { 
    role, setRole, setAdminPassword, 
    categories, books, activeCategory, setActiveCategory,
    isSidebarOpen, setIsSidebarOpen 
  } = useStore();

  const handleLogout = () => {
    setRole(null);
    setAdminPassword('');
  };

  const calculateBookCount = (catName: string) => {
    if (catName === 'Semua') {
      if (role !== 'admin') {
        const visibleCats = categories.filter(c => c.isVisible).map(c => c.name);
        return books.filter(b => visibleCats.includes(b.category)).length;
      }
      return books.length;
    }
    return books.filter(b => b.category === catName).length;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "bg-[#0F172A] text-slate-300 w-64 border-r border-slate-800 flex-shrink-0 absolute md:relative z-40 h-full flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-8 flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-white font-bold text-xl tracking-tight uppercase">E-Book</span>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden ml-auto text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-4 flex-1 overflow-y-auto space-y-6">
          <div className="px-3 py-3 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center text-sm",
                role === 'admin' ? "bg-rose-500/15 text-rose-400" : "bg-slate-700 text-slate-400"
              )}>
                {role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </span>
              <div>
                <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Mode Akses</p>
                <p className={cn(
                  "text-xs font-bold",
                  role === 'admin' ? "text-rose-400" : "text-white"
                )}>
                  {role === 'admin' ? 'Administrator' : 'DEPO YK'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">Kategori E-Book</p>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveCategory('Semua')}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-md flex items-center justify-between transition-colors",
                    activeCategory === 'Semua' 
                      ? "text-white bg-blue-600/20 border-l-4 border-blue-500 rounded-l-none" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Layers className={cn(
                      "w-5 h-5",
                      activeCategory === 'Semua' ? "text-blue-400" : ""
                    )} />
                    <span className="font-medium">Semua Buku</span>
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    activeCategory === 'Semua' ? "bg-blue-500/20 text-blue-300" : "bg-slate-800 text-slate-500"
                  )}>
                    {calculateBookCount('Semua')}
                  </span>
                </button>
              </li>

              {categories.map(kat => {
                if (!kat.isVisible && role !== 'admin') return null;
                
                const isAktif = activeCategory === kat.name;
                const Icon = getIcon(kat.icon);
                
                return (
                  <li key={kat.id} className={cn(!kat.isVisible && "opacity-50 border border-dashed border-slate-600 rounded-md")}>
                    <button 
                      onClick={() => setActiveCategory(kat.name)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-md flex items-center justify-between transition-colors",
                        isAktif 
                          ? "text-white bg-blue-600/20 border-l-4 border-blue-500 rounded-l-none" 
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      )}
                    >
                      <span className="flex items-center gap-3 truncate">
                        <Icon className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isAktif ? "text-blue-400" : ""
                        )} />
                        <span className="truncate flex items-center gap-1.5 font-medium">
                          {kat.name}
                          {!kat.isVisible && <EyeOff className="w-3 h-3 text-slate-400" title="Disembunyikan dari User" />}
                        </span>
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full flex-shrink-0",
                        isAktif ? "bg-blue-500/20 text-blue-300" : "bg-slate-800 text-slate-500"
                      )}>
                        {calculateBookCount(kat.name)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          {role === 'admin' && (
            <button 
              onClick={onOpenAdminSettings}
              className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 font-semibold text-sm mb-2 border border-indigo-500/20"
            >
              <Settings className="w-5 h-5" />
              <span>Pengaturan Admin</span>
            </button>
          )}
          
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-semibold text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>
    </>
  );
}
