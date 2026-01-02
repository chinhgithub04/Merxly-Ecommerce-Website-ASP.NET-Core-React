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
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-neutral-900'>
        Shipping Address
      </h3>
      <div className='space-y-2'>
        <p className='font-semibold text-neutral-900'>{fullName}</p>
        <p className='text-sm text-neutral-700'>
          {fullAddress}, {postalCode}
        </p>
        {phoneNumber && (
          <p className='text-sm text-neutral-700'>
            Phone Number: {phoneNumber}
          </p>
        )}
        <p className='text-sm text-neutral-700'>Email: {email}</p>
      </div>
    </div>
  );
};
