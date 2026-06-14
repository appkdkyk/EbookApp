import React from 'react';
import { FileText, Share2, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { Book } from '../types';
import { useStore } from '../context/StoreContext';
import { getIcon } from '../lib/utils';
import { motion } from 'motion/react';

interface BookCardProps {
  key?: React.Key;
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onOpenPdf: (book: Book) => void;
}

export function BookCard({ book, onEdit, onDelete, onOpenPdf }: BookCardProps) {
  const { role, categories, showToast } = useStore();

  const getStyle = (categoryName: string) => {
    const baseCat = categories.find(c => c.name === categoryName);
    const iconName = baseCat ? baseCat.icon : 'FolderOpen';
    
    switch(categoryName) {
      case 'Mekanik': return { gradient: 'from-orange-500 to-red-600 shadow-orange-500/15', iconName, accent: 'border-orange-200/60 bg-orange-50 text-orange-700' };
      case 'Elektrik': return { gradient: 'from-amber-400 to-yellow-600 shadow-yellow-500/15', iconName, accent: 'border-yellow-200/60 bg-yellow-50 text-yellow-800' };
      case 'Daily Check': return { gradient: 'from-emerald-400 to-teal-600 shadow-emerald-500/15', iconName, accent: 'border-emerald-200/60 bg-emerald-50 text-emerald-700' };
      case 'TKA': return { gradient: 'from-purple-500 to-indigo-600 shadow-purple-500/15', iconName, accent: 'border-purple-200/60 bg-purple-50 text-purple-700' };
      case 'Administrasi': return { gradient: 'from-sky-400 to-blue-600 shadow-blue-500/15', iconName, accent: 'border-sky-200/60 bg-sky-50 text-sky-700' };
      default: return { gradient: 'from-slate-500 to-slate-700 shadow-slate-500/15', iconName: 'FolderOpen', accent: 'border-slate-200/60 bg-slate-50 text-slate-700' };
    }
  };

  const style = getStyle(book.category);
  const Icon = getIcon(style.iconName);

  const handleShare = () => {
    const shareData = {
      title: 'E-Book Portal: ' + book.title,
      text: 'Silakan baca dokumen resmi: ' + book.title,
      url: book.url
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => showToast("Berhasil dibagikan!"))
        .catch((err) => {
          if (err.name !== 'AbortError') copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(book.url).then(() => {
      showToast("Tautan disalin ke papan klip!");
    }).catch(() => {
      showToast("Gagal menyalin tautan", "error");
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch gap-5 transition-all duration-300 hover:shadow-md hover:border-slate-300 group"
    >
      <div className={`w-full sm:w-32 h-44 sm:h-auto min-h-[140px] rounded-xl bg-gradient-to-br ${style.gradient} flex flex-col justify-between p-4 text-white shadow-lg relative overflow-hidden flex-shrink-0`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <span className="text-xs font-black tracking-widest opacity-80 uppercase">PDF</span>
          <Icon className="w-5 h-5 opacity-90" />
        </div>
        
        <div className="relative z-10">
          <div className="h-1 w-8 bg-white/50 rounded mb-2"></div>
          <p className="text-[10px] font-black tracking-wider uppercase opacity-75 truncate" title={book.category}>
            {book.category}
          </p>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <span className={`inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md border truncate max-w-[120px] ${style.accent}`} title={book.category}>
              {book.category}
            </span>
            {role === 'admin' && (
              <div className="flex gap-1">
                <button onClick={() => onEdit(book)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Metadata">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(book)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus Dokumen">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <h3 className="text-base md:text-lg font-black text-slate-800 line-clamp-2 leading-snug mb-1" title={book.title}>
            {book.title}
          </h3>
          <p className="text-xs text-slate-400 font-medium mb-4">Dokumen Terverifikasi</p>
        </div>
        
        <div className="flex items-center justify-between border-t border-slate-50 pt-3">
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Siap Dibaca
          </span>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 text-slate-400 hover:text-slate-600 transition-colors duration-200" title="Bagikan E-book">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={() => onOpenPdf(book)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2 whitespace-nowrap">
              <span>Buka</span> 
              <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
