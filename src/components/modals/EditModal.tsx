import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { Book } from '../../types';
import { useStore } from '../../context/StoreContext';
import { executeGASAction } from '../../lib/api';

export function EditModal({ book, onClose }: { book: Book, onClose: () => void }) {
  const { adminPassword, categories, books, setBooks, showToast } = useStore();
  const [title, setTitle] = useState(book.title);
  const [category, setCategory] = useState(book.category);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await executeGASAction('updateBook', {
        password: adminPassword,
        id: book.id,
        title,
        category
      });

      if (res.success) {
        showToast("Informasi buku berhasil diperbarui!");
        const newBooks = books.map(b => b.id === book.id ? { ...b, title, category } : b);
        setBooks(newBooks);
        onClose();
      } else {
        showToast(res.error || "Gagal menyimpan perubahan", "error");
      }
    } catch(e) {
      showToast("Kesalahan sistem", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex justify-between items-center">
          <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">Edit Info E-Book</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Judul Buku</label>
              <input 
                type="text" 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name} {!cat.isVisible && '(Tersembunyi)'}</option>
                ))}
              </select>
            </div>
            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md flex justify-center items-center gap-2"
            >
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span> 
              {!isSaving && <Save className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
