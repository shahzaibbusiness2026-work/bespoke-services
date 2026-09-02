'use client';

import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Heart, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Toast: React.FC = () => {
  const { toast } = useShop();

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            id={`toast-${toast.id}`}
            className="pointer-events-auto bg-[#1a1c1b] text-white p-4 shadow-2xl border border-[#383838] flex items-start gap-3.5 rounded-none"
          >
            <div className="p-2 bg-[#252726] text-white shrink-0 mt-0.5 rounded-none border border-white/10">
              {toast.type === 'cart' && <ShoppingBag className="w-4 h-4" />}
              {toast.type === 'wishlist' && <Heart className="w-4 h-4 fill-white text-white" />}
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#efe0cf]" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-white/80" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-body-sm font-semibold tracking-wide text-white">{toast.title}</h4>
              {toast.subtitle && (
                <p className="text-[12px] text-white/70 mt-0.5 truncate font-light">{toast.subtitle}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
