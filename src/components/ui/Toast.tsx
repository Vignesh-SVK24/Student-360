import React from "react";
import { Check } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-semibold border border-slate-700">
      <Check className="w-4 h-4 text-emerald-400" />
      <span>{message}</span>
    </div>
  );
};