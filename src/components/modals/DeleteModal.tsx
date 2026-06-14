import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Book } from '../../types';
import { useStore } from '../../context/StoreContext';
import { executeGASAction } from '../../lib/api';

export function DeleteModal({ book, onClose }: { book: Book, onClose: () => void }) {
  const { adminPassword, books, setBooks, showToast } = useStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await executeGASAction('deleteBook', {
        password: adminPassword,
        id: book.id
      });

      if (res.success) {
        showToast("Buku berhasil dihapus!", "success");
        setBooks(books.filter(b => b.id !== book.id));
        onClose();
      } else {
        showToast(res.error || "Gagal menghapus", "error");
      }
    } catch(e) {
      showToast("Kesalahan sistem", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
            <Trash2 className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-xl text-slate-800 mb-2 tracking-tight">Hapus E-Book?</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Apakah Anda yakin ingin menghapus <span className="font-bold text-rose-600">{book.title}</span>? 
            Berkas di Google Drive Anda juga akan dihapus permanen.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              disabled={isDeleting}
              className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold py-3 rounded-xl transition-all text-sm"
            >
              Batal
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-rose-600/10 text-sm"
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
