import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDone?: () => void;
  title: string;
  children: React.ReactNode;
  doneLabel?: string;
  cancelLabel?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  onDone,
  title,
  children,
  doneLabel = 'Done',
  cancelLabel = 'Cancel',
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className='fixed inset-0 z-50 bg-black/50 transition-opacity'
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none'>
        <div
          className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col pointer-events-auto'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-4 border-b border-neutral-200'>
            <h2 className='text-lg font-semibold text-neutral-900'>{title}</h2>
            <button
              type='button'
              onClick={onClose}
              className='p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors'
            >
              <XMarkIcon className='w-5 h-5' />
            </button>
          </div>

          {/* Body */}
          <div className='flex-1 overflow-y-auto px-6 py-4'>{children}</div>

          {/* Footer */}
          <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200'>
            <Button variant='outline' onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button variant='primary' onClick={onDone || onClose}>
              {doneLabel}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
