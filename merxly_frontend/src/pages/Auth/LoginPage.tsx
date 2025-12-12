import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import type { LoginRequest } from '../../types/api/auth';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/';
import { useLogin } from '../../hooks/useLogin';
import { EMAIL_REGEX } from '../../utils/regex';

export const LoginPage = () => {
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  const apiError = error?.message || null;

  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl text-center font-bold text-neutral-900'>
            Welcome back
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {apiError && (
              <div className='p-3 text-sm text-error-700 bg-error-50 border border-error-200 rounded-md'>
                {apiError}
              </div>
            )}
            <div className='space-y-2'>
              <Input
                id='email'
                type='email'
                label='Email'
                placeholder='m@example.com'
                disabled={isPending}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  maxLength: {
                    value: 100,
                    message: 'Email cannot exceed 100 characters',
                  },
                  pattern: {
                    value: EMAIL_REGEX,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>
            <div className='space-y-2'>
              <Input
                id='password'
                type='password'
                label='Password'
                placeholder='Enter your password'
                disabled={isPending}
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Password cannot exceed 100 characters',
                  },
                })}
              />
            </div>
            <Button type='submit' className='w-full' isLoading={isPending}>
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-2'>
          <div className='text-sm text-center text-neutral-500'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-primary-600 hover:text-primary-700 font-medium transition-colors'
            >
              Sign up
            </Link>
          </div>
          <div className='text-sm text-center'>
            <Link
              to='/forgot-password'
              className='text-neutral-500 hover:text-neutral-900 transition-colors'
            >
              Forgot your password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
