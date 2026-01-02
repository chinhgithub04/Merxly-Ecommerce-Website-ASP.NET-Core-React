import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';
import { HomePage } from './pages/Home';
import {
  SearchProductPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  OrderHistoryPage,
  CustomerOrderDetailPage,
} from './pages/Customer';
import { DashboardPage } from './pages/User';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StoreOwnerLayout } from './components/layout';
import { AdminLayout } from './components/layout/admin';
import { CustomerLayout } from './components/layout/customer';
import {
  StoreHomePage,
  StoreOrdersPage,
  StoreOrderDetailPage,
  StoreProductsPage,
  StoreSettingsPage,
} from './pages/Store';
import {
  AdminDashboardPage,
  AdminCategoriesPage,
  AdminStoresPage,
  AdminUsersPage,
  AdminStoreVerificationPage,
} from './pages/Admin';
import { CreateProductPage } from './pages/Store/CreateProductPage';
import { UserRole } from './types/enums';
import { StoreLocationsPage } from './pages/Store/StoreLocationsPage';
import { StorePaymentsPage } from './pages/Store/StorePaymentsPage';
import { StoreMyStorePage } from './pages/Store/StoreMyStorePage';
import { SignUpNewStorePage } from './pages/SignUpNewStorePage';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/sign-up-new-store' element={<SignUpNewStorePage />} />

        {/* Admin Routes with Layout */}
        <Route
          path='/admin'
          element={
            <ProtectedRoute requiredRoles={[UserRole.Admin]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path='categories' element={<AdminCategoriesPage />} />
          <Route path='stores' element={<AdminStoresPage />} />
          <Route
            path='stores/verification'
            element={<AdminStoreVerificationPage />}
          />
          <Route path='users' element={<AdminUsersPage />} />
        </Route>

        {/* Store Owner Routes with Layout */}
        <Route
          path='/store'
          element={
            <ProtectedRoute requiredRoles={[UserRole.StoreOwner]}>
              <StoreOwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StoreHomePage />} />
          <Route path='orders' element={<StoreOrdersPage />} />
          <Route path='orders/:subOrderId' element={<StoreOrderDetailPage />} />
          <Route path='products' element={<StoreProductsPage />} />
          <Route path='locations' element={<StoreLocationsPage />} />
          <Route path='payments' element={<StorePaymentsPage />} />
          <Route path='my-store' element={<StoreMyStorePage />} />
          <Route path='settings' element={<StoreSettingsPage />} />
        </Route>

        {/* Create Product Route - Without Layout */}
        <Route
          path='/store/products/new'
          element={
            <ProtectedRoute requiredRoles={[UserRole.StoreOwner]}>
              <CreateProductPage />
            </ProtectedRoute>
          }
        />

        {/* Edit Product Route - Without Layout */}
        <Route
          path='/store/products/:id'
          element={
            <ProtectedRoute requiredRoles={[UserRole.StoreOwner]}>
              <CreateProductPage />
            </ProtectedRoute>
          }
        />

        {/* Customer Routes with Layout */}
        <Route path='/' element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path='products' element={<SearchProductPage />} />
          <Route path='products/:id' element={<ProductDetailPage />} />
          <Route path='cart' element={<CartPage />} />
          <Route
            path='checkout'
            element={
              <Elements stripe={stripePromise}>
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              </Elements>
            }
          />
          <Route
            path='dashboard'
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='dashboard/order-history'
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='dashboard/order-history/:subOrderId'
            element={
              <ProtectedRoute>
                <CustomerOrderDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Redirect unknown routes to home */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
