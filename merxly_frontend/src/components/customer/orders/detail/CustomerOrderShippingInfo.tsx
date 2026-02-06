interface CustomerOrderShippingInfoProps {
  fullName: string;
  fullAddress: string;
  postalCode: string;
  phoneNumber?: string;
  email: string;
}

export const CustomerOrderShippingInfo = ({
  fullName,
  fullAddress,
  postalCode,
  phoneNumber,
  email,
}: CustomerOrderShippingInfoProps) => {
  return (
    <div className='space-y-3 md:space-y-4'>
      <h3 className='text-base md:text-lg font-semibold text-neutral-900'>
        Shipping Address
      </h3>
      <div className='space-y-2'>
        <p className='text-sm md:text-base font-semibold text-neutral-900'>
          {fullName}
        </p>
        <p className='text-xs md:text-sm text-neutral-700 wrap-break-word'>
          {fullAddress}, {postalCode}
        </p>
        {phoneNumber && (
          <p className='text-xs md:text-sm text-neutral-700'>
            Phone Number: {phoneNumber}
          </p>
        )}
        <p className='text-xs md:text-sm text-neutral-700 wrap-break-word'>
          Email: {email}
        </p>
      </div>
    </div>
  );
};
