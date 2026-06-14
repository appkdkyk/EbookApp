import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function Toast() {
  const { toast } = useStore();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={`fixed bottom-5 right-5 z-[60] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
            toast.type === 'error' ? 'bg-rose-500' :
            toast.type === 'info' ? 'bg-blue-500' :
            'bg-emerald-500'
          }`}
        >
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shadow-inner">
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
             toast.type === 'info' ? <Info className="w-5 h-5" /> :
             <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <span className="font-bold block text-sm">{toast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
