import type { ReactNode } from 'react';
import { CheckCircle } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const features = [
  'GST Reconciliation & Filing',
  'Client & Task Management',
  'Secure Cloud Storage',
];

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden w-1/2 flex-col justify-center bg-primary-700 px-16 lg:flex">
        <div className="max-w-md">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500 text-lg font-bold text-white">
              CA
            </div>
            <h1 className="text-3xl font-bold text-white">CA BUDDY</h1>
          </div>
          <p className="mb-10 text-lg text-primary-200">
            Complete Practice Management for Chartered Accountants
          </p>
          <ul className="space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-primary-100">
                <CheckCircle className="h-5 w-5 shrink-0 text-accent-400" />
                <span className="text-base">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 font-bold text-white">
              CA
            </div>
            <span className="text-xl font-bold text-primary-700">CA BUDDY</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
