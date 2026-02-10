'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';

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
    <div className="min-h-screen bg-[#1a0e2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 font-logo">
              Sign in to <span className="text-white">Intelligent</span><span className="spm-glow">SPM</span>
            </h1>
            <p className="text-[#CBD5E1]">
              Corporate email required for analysis access
            </p>
          </div>

          {/* LinkedIn Button */}
          <button
            onClick={handleLinkedInSignIn}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-[#0A66C2] text-white font-bold rounded-xl hover:bg-[#0A66C2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LinkedInIcon className="w-6 h-6" />
            {isLoading ? 'Connecting...' : 'Continue with LinkedIn'}
          </button>

          {/* Info */}
          <div className="mt-6 p-4 bg-[#1a0e2e] rounded-lg">
            <h3 className="text-sm font-medium text-[#38BDF8] mb-2">Why LinkedIn?</h3>
            <ul className="text-sm text-[#CBD5E1] space-y-1">
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
