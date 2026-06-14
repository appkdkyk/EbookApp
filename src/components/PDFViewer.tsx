import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { Book } from '../types';

interface PDFViewerProps {
  book: Book;
  onClose: () => void;
}

export function PDFViewer({ book, onClose }: PDFViewerProps) {
  // Convert basic google drive view URL to preview for iframe
  let finalUrl = book.url;
  if (finalUrl.includes('drive.google.com/file/d/')) {
    finalUrl = finalUrl.replace(/\/view.*$/, '/preview');
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg border-b border-slate-800 z-10">
        <div className="flex items-center gap-3 truncate pr-4">
          <FileText className="w-5 h-5 text-rose-500" />
          <h3 className="font-extrabold text-base truncate tracking-tight">{book.title}</h3>
        </div>
        <button 
          onClick={onClose}
          className="bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold shadow-inner"
        >
          <X className="w-4 h-4" /> <span>Tutup</span>
        </button>
      </div>
      <div className="flex-1 w-full bg-slate-900 flex justify-center items-center relative">
        <iframe 
          className="w-full h-full border-none" 
          src={finalUrl}
          title={book.title}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
