import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, User, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { onboardingSchema, type OnboardingFormData } from '@/lib/validations';
import { FirmsService } from '@/services/firmsService';
import { AuthService } from '@/services/authService';

const steps = ['Firm Details', 'Your Profile'];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  });

  const handleNext = async () => {
    const valid = await trigger(['firm_name', 'firm_email']);
    if (valid) setStep(1);
  };

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setLoading(true);
      setError('');
      const session = await AuthService.getSession();
      if (!session) throw new Error('No session found');
      await FirmsService.create(data, session.user.id);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 font-bold text-white">
            CA
          </div>
          <span className="text-xl font-bold text-primary-700">CA BUDDY</span>
        </div>

        {/* Stepper */}
        <div className="mb-8 flex items-center justify-center gap-4">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                i < step ? 'bg-success text-white' :
                i === step ? 'bg-accent-500 text-white' :
                'bg-neutral-200 text-neutral-500'
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${i === step ? 'text-neutral-900' : 'text-neutral-400'}`}>
                {label}
              </span>
              {i < steps.length - 1 && <div className="mx-2 h-px w-12 bg-neutral-200" />}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-card">
          {error && (
            <div className="mb-4 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 0 ? (
              <div className="space-y-4">
                <div className="mb-4 flex items-center gap-2 text-primary-700">
                  <Building2 className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Firm Details</h3>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Firm Name *</label>
                  <Input {...register('firm_name')} placeholder="e.g. ABC & Associates" />
                  {errors.firm_name && <p className="mt-1 text-xs text-danger">{errors.firm_name.message}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Firm Email *</label>
                  <Input {...register('firm_email')} type="email" placeholder="firm@example.com" />
                  {errors.firm_email && <p className="mt-1 text-xs text-danger">{errors.firm_email.message}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Phone</label>
                  <Input {...register('firm_phone')} placeholder="9876543210" />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">GSTIN</label>
                  <Input {...register('gstin')} placeholder="22AAAAA0000A1Z5" />
                  {errors.gstin && <p className="mt-1 text-xs text-danger">{errors.gstin.message}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Address</label>
                  <textarea
                    {...register('firm_address')}
                    rows={2}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                    placeholder="Office address"
                  />
                </div>

                <Button type="button" onClick={handleNext} className="w-full bg-accent-500 text-white hover:bg-accent-600">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-4 flex items-center gap-2 text-primary-700">
                  <User className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Your Profile</h3>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Your Full Name *</label>
                  <Input {...register('contact_name')} placeholder="e.g. CA Rajesh Kumar" />
                  {errors.contact_name && <p className="mt-1 text-xs text-danger">{errors.contact_name.message}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(0)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 bg-accent-500 text-white hover:bg-accent-600">
                    {loading ? 'Setting up...' : 'Set Up My Firm'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
