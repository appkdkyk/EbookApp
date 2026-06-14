import React from 'react';
import { Menu, Search, Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onOpenUpload: () => void;
}

export function Header({ onOpenUpload }: HeaderProps) {
  const { 
    role, 
    activeCategory, 
    filteredBooks, 
    searchQuery, setSearchQuery, 
    setIsSidebarOpen 
  } = useStore();

  return (
    <header className="h-auto md:h-20 bg-white border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 md:px-10 shadow-sm z-10 gap-4 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden text-slate-600 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {activeCategory === 'Semua' ? 'Semua Buku' : `Kategori: ${activeCategory}`}
          </h1>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
            Menampilkan {filteredBooks.length} dokumen
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:flex-initial md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Cari dokumen..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
          />
        </div>
        {role === 'admin' && (
          <button 
            onClick={onOpenUpload}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> 
            <span className="hidden sm:inline">Upload Baru</span>
          </button>
        )}
      </div>
    </header>
  );
}
