import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Heart, CheckCircle2, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Toast: React.FC = () => {
  const { toast } = useShop();

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            id={`toast-${toast.id}`}
            className="pointer-events-auto bg-neutral-900 text-white p-4 rounded-xl shadow-2xl border border-neutral-800 flex items-start gap-3.5 backdrop-blur-md bg-opacity-95"
          >
            <div className="p-2 rounded-lg bg-neutral-800 text-amber-300 shrink-0 mt-0.5">
              {toast.type === 'cart' && <ShoppingBag className="w-4 h-4" />}
              {toast.type === 'wishlist' && <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />}
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-neutral-300" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-wide text-neutral-100">{toast.title}</h4>
              {toast.subtitle && (
                <p className="text-xs text-neutral-400 mt-0.5 truncate">{toast.subtitle}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
