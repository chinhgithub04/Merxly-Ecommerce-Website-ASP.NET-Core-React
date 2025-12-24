import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
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
import { EMAIL_REGEX } from '../../utils/regex';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface ForgotPasswordFormData {
  email: string;
}

export const ForgotPasswordPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log('Forgot password form submitted (UI only):', data);
    // Simulate email sent
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8'>
        <Card className='w-full max-w-md'>
          <CardHeader className='space-y-1'>
            <div className='flex justify-center mb-4'>
              <div className='rounded-full bg-success-50 p-3'>
                <CheckCircleIcon className='h-12 w-12 text-success-600' />
              </div>
            </div>
            <CardTitle className='text-2xl text-center font-bold text-neutral-900'>
              Check your email
            </CardTitle>
            <CardDescription className='text-center'>
              We've sent password reset instructions to
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='text-center'>
              <p className='text-sm font-medium text-neutral-900'>
                {getValues('email')}
              </p>
            </div>
            <div className='text-sm text-neutral-600 bg-neutral-50 p-4 rounded-md border border-neutral-200'>
              <p className='mb-2'>
                If you don't see the email, check your spam folder or try again
                with a different email address.
              </p>
              <p>
                The password reset link will expire in 1 hour for security
                reasons.
              </p>
            </div>
            <Button
              onClick={() => setEmailSent(false)}
              variant='outline'
              className='w-full'
            >
              Try another email
            </Button>
          </CardContent>
          <CardFooter className='flex flex-col space-y-2'>
            <div className='text-sm text-center text-neutral-500'>
              Remember your password?{' '}
              <Link
                to='/login'
                className='text-primary-600 hover:text-primary-700 font-medium transition-colors'
              >
                Back to sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl text-center font-bold text-neutral-900'>
            Forgot your password?
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your email and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Input
                id='email'
                type='email'
                label='Email'
                placeholder='m@example.com'
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
            <div className='text-xs text-neutral-500 bg-neutral-50 p-3 rounded-md border border-neutral-200'>
              We'll send you an email with instructions to reset your password.
              If you don't have access to your email, please contact support.
            </div>
            <Button type='submit' className='w-full'>
              Send Reset Link
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-2'>
          <div className='text-sm text-center text-neutral-500'>
            Remember your password?{' '}
            <Link
              to='/login'
              className='text-primary-600 hover:text-primary-700 font-medium transition-colors'
            >
              Back to sign in
            </Link>
          </div>
          <div className='text-sm text-center text-neutral-500'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-primary-600 hover:text-primary-700 font-medium transition-colors'
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
