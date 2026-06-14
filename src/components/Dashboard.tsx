import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BookCard } from './BookCard';
import { PDFViewer } from './PDFViewer';
import { AdminSettingsModal } from './modals/AdminSettingsModal';
import { UploadModal } from './modals/UploadModal';
import { EditModal } from './modals/EditModal';
import { DeleteModal } from './modals/DeleteModal';
import { FolderOpen, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Book } from '../types';
import { motion, AnimatePresence } from 'motion/react';

import { EndpointConfig } from './EndpointConfig';

export function Dashboard() {
  const { isLoading, filteredBooks } = useStore();
  
  // Modals state
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [bookToView, setBookToView] = useState<Book | null>(null);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#F1F5F9] font-sans text-slate-800 overflow-hidden antialiased">
      <Sidebar onOpenAdminSettings={() => setShowAdminSettings(true)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onOpenUpload={() => setShowUpload(true)} />

        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8">
          <EndpointConfig />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
              <p className="font-medium">Menghubungkan ke database e-book...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <FolderOpen className="w-10 h-10" />
              </div>
              <p className="text-lg font-bold text-slate-700">Belum ada buku tersedia</p>
              <p className="text-sm text-slate-400 mt-1 max-w-xs text-center">Silakan ganti kategori atau unggah file PDF baru untuk mulai membaca.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredBooks.map(book => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    onEdit={setBookToEdit}
                    onDelete={setBookToDelete}
                    onOpenPdf={setBookToView}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showAdminSettings && <AdminSettingsModal onClose={() => setShowAdminSettings(false)} />}
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
        {bookToEdit && <EditModal book={bookToEdit} onClose={() => setBookToEdit(null)} />}
        {bookToDelete && <DeleteModal book={bookToDelete} onClose={() => setBookToDelete(null)} />}
        {bookToView && <PDFViewer book={bookToView} onClose={() => setBookToView(null)} />}
      </AnimatePresence>
    </div>
  );
}
