import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __alisnapPrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__alisnapPrisma__ ??
  new PrismaClient({
    log: ["warn", "error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__alisnapPrisma__ = prisma;
}

