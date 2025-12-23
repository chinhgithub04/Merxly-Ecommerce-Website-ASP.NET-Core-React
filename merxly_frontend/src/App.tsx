import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Auth/LoginPage';
import { HomePage } from './pages/Home';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StoreOwnerLayout } from './components/layout';
import {
  StoreHomePage,
  StoreOrdersPage,
  StoreProductsPage,
  StoreSettingsPage,
} from './pages/Store';
import { CreateProductPage } from './pages/Store/CreateProductPage';
import { UserRole } from './types/enums';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />

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

        {/* Home Route */}
        <Route path='/' element={<HomePage />} />

        {/* Redirect unknown routes to home */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
