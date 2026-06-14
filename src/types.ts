export type Role = 'user' | 'admin' | null;

export interface Category {
  id: string;
  name: string;
  icon: string;
  isVisible: boolean;
}

export interface Book {
  id: string;
  title: string;
  category: string;
  url: string;
}
