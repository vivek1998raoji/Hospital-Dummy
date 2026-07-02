import { PrismaClient } from '@prisma/client';

// Reuse a single PrismaClient across hot reloads in dev and across warm
// serverless invocations in production. The connection string comes from the
// DATABASE_URL_UNPOOLED env var (see prisma/schema.prisma).
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
