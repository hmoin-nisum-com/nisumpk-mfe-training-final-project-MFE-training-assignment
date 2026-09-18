import React, { useEffect } from 'react';
import { useAppStore } from '@ecommerce/state';
import { Toast } from '@ecommerce/shared-ui';
import { NISUM } from '@ecommerce/events';
import { NotificationShowPayload } from '@ecommerce/shared-types';

export const ToastContainer: React.FC = () => {
  const toasts = useAppStore((state) => state.toasts);
  const addToast = useAppStore((state) => state.addToast);
  const removeToast = useAppStore((state) => state.removeToast);

  // Subscribe to global notification:show event
  useEffect(() => {
    const unsubscribe = NISUM.listener('notification:show', (payload: NotificationShowPayload) => {
      if (payload && payload.message) {
        addToast({
          message: payload.message,
          type: payload.type || 'info',
          duration: payload.duration || 4000
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [addToast]);

  // Auto-dismiss toasts
  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((t) => {
      return setTimeout(() => {
        removeToast(t.id);
      }, t.duration || 4000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        maxWidth: '380px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} notification={toast} onClose={removeToast} />
      ))}
    </div>
  );
};
