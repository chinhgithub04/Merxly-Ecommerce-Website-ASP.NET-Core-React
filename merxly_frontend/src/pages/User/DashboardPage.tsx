import {
  AccountInfoSection,
  AddressesSection,
  PaymentMethodsSection,
} from '../../components/dashboard';

export const DashboardPage = () => {
  return (
    <div className='p-4 md:p-6 lg:p-10 space-y-8'>
      {/* Account Info Section */}
      <AccountInfoSection />

      {/* Addresses Section */}
      <AddressesSection />

      {/* Payment Methods Section */}
      <PaymentMethodsSection />
    </div>
  );
};
