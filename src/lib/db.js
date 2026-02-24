import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis;

// 1. Create a standard PostgreSQL connection pool using your environment variable
const pool = globalForPrisma.pool || new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. Wrap that pool in the new Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter directly into the client to satisfy the new configuration rules
export const db = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
  globalForPrisma.pool = pool; // Cache the pool in development to prevent connection limits
}