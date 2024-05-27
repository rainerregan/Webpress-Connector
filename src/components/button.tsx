import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  buttonType?: ButtonType;
  disabled?: boolean; // Add disabled prop
}

export enum ButtonType {
  PRIMARY,
  SECONDARY
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className, buttonType = ButtonType.PRIMARY, disabled = false }) => {
  const buttonStyles = useMemo(() => {
    switch (buttonType) {
      case ButtonType.PRIMARY:
        return 'bg-blue-500 text-white hover:bg-blue-400 active:opacity-90';
      case ButtonType.SECONDARY:
        return 'bg-white text-black hover:bg-gray-100 active:bg-gray-200';
      default:
        return 'bg-blue-500 text-white hover:bg-blue-400 active:opacity-90';
    }
  }, [buttonType])

  return (
    <button
      className={twMerge('w-full px-4 py-2 rounded-lg', buttonStyles, disabled ? 'opacity-50 cursor-not-allowed' : '')}
      onClick={onClick}
      disabled={disabled} // Add disabled prop to the button element
    >
      {children}
    </button>
  );
};

export default Button;