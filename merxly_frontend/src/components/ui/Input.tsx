import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={id}
            className='block text-sm font-medium text-neutral-700 mb-1'
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-neutral-400 
            focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent 
            disabled:cursor-not-allowed disabled:opacity-50 transition-colors
            ${
              error
                ? 'border-error-500 focus:ring-error-500'
                : 'border-neutral-300'
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className='mt-1 text-sm text-error-600'>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
