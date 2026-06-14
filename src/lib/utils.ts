import { icons } from 'lucide-react';

export function getIcon(name: string) {
  const Icon = (icons as any)[name] || icons.Folder;
  return Icon;
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
