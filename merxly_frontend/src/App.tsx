import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Auth/LoginPage';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/'
          element={
            isAuthenticated ? (
              <div className='p-8 text-center'>
                <h1 className='text-3xl font-bold text-neutral-900 mb-4'>
                  Welcome to Merxly!
                </h1>
                <p className='text-neutral-600 mb-4'>You are logged in.</p>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className='text-primary-600 hover:text-primary-700 font-medium'
                >
                  Logout
                </button>
              </div>
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
