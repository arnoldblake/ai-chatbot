import pg from 'pg';
const { Pool } = pg;

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { DB_CONNECTION_STRING } from '$env/static/private';

const pool = new Pool({ connectionString: DB_CONNECTION_STRING });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
