import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const ToastNotifications: React.FC = () => {
  const { toasts, removeToast } = useAppContext();

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-400" />,
    error: <XCircle className="w-6 h-6 text-red-400" />,
    info: <Info className="w-6 h-6 text-blue-400" />,
  };

  return (
    <div className="fixed top-20 right-4 z-[100] w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="mb-4 p-4 w-full bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl flex items-start space-x-4"
          >
            <div className="flex-shrink-0">{icons[toast.type]}</div>
            <p className="flex-grow text-slate-200 text-sm">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-slate-500 hover:text-white transition-colors">
              <XCircle className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotifications;
