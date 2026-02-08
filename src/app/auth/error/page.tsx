'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AlertTriangleIcon } from '@/components/icons';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, { title: string; message: string }> = {
    PersonalEmail: {
      title: 'Corporate Email Required',
      message: 'Personal email addresses (Gmail, Yahoo, Outlook, etc.) are not accepted. Please sign in with your corporate email address.',
    },
    CompanyLimit: {
      title: 'Company Limit Reached',
      message: 'Your company has reached the maximum number of analyses (3). Contact us for enterprise access.',
    },
    Configuration: {
      title: 'Configuration Error',
      message: 'There was a problem with the authentication configuration. Please try again later.',
    },
    AccessDenied: {
      title: 'Access Denied',
      message: 'You do not have permission to access this resource.',
    },
    Default: {
      title: 'Authentication Error',
      message: 'An error occurred during sign in. Please try again.',
    },
  };

  const errorInfo = errorMessages[error || ''] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 rounded-2xl p-8 shadow-xl text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangleIcon className="w-8 h-8 text-red-500" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-white mb-2">
            {errorInfo.title}
          </h1>
          <p className="text-[#94A3B8] mb-8">
            {errorInfo.message}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full px-6 py-3 bg-[#38BDF8] text-[#0F172A] font-bold rounded-xl hover:bg-[#38BDF8]/90 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-[#334155] text-white font-medium rounded-xl hover:bg-[#475569] transition-colors"
            >
              Return Home
            </Link>
          </div>

          {/* Contact */}
          {error === 'CompanyLimit' && (
            <p className="text-sm text-[#64748B] mt-6">
              Need more analyses?{' '}
              <a href="mailto:todd@intelligentspm.com" className="text-[#38BDF8] hover:underline">
                Contact us
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
