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
import { useRegister } from '../../hooks/useRegister';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const { mutate: registerMutation, isPending, error } = useRegister();

  const password = watch('password');

  const onSubmit = (data: RegisterFormData) => {
    registerMutation(data);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl text-center font-bold text-neutral-900'>
            Create an account
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-sm text-red-600'>
                {error.message || 'Registration failed. Please try again.'}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Input
                  id='firstName'
                  type='text'
                  label='First Name'
                  placeholder='John'
                  error={errors.firstName?.message}
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'First name cannot exceed 50 characters',
                    },
                  })}
                />
              </div>
              <div className='space-y-2'>
                <Input
                  id='lastName'
                  type='text'
                  label='Last Name'
                  placeholder='Doe'
                  error={errors.lastName?.message}
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Last name cannot exceed 50 characters',
                    },
                  })}
                />
              </div>
            </div>
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
            <div className='space-y-2'>
              <Input
                id='password'
                type='password'
                label='Password'
                placeholder='Create a password'
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
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      'Password must contain uppercase, lowercase, and number',
                  },
                })}
              />
            </div>
            <div className='space-y-2'>
              <Input
                id='confirmPassword'
                type='password'
                label='Confirm Password'
                placeholder='Confirm your password'
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />
            </div>
            <div className='text-xs text-neutral-500 bg-neutral-50 p-3 rounded-md border border-neutral-200'>
              By creating an account, you agree to our{' '}
              <Link to='/terms' className='text-primary-600 hover:underline'>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to='/privacy' className='text-primary-600 hover:underline'>
                Privacy Policy
              </Link>
              .
            </div>
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-2'>
          <div className='text-sm text-center text-neutral-500'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-primary-600 hover:text-primary-700 font-medium transition-colors'
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
