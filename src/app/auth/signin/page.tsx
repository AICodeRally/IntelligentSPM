'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkedInSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('linkedin', { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Sign in to IntelligentSPM
            </h1>
            <p className="text-[#94A3B8]">
              Corporate email required for analysis access
            </p>
          </div>

          {/* LinkedIn Button */}
          <button
            onClick={handleLinkedInSignIn}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-[#0A66C2] text-white font-bold rounded-xl hover:bg-[#0A66C2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            {isLoading ? 'Connecting...' : 'Continue with LinkedIn'}
          </button>

          {/* Info */}
          <div className="mt-6 p-4 bg-[#0F172A] rounded-lg">
            <h3 className="text-sm font-medium text-[#38BDF8] mb-2">Why LinkedIn?</h3>
            <ul className="text-sm text-[#94A3B8] space-y-1">
              <li>• Verifies your professional identity</li>
              <li>• Corporate email validation</li>
              <li>• One-time analysis per user</li>
            </ul>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-[#64748B] mt-6">
            Personal email addresses (Gmail, Yahoo, etc.) are not accepted.
          </p>
        </div>
      </div>
    </div>
  );
}
