import React, { useState } from 'react';
import { X, FileText, CloudUpload } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { executeGASAction } from '../../lib/api';

export function UploadModal({ onClose }: { onClose: () => void }) {
  const { adminPassword, categories, setBooks, books, activeCategory, showToast } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(activeCategory !== 'Semua' ? activeCategory : (categories[0]?.name || ''));
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showToast("Pilih file PDF terlebih dahulu!", "error");
      return;
    }
    
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = (event.target?.result as string).split(',')[1];
      
      try {
        const res = await executeGASAction('uploadBook', {
          password: adminPassword,
          title,
          category,
          base64Data,
          filename: file.name
        });

        if (res.success && res.book) {
          setBooks([...books, res.book]);
          showToast("Buku berhasil diupload!");
          onClose();
        } else {
          showToast(res.error || "Gagal mengupload", "error");
        }
      } catch (err) {
        showToast("Terjadi kesalahan koneksi", "error");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
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
          <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">Upload E-Book Baru</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleUpload}>
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Judul Buku</label>
              <input 
                type="text" 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: SOP Perawatan Sarana" 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>
            
            <div className="mb-4">
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
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">File PDF</label>
              <div 
                className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors bg-slate-50/50 relative cursor-pointer group"
                onClick={() => document.getElementById('input-file')?.click()}
              >
                <FileText className="w-10 h-10 text-rose-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-slate-600"><span className="font-bold text-indigo-600">Pilih berkas</span> PDF Anda</p>
                <p className="text-xs text-slate-400 mt-1">Ukuran file direkomendasikan di bawah 10MB</p>
                <p className="text-xs font-semibold text-indigo-600 mt-3 truncate px-2">
                  {file?.name}
                </p>
              </div>
              <input 
                type="file" 
                id="input-file" 
                accept="application/pdf" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isUploading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md flex justify-center items-center gap-2"
            >
              <span>{isUploading ? 'Mengupload...' : 'Upload File'}</span> 
              {!isUploading && <CloudUpload className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
