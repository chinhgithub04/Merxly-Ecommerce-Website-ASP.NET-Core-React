import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterRequest, LoginResponse } from '../types/api/auth';
import type { Response } from '../types/api/common';

export const useRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation<Response<LoginResponse>, Error, RegisterRequest>({
    mutationFn: registerUser,
    onSuccess: (response) => {
      if (response.isSuccess && response.data) {
        login(response.data);
        navigate('/');
      }
    },
  });
};
