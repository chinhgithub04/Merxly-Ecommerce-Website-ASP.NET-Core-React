import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import type { LoginRequest, LoginResponse } from '../types/api/auth';
import type { Response } from '../types/api/common';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation<Response<LoginResponse>, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.isSuccess && response.data) {
        login(response.data);
        navigate('/');
      }
    },
  });
};
