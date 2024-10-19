import React from 'react';
import '../App.css';

interface ButtonProps {
  label: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void; // Add onClick prop
}

const Button: React.FC<ButtonProps> = ({
  label,
  disabled = false,
  className = '',
  onClick // Accept onClick function as prop
}) => {
  return (
    <button
      disabled={disabled}
      className={`button ${className}`}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      onClick={onClick} // Call onClick when the button is clicked
    >
      {label}
    </button>
  );
};

export default Button;
