import { Book, Category } from '../types';

export const GAS_URL = 'https://script.google.com/macros/s/AKfycbzxVGLQJsR1J9IQns8AKZTCjCSFe4C5X9HOAIGq5PDdfJiHFCJ_drBV-w83cKSecOK0/exec';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Mekanik', icon: 'Wrench', isVisible: true },
  { id: 'cat2', name: 'Elektrik', icon: 'Zap', isVisible: true },
  { id: 'cat3', name: 'Daily Check', icon: 'ClipboardCheck', isVisible: true },
  { id: 'cat4', name: 'TKA', icon: 'UserTie', isVisible: true },
  { id: 'cat5', name: 'Administrasi', icon: 'FileText', isVisible: true },
  { id: 'cat6', name: 'Lainnya', icon: 'FolderOpen', isVisible: true }
];

export const MOCK_BOOKS: Book[] = [
  { id: '1', title: 'Buku Manual Perawatan Mesin Diesel V8', category: 'Mekanik', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: '2', title: 'Skema Instalasi Listrik Gedung B Utama', category: 'Elektrik', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: '3', title: 'Formulir Pengecekan Kendaraan Operasional', category: 'Daily Check', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: '4', title: 'SOP Pelatihan Standarisasi Tenaga Kerja Asing', category: 'TKA', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: '5', title: 'Template Administrasi & Laporan Keuangan Bulanan', category: 'Administrasi', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
];

let fallbackBooks = [...MOCK_BOOKS];
let fallbackCategories = [...DEFAULT_CATEGORIES];

export async function executeGASAction(action: string, payload: any = {}): Promise<any> {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload }),
      redirect: 'follow'
    });
    
    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    return data;
  } catch (e) {
    console.warn("GAS fetch failed handling externally, using internal fallback for action:", action);
    return handleFallback(action, payload);
  }
}

function handleFallback(action: string, payload: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch(action) {
        case 'getCategories':
          resolve({ success: true, data: fallbackCategories });
          break;
        case 'getBooks':
          resolve({ success: true, data: fallbackBooks });
          break;
        case 'verifyAdmin':
          resolve({ success: payload.password === 'admin123' });
          break;
        case 'changePassword':
          resolve({ success: true });
          break;
        case 'saveCategories':
          fallbackCategories = payload.categories;
          resolve({ success: true });
          break;
        case 'saveBooks':
          fallbackBooks = payload.books;
          resolve({ success: true });
          break;
        case 'uploadBook':
          const newBook = { id: Date.now().toString(), title: payload.title, category: payload.category, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' };
          fallbackBooks.push(newBook);
          resolve({ success: true, book: newBook });
          break;
        case 'updateBook':
          fallbackBooks = fallbackBooks.map(b => b.id === payload.id ? { ...b, title: payload.title, category: payload.category } : b);
          resolve({ success: true });
          break;
        case 'deleteBook':
          fallbackBooks = fallbackBooks.filter(b => b.id !== payload.id);
          resolve({ success: true });
          break;
        case 'syncWithDrive':
          resolve({ success: true, data: fallbackBooks });
          break;
        default:
          resolve({ success: false, error: 'Unknown action' });
      }
    }, 500);
  });
}
