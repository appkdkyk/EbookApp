import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Category, Role } from '../types';
import { executeGASAction } from '../lib/api';

interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface StoreContextType {
  role: Role;
  setRole: (role: Role) => void;
  adminPassword: string;
  setAdminPassword: (password: string) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  books: Book[];
  setBooks: (books: Book[]) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  toast: ToastOptions | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  refreshData: () => Promise<void>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  filteredBooks: Book[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const hideToast = () => setToast(null);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const catsRes = await executeGASAction('getCategories');
      if (catsRes.success && Array.isArray(catsRes.data)) {
        setCategories(catsRes.data);
      }

      const booksRes = await executeGASAction('getBooks');
      if (booksRes.success && Array.isArray(booksRes.data)) {
        setBooks(booksRes.data);
      }
    } catch (e) {
      showToast('Gagal memuat data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role) {
      refreshData();
    }
  }, [role]);

  let filteredBooks = activeCategory === 'Semua' 
    ? books 
    : books.filter(b => b.category === activeCategory);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredBooks = filteredBooks.filter(b => b.title.toLowerCase().includes(q));
  }

  // Filter hidden categories for non-admin
  if (role !== 'admin') {
    const visibleCats = categories.filter(c => c.isVisible).map(c => c.name);
    filteredBooks = filteredBooks.filter(b => visibleCats.includes(b.category));
  }

  const value = {
    role, setRole,
    adminPassword, setAdminPassword,
    categories, setCategories,
    books, setBooks,
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    isLoading,
    toast, showToast, hideToast,
    refreshData,
    isSidebarOpen, setIsSidebarOpen,
    filteredBooks
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
