import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Auth/LoginPage';
import { HomePage } from './pages/Home';
import { SearchProductPage, ProductDetailPage } from './pages/Customer';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StoreOwnerLayout } from './components/layout';
import { CustomerLayout } from './components/layout/customer';
import {
  StoreHomePage,
  StoreOrdersPage,
  StoreProductsPage,
  StoreSettingsPage,
} from './pages/Store';
import { CreateProductPage } from './pages/Store/CreateProductPage';
import { UserRole } from './types/enums';
import { StoreLocationsPage } from './pages/Store/StoreLocationsPage';
import { StorePaymentsPage } from './pages/Store/StorePaymentsPage';
import { StoreMyStorePage } from './pages/Store/StoreMyStorePage';
import { SignUpNewStorePage } from './pages/SignUpNewStorePage';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/sign-up-new-store' element={<SignUpNewStorePage />} />

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
        </Route>

        {/* Redirect unknown routes to home */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
