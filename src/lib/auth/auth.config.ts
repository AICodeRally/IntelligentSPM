/**
 * NextAuth Configuration
 *
 * LinkedIn OAuth + Email magic link authentication.
 * Following aicr patterns with JWT strategy.
 */

import type { NextAuthConfig } from 'next-auth';
import LinkedIn from 'next-auth/providers/linkedin';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma, isDatabaseConfigured } from '@/lib/db/prisma';

// Check if LinkedIn OAuth is configured
function isLinkedInConfigured(): boolean {
  return !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);
}

// Build providers list conditionally
function getProviders(): NextAuthConfig['providers'] {
  const providers: NextAuthConfig['providers'] = [];

  if (isLinkedInConfigured()) {
    providers.push(
      LinkedIn({
        clientId: process.env.LINKEDIN_CLIENT_ID!,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
        authorization: {
          params: {
            scope: 'openid profile email',
          },
        },
      })
    );
  }

  return providers;
}

// Personal email domains to reject
const PERSONAL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'me.com', 'mac.com', 'live.com', 'msn.com',
  'protonmail.com', 'proton.me', 'mail.com', 'ymail.com', 'gmx.com',
  'gmx.net', 'zoho.com', 'fastmail.com', 'tutanota.com', 'hey.com',
];

function isPersonalEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return PERSONAL_DOMAINS.includes(domain);
}

function extractDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() || '';
}

// Get secret with development fallback
function getSecret(): string {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET;
  }
  // Development fallback - DO NOT use in production
  if (process.env.NODE_ENV === 'development') {
    console.warn('[auth] NEXTAUTH_SECRET not set, using development fallback');
    return 'dev-secret-do-not-use-in-production-12345';
  }
  throw new Error('NEXTAUTH_SECRET is required in production');
}

export const authConfig: NextAuthConfig = {
  // Only use database adapter if DATABASE_URL is configured
  adapter: isDatabaseConfigured() ? PrismaAdapter(prisma) : undefined,

  // Only include providers that are configured
  providers: getProviders(),

  // Secret for JWT encryption
  secret: getSecret(),

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email;

      if (!email) {
        console.warn('Sign-in attempted without email');
        return false;
      }

      // Reject personal emails
      if (isPersonalEmail(email)) {
        console.warn(`Rejected personal email: ${email}`);
        return '/auth/error?error=PersonalEmail';
      }

      // If database is configured, handle company/user creation
      if (isDatabaseConfigured()) {
        const domain = extractDomain(email);

        try {
          // Get or create company
          let company = await prisma.company.findUnique({
            where: { domain },
          });

          if (!company) {
            company = await prisma.company.create({
              data: { domain },
            });
          }

          // Check company analysis limit
          if (company.analysisCount >= company.maxAnalyses) {
            console.warn(`Company limit reached for ${domain}`);
            // Still allow sign-in but they won't be able to run analysis
          }

          // Update user with LinkedIn data if LinkedIn sign-in
          if (account?.provider === 'linkedin' && profile) {
            await prisma.user.upsert({
              where: { email },
              update: {
                linkedinId: profile.sub,
                linkedinUrl: `https://linkedin.com/in/${profile.sub}`,
                linkedinData: profile as object,
                name: user.name,
                verifiedAt: new Date(),
              },
              create: {
                email,
                linkedinId: profile.sub,
                linkedinUrl: `https://linkedin.com/in/${profile.sub}`,
                linkedinData: profile as object,
                name: user.name,
                companyId: company.id,
                verifiedAt: new Date(),
              },
            });
          }

          // Log the sign-in
          await prisma.auditLog.create({
            data: {
              eventType: 'auth.login',
              message: `User signed in via ${account?.provider}`,
              email,
              companyDomain: domain,
              metadata: {
                provider: account?.provider,
                linkedinId: profile?.sub,
              },
            },
          });
        } catch (error) {
          console.error('Error during sign-in callback:', error);
          // Continue with sign-in even if DB operations fail
        }
      }

      return true;
    },

    async jwt({ token, user, account, profile }) {
      // First-time sign-in: populate token with user data
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      // Add LinkedIn data if available
      if (account?.provider === 'linkedin' && profile) {
        token.linkedinId = profile.sub ?? undefined;
      }

      // If database is configured, fetch user data
      if (isDatabaseConfigured() && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            include: { company: true },
          });

          if (dbUser) {
            token.userId = dbUser.id;
            token.companyId = dbUser.companyId;
            token.companyDomain = dbUser.company.domain;
            token.analysisUsed = dbUser.analysisUsed;
            token.companyAnalysisCount = dbUser.company.analysisCount;
            token.companyMaxAnalyses = dbUser.company.maxAnalyses;
          }
        } catch (error) {
          console.error('Error fetching user for JWT:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Expose token data to the session
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
        session.user.linkedinId = token.linkedinId as string | undefined;
        session.user.companyId = token.companyId as string | undefined;
        session.user.companyDomain = token.companyDomain as string | undefined;
        session.user.analysisUsed = token.analysisUsed as boolean | undefined;
        session.user.companyAnalysisCount = token.companyAnalysisCount as number | undefined;
        session.user.companyMaxAnalyses = token.companyMaxAnalyses as number | undefined;
      }

      return session;
    },
  },

  events: {
    async signIn({ user, account }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`);
    },
  },
};

export default authConfig;
