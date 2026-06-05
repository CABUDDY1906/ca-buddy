import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { AuthLayout } from './components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthService } from '@/services/authService';
import { StaffService } from '@/services/staffService';
import { useAuth } from '@/hooks/useAuth';

const changePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      if (!user) {
        throw new Error('No active session found.');
      }
      setLoading(true);
      setError('');
      
      // Update the password in Supabase Auth
      await AuthService.updatePassword(data.password);
      
      // Update must_change_password flag in the staff table
      await StaffService.completePasswordChange(user.id);
      
      // Redirect to dashboard (or root which routes to dashboard)
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="mb-1 text-2xl font-bold text-neutral-900">Change Password</h2>
      <p className="mb-6 text-sm text-neutral-500">You must change your password before continuing</p>

      {error && (
        <div className="mb-4 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">New Password</label>
          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">Confirm New Password</label>
          <div className="relative">
            <Input
              {...register('confirm_password')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="mt-1 text-xs text-danger">{errors.confirm_password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-accent-500 text-white hover:bg-accent-600"
        >
          {loading ? 'Updating...' : (
            <>
              <KeyRound className="mr-2 h-4 w-4" />
              Update Password
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
