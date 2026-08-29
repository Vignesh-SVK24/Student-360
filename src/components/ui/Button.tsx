import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm focus:ring-slate-900",
    secondary: "bg-[#0d4933]/10 text-[#0d4933] hover:bg-[#629176]/20 focus:ring-[#629176]",
    destructive: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 focus:ring-red-500",
    ghost: "hover:bg-slate-100 text-slate-700 focus:ring-slate-500",
    outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 focus:ring-slate-500",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />
  );
}
