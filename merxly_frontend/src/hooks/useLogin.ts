import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/enums';
import type { LoginRequest, LoginResponse } from '../types/api/auth';
import type { Response } from '../types/api/common';

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  return useMutation<Response<LoginResponse>, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.isSuccess && response.data) {
        login(response.data);

        const fromLocation = (location.state as { from?: Location })?.from;
        if (fromLocation) {
          navigate(fromLocation.pathname + fromLocation.search, {
            state: fromLocation.state,
            replace: true,
          });
          return;
        }

        // Role-based navigation
        const roles = response.data.roles;
        if (roles.includes(UserRole.Admin)) {
          navigate('/admin');
        } else if (roles.includes(UserRole.StoreOwner)) {
          navigate('/store');
        } else {
          navigate('/');
        }
      }
    },
  });
};
