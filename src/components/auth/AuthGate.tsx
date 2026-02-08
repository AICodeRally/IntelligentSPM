'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { isPersonalEmail } from '@/lib/services/analysis-gate';
import { AlertTriangleIcon, LinkedInIcon } from '@/components/icons';
import { Divider } from '@/components/ui/Divider';

interface AuthGateProps {
  children: React.ReactNode;
  healthcheckType: 'spm' | 'governance' | 'comp-plan' | 'askspm';
  title: string;
  subtitle: string;
  onAuthComplete?: (email: string) => void;
}

interface GateStatus {
  allowed: boolean;
  reason?: string;
  code?: string;
  remainingCompanyAnalyses?: number;
}

/**
 * AuthGate Component
 *
 * Unified authentication gate for all healthchecks.
 * Supports LinkedIn OAuth and email-based auth.
 * Checks analysis limits before allowing access.
 */
export function AuthGate({
  children,
  healthcheckType,
  title,
  subtitle,
  onAuthComplete,
}: AuthGateProps) {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gateStatus, setGateStatus] = useState<GateStatus | null>(null);
  const [isCheckingGate, setIsCheckingGate] = useState(false);

  const checkGateStatus = useCallback(async (emailToCheck: string) => {
    setIsCheckingGate(true);
    try {
      const response = await fetch('/api/auth/check-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToCheck }),
      });

      const result = await response.json();
      setGateStatus(result);

      if (result.allowed && onAuthComplete) {
        onAuthComplete(emailToCheck);
      }
    } catch (err) {
      console.error('Error checking gate status:', err);
      // Allow on error for better UX
      setGateStatus({ allowed: true });
      if (onAuthComplete) {
        onAuthComplete(emailToCheck);
      }
    } finally {
      setIsCheckingGate(false);
    }
  }, [onAuthComplete]);

  // Check gate status when session is available
  useEffect(() => {
    if (session?.user?.email) {
      checkGateStatus(session.user.email);
    }
  }, [session?.user?.email, checkGateStatus]);

  const handleLinkedInSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn('linkedin', {
        callbackUrl: `/healthcheck/${healthcheckType}`,
      });
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to connect with LinkedIn. Please try again.');
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (isPersonalEmail(email)) {
      setError('Please use your corporate email address.');
      return;
    }

    setIsLoading(true);

    // Check gate status with email
    await checkGateStatus(email);

    setIsLoading(false);
  };

  // Loading state while checking session
  if (status === 'loading' || isCheckingGate) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#38BDF8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#94A3B8]">Checking access...</p>
        </div>
      </div>
    );
  }

  // User is authenticated and allowed
  if (session?.user && gateStatus?.allowed) {
    return <>{children}</>;
  }

  // User authenticated but blocked
  if (session?.user && gateStatus && !gateStatus.allowed) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangleIcon className="w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {gateStatus.code === 'USER_LIMIT' ? 'Analysis Already Used' : 'Company Limit Reached'}
            </h1>
            <p className="text-[#94A3B8]">{gateStatus.reason}</p>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-[#38BDF8]/20 text-center">
            <p className="text-[#94A3B8] mb-4">
              {gateStatus.code === 'USER_LIMIT'
                ? 'Each email address can only run one analysis.'
                : 'Your company has used all available analyses.'}
            </p>

            <a
              href="mailto:todd@intelligentspm.com?subject=Enterprise Access Request"
              className="inline-block px-6 py-3 bg-[#38BDF8] text-[#0F172A] font-bold rounded-xl hover:bg-[#38BDF8]/90 transition-colors"
            >
              Request Enterprise Access
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Gate screen - not authenticated
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-[#38BDF8] flex items-center justify-center text-2xl font-bold text-[#0F172A] mx-auto mb-6">
            {healthcheckType.toUpperCase().slice(0, 3)}
          </div>
          <h1 className="text-3xl font-bold text-[#E2E8F0] mb-3">{title}</h1>
          <p className="text-[#94A3B8]">{subtitle}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-8 border border-[#38BDF8]/20">
          {/* LinkedIn Sign In */}
          <button
            onClick={handleLinkedInSignIn}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-[#0A66C2] text-white font-bold rounded-xl hover:bg-[#0A66C2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LinkedInIcon className="w-6 h-6" />
            {isLoading ? 'Connecting...' : 'Continue with LinkedIn'}
          </button>

          <Divider label="or use email" />

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="work@company.com"
                required
                disabled={isLoading}
                className={`w-full bg-[#0F172A] border rounded-xl px-4 py-3 text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]/50 disabled:opacity-50 ${
                  error ? 'border-[#dc2626]' : 'border-[#38BDF8]/20'
                }`}
              />
              {error && <p className="text-[#dc2626] text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-[#38BDF8] text-[#0F172A] font-bold rounded-xl hover:bg-[#38BDF8]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Checking...' : 'Continue with Email'}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-[#0F172A] rounded-lg">
            <h3 className="text-sm font-medium text-[#38BDF8] mb-2">Why sign in?</h3>
            <ul className="text-sm text-[#94A3B8] space-y-1">
              <li>• Verifies your professional identity</li>
              <li>• One analysis per user</li>
              <li>• Results saved to your account</li>
            </ul>
          </div>

          <p className="text-[#64748B] text-xs text-center mt-4">
            Corporate email required. Personal emails not accepted.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthGate;
