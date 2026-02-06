import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface OrderNotesSectionProps {
  notes?: string;
}

export const OrderNotesSection = ({ notes }: OrderNotesSectionProps) => {
  if (!notes) {
    return null;
  }

  return (
    <div className='space-y-3 md:space-y-4'>
      <h3 className='text-base md:text-lg font-semibold text-neutral-900'>
        Order Notes
      </h3>
      <div className='flex items-start gap-3 p-3 md:p-4 bg-amber-50 border border-amber-100 rounded-lg'>
        <ChatBubbleLeftRightIcon className='h-4 w-4 md:h-5 md:w-5 text-amber-600 shrink-0 mt-0.5' />
        <p className='text-sm md:text-base text-neutral-700'>{notes}</p>
      </div>
    </div>
  );
};
