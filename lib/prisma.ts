import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || '';
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Use Turso libSQL driver adapter if a remote libsql/https URL is configured
  if (url.startsWith('libsql://') || url.startsWith('https://') || (authToken && !url.startsWith('file:'))) {
    const client = createClient({
      url,
      authToken,
    });
    const adapter = new PrismaLibSQL(client);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  // Fallback to local SQLite file for local development
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
