import {
  AddressesSection,
  PaymentMethodsSection,
} from '../../components/dashboard';

export const DashboardPage = () => {
  return (
    <div className='px-20 py-12'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Addresses Section */}
        <AddressesSection />

        {/* Payment Methods Section */}
        <PaymentMethodsSection />
      </div>
    </div>
  );
};
