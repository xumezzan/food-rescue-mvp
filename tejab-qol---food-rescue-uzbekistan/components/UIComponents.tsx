import React from 'react';
import { StoreCategory } from '../types';

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'yellow' | 'red' | 'gray' }> = ({ children, color = 'green' }) => {
  const colors = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all";
  
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark focus:ring-brand",
    secondary: "bg-brand-accent text-white hover:bg-yellow-600 focus:ring-yellow-500",
    outline: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-brand",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 shadow-none",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const CategoryIcon: React.FC<{ category: StoreCategory }> = ({ category }) => {
  const icons = {
    [StoreCategory.RESTAURANT]: "🍽️",
    [StoreCategory.BAKERY]: "🥐",
    [StoreCategory.GROCERY]: "🛒",
    [StoreCategory.CAFE]: "☕",
    [StoreCategory.FAST_FOOD]: "🍔"
  };
  return <span>{icons[category]}</span>;
};

export const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
