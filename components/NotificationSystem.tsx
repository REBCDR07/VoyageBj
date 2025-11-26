import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon, MessageCircle } from 'lucide-react';

export type NotificationVariant = 'info' | 'success' | 'warning' | 'danger' | 'message';

export interface NotificationSender {
  name: string;
  avatar: string;
}

export interface NotificationItem {
  id: number;
  variant: NotificationVariant;
  title?: string;
  message?: string;
  sender?: NotificationSender;
}

interface NotificationSystemProps {
  notifications: NotificationItem[];
  removeNotification: (id: number) => void;
}

const DISPLAY_DURATION = 3000; // 3 seconds

export const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, removeNotification }) => {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex flex-col items-center gap-2 p-4 md:items-end md:top-auto md:bottom-0 md:right-0 md:max-w-sm">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const NotificationCard: React.FC<{ notification: NotificationItem; onRemove: () => void }> = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const endTime = startTime + (DISPLAY_DURATION * (progress / 100));

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / DISPLAY_DURATION) * 100;

      setProgress(newProgress);

      if (remaining <= 0) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onRemove, 300);
  };

  const variants = {
    info: {
      icon: <Info size={20} />,
      bg: 'bg-blue-50/90 dark:bg-blue-900/90',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-100',
      iconColor: 'text-blue-500',
      progress: 'bg-blue-500'
    },
    success: {
      icon: <CheckCircle size={20} />,
      bg: 'bg-green-50/90 dark:bg-green-900/90',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-100',
      iconColor: 'text-green-500',
      progress: 'bg-green-500'
    },
    warning: {
      icon: <AlertTriangle size={20} />,
      bg: 'bg-yellow-50/90 dark:bg-yellow-900/90',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-100',
      iconColor: 'text-yellow-500',
      progress: 'bg-yellow-500'
    },
    danger: {
      icon: <AlertOctagon size={20} />,
      bg: 'bg-red-50/90 dark:bg-red-900/90',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-100',
      iconColor: 'text-red-500',
      progress: 'bg-red-500'
    },
    message: {
      icon: <MessageCircle size={20} />,
      bg: 'bg-white/90 dark:bg-gray-800/90',
      border: 'border-gray-200 dark:border-gray-700',
      text: 'text-gray-800 dark:text-gray-100',
      iconColor: 'text-gray-500',
      progress: 'bg-gray-500'
    }
  };

  const style = variants[notification.variant];

  return (
    <div
      className={`
        pointer-events-auto relative w-full overflow-hidden rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 ease-out transform
        ${style.bg} ${style.border}
        ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"}
      `}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        {notification.variant === 'message' && notification.sender ? (
          <img src={notification.sender.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
        ) : (
          <div className={`p-2 rounded-full bg-white/50 dark:bg-black/10 ${style.iconColor} shadow-sm`}>
            {style.icon}
          </div>
        )}

        <div className="flex-1 pt-0.5">
          {notification.variant === 'message' && notification.sender ? (
            <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-0.5">{notification.sender.name}</h4>
          ) : notification.title && (
            <h4 className={`font-bold text-sm mb-0.5 ${style.text}`}>{notification.title}</h4>
          )}
          <p className={`text-sm leading-snug opacity-90 ${style.text}`}>{notification.message}</p>
        </div>

        <button
          onClick={handleDismiss}
          className={`p-1 rounded-lg hover:bg-black/5 transition-colors ${style.text} opacity-60 hover:opacity-100`}
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-black/5 w-full">
        <div
          className={`h-full transition-all duration-100 ease-linear ${style.progress}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
