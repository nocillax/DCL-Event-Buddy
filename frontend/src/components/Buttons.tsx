import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  const baseClasses =
    'bg-gradient-to-b from-blue-400 to-blue-600 text-white font-medium py-2 rounded-md shadow hover:opacity-90 transition-opacity';

  return (
    <button {...props} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
