import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workflow } from '../types';

interface CartItem {
  workflow: Workflow;
  addedAt: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (workflow: Workflow) => void;
  removeFromCart: (id: string) => void;
  isInCart: (id: string) => boolean;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'wfz-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (workflow: Workflow) => {
    setItems(prev => {
      if (prev.some(i => i.workflow.id === workflow.id)) return prev;
      return [...prev, { workflow, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromCart = (id: string) =>
    setItems(prev => prev.filter(i => i.workflow.id !== id));

  const isInCart = (id: string) => items.some(i => i.workflow.id === id);

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.workflow.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, isInCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
