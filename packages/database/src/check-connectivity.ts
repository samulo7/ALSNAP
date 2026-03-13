import { prisma } from "./client";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL. Copy an app/api environment template before running db:check.");
  }

  await prisma.$connect();
  const result = await prisma.$queryRaw<Array<{ result: number }>>`SELECT 1 AS result`;

  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "info",
      service: "alisnap-database",
      action: "database.connectivity.check",
      traceId: "system",
      actorId: "system",
      targetType: "database",
      targetId: "primary",
      message: "Database connectivity check passed",
      context: {
        status: "ok",
        result: result[0]?.result ?? null
      }
    })
  );
  await prisma.$disconnect();
}

void main().catch(async (error: unknown) => {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      service: "alisnap-database",
      action: "database.connectivity.check",
      traceId: "system",
      actorId: "system",
      targetType: "database",
      targetId: "primary",
      message: error instanceof Error ? error.message : "Database connectivity check failed"
    })
  );
  await prisma.$disconnect();
  process.exit(1);
});
