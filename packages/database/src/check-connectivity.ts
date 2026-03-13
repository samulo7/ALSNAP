import { prisma } from "./client";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL. Copy an app/api environment template before running db:check.");
  }

  await prisma.$connect();
  const result = await prisma.$queryRaw<Array<{ result: number }>>`SELECT 1 AS result`;

  console.log(JSON.stringify({ status: "ok", result: result[0]?.result ?? null }));
  await prisma.$disconnect();
}

void main().catch(async (error: unknown) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});

