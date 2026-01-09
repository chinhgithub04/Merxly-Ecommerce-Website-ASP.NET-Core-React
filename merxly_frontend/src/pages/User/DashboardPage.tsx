import {
  AccountInfoSection,
  AddressesSection,
  PaymentMethodsSection,
} from '../../components/dashboard';

export const DashboardPage = () => {
  return (
    <div className='p-10'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Account Info Section */}
        <AccountInfoSection />

        {/* Addresses Section */}
        <AddressesSection />

        {/* Payment Methods Section */}
        <PaymentMethodsSection />
      </div>
    </div>
  );
};
