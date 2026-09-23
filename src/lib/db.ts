import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

function resolveSqliteUrl(databaseUrl: string): string {
  if (!databaseUrl.startsWith("file:")) {
    return databaseUrl;
  }

  const filePath = databaseUrl.replace(/^file:/, "");

  if (path.isAbsolute(filePath)) {
    return databaseUrl;
  }

  return `file:${path.join(process.cwd(), filePath.replace(/^\.\//, ""))}`;
}

function createPrismaClient() {
  const databaseUrl = resolveSqliteUrl(
    process.env.DATABASE_URL ?? "file:./dev.db",
  );
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
