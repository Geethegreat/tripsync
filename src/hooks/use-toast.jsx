
import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);
    
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  const toast = (props) => {
    const { title, description, action, variant, duration = 5000 } = props;
    
    return context.addToast({
      title,
      description,
      action,
      variant,
      duration,
    });
  };
  
  return { ...context, toast };
}

export const toast = (props) => {
  const { addToast } = useToast();
  return addToast(props);
};
