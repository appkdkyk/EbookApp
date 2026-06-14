import React, { useState } from 'react';
import { X, Settings, KeyRound, List, Plus, RotateCcw, EyeOff, Eye, Pencil, Trash2, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { executeGASAction } from '../../lib/api';

interface AdminSettingsProps {
  onClose: () => void;
}

export function AdminSettingsModal({ onClose }: AdminSettingsProps) {
  const { 
    adminPassword, setAdminPassword, 
    categories, setCategories, 
    books, setBooks,
    showToast 
  } = useStore();

  const [newPassword, setNewPassword] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const [isChangingPass, setIsChangingPass] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if(newPassword.length < 5) {
      showToast("Password minimal 5 karakter!", "error");
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await executeGASAction('changePassword', { newPassword, adminPassword });
      if (res.success) {
        showToast("Password Admin berhasil diperbarui!");
        setAdminPassword(newPassword);
        setNewPassword('');
      } else {
        showToast(res.error || "Gagal mengubah password", "error");
      }
    } catch(e) {
      showToast("Kesalahan sistem", "error");
    } finally {
      setIsChangingPass(false);
    }
  };

  const saveCategoriesToAPI = async (newCats: typeof categories) => {
    try {
      await executeGASAction('saveCategories', { categories: newCats, password: adminPassword });
    } catch(e) {
      console.warn("Failed to sync categories to backend");
    }
  };

  const saveBooksToAPI = async (newBooks: typeof books) => {
    try {
      await executeGASAction('saveBooks', { books: newBooks, password: adminPassword });
    } catch(e) {
      console.warn("Failed to sync books to backend");
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategory.trim();
    if(!name) return;

    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      showToast("Kategori sudah ada!", "error");
      return;
    }

    const newCat = {
      id: 'cat_' + Date.now(),
      name,
      icon: 'Folder',
      isVisible: true
    };

    const newCats = [...categories, newCat];
    setCategories(newCats);
    saveCategoriesToAPI(newCats);
    setNewCategory('');
    showToast("Kategori ditambahkan");
  };

  const toggleVisibility = (id: string) => {
    const newCats = categories.map(c => c.id === id ? { ...c, isVisible: !c.isVisible } : c);
    setCategories(newCats);
    saveCategoriesToAPI(newCats);
  };

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    if (!confirm(`Yakin ingin menghapus kategori "${cat.name}"? Buku di dalamnya akan dimasukkan ke "Lainnya".`)) return;

    const newCats = categories.filter(c => c.id !== id);
    setCategories(newCats);
    saveCategoriesToAPI(newCats);

    // Reassign books
    const newBooks = books.map(b => b.category === cat.name ? { ...b, category: 'Lainnya' } : b);
    setBooks(newBooks);
    saveBooksToAPI(newBooks);

    showToast("Kategori dihapus");
  };

  const handleSaveEditCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    const name = editingCatName.trim();
    
    if(!name || name === cat.name) {
      setEditingCatId(null);
      return;
    }

    const oldName = cat.name;
    const newCats = categories.map(c => c.id === id ? { ...c, name } : c);
    setCategories(newCats);
    saveCategoriesToAPI(newCats);

    const newBooks = books.map(b => b.category === oldName ? { ...b, category: name } : b);
    setBooks(newBooks);
    saveBooksToAPI(newBooks);

    setEditingCatId(null);
    showToast("Kategori diperbarui");
  };

  const handleSyncDrive = async () => {
    setIsSyncing(true);
    try {
      const res = await executeGASAction('syncWithDrive', { password: adminPassword });
      if (res.success) {
        setBooks(res.data);
        showToast("Sinkronisasi Berhasil!");
      } else {
        showToast(res.error || "Sinkronisasi gagal", "error");
      }
    } catch(e) {
      showToast("Kesalahan sistem saat sinkronisasi", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex justify-between items-center flex-shrink-0">
          <h3 className="font-extrabold text-lg text-slate-800 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" /> Pengaturan Administrator
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-base border-b border-slate-100 pb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-slate-400" /> Ubah Password Admin
            </h4>
            <form onSubmit={handlePasswordChange} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password Baru</label>
                <input 
                  type="password" 
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                />
              </div>
              <button 
                type="submit" 
                disabled={isChangingPass}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md whitespace-nowrap text-sm"
              >
                {isChangingPass ? 'Menyimpan...' : 'Simpan Password'}
              </button>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-base border-b border-slate-100 pb-2 flex items-center gap-2">
              <List className="w-4 h-4 text-slate-400" /> Manajemen Kategori Menu
            </h4>
            
            <form onSubmit={handleAddCategory} className="flex gap-3 items-end mb-6">
              <div className="w-full">
                <input 
                  type="text" 
                  required 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nama kategori baru..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-slate-50"
                />
              </div>
              <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md whitespace-nowrap text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </form>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Nama Kategori</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map(kat => (
                    <tr key={kat.id} className="hover:bg-slate-50 transition-colors">
                      {editingCatId === kat.id ? (
                        <td colSpan={3} className="px-4 py-2 bg-indigo-50/50">
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={editingCatName}
                              onChange={(e) => setEditingCatName(e.target.value)}
                              autoFocus
                              className="flex-1 px-3 py-1.5 border border-indigo-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button onClick={() => handleSaveEditCategory(kat.id)} className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm hover:bg-indigo-700 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Simpan
                            </button>
                            <button onClick={() => setEditingCatId(null)} className="bg-slate-200 text-slate-600 px-3 py-1.5 rounded text-sm font-bold hover:bg-slate-300">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      ) : (
                        <>
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {kat.name}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {kat.isVisible 
                              ? <span className="px-2 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-md">Ditampilkan</span>
                              : <span className="px-2 py-1 text-[10px] font-bold bg-slate-200 text-slate-600 rounded-md">Disembunyikan</span>
                            }
                          </td>
                          <td className="px-4 py-3 text-right space-x-1">
                            <button onClick={() => toggleVisibility(kat.id)} className="w-7 h-7 inline-flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-colors" title={kat.isVisible ? 'Sembunyikan' : 'Tampilkan'}>
                              {kat.isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                            <button onClick={() => { setEditingCatId(kat.id); setEditingCatName(kat.name); }} className="w-7 h-7 inline-flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-colors" title="Ubah Nama">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDeleteCategory(kat.id)} className="w-7 h-7 inline-flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 shadow-sm transition-colors" title="Hapus Kategori">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2 text-base border-b border-slate-100 pb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-slate-400" /> Sinkronisasi Google Drive
            </h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Pindai folder Google Drive untuk mendeteksi PDF baru yang diunggah manual, atau menghapus data buku di aplikasi jika file aslinya di Drive sudah dihapus.</p>
            <button 
              onClick={handleSyncDrive}
              disabled={isSyncing}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md whitespace-nowrap text-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
              {isSyncing ? 'Menyinkronkan...' : 'Mulai Sinkronisasi'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
