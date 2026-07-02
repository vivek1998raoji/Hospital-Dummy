import { PrismaClient } from '@prisma/client';
import path from 'path';

let prisma;

if (process.env.NODE_ENV === 'production') {
  // Dynamically resolve the absolute path to SQLite file using process.cwd()
  // Works flawlessly during Vercel Build Phase and Vercel Runtime Phase!
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  const databaseUrl = `file:${dbPath}`;

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
