/**
 * Prisma Client Singleton
 *
 * Following aicr patterns for Neon PostgreSQL.
 * Uses singleton pattern to prevent connection exhaustion during hot reload.
 */

import { PrismaClient } from '@prisma/client';

// Declare global for development hot-reload
declare global {
   
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });
};

// Use existing global instance in development, create new in production
export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

/**
 * Check if database is available
 */
export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

/**
 * Get a fresh Prisma client (for specific use cases)
 */
export function getPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be configured');
  }
  return prisma;
}

export default prisma;
