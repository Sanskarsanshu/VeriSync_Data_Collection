import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useAppStore, AppNotification } from '@/store/useAppStore';

export function ToastNotification() {
  const { latestNotification, clearLatestNotification } = useAppStore();
  const [currentToast, setCurrentToast] = useState<AppNotification | null>(null);

  useEffect(() => {
    if (latestNotification) {
      setCurrentToast(latestNotification);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setCurrentToast(null);
        clearLatestNotification();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [latestNotification, clearLatestNotification]);

  if (!currentToast) return null;

  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={24} />,
    warning: <AlertTriangle className="text-amber-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
    error: <XCircle className="text-red-500" size={24} />
  };

  const borderColors = {
    success: 'border-emerald-500/20',
    warning: 'border-amber-500/20',
    info: 'border-blue-500/20',
    error: 'border-red-500/20'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        className="fixed bottom-6 right-6 z-50 pointer-events-auto"
      >
        <div className={`bg-card/90 backdrop-blur-xl border ${borderColors[currentToast.type]} rounded-2xl p-4 shadow-2xl flex items-start gap-4 min-w-[320px] max-w-sm`}>
          <div className="shrink-0 mt-0.5">
            {icons[currentToast.type]}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-foreground">{currentToast.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {currentToast.message}
            </p>
          </div>
          <button 
            onClick={() => {
              setCurrentToast(null);
              clearLatestNotification();
            }}
            className="shrink-0 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
