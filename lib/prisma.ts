import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

const getPrismaUrl = () => {
  let url = process.env.DATABASE_URL || "";
  // If connection_limit is 1, replace it with 5 to prevent development deadlocks
  if (url.includes("connection_limit=1")) {
    url = url.replace("connection_limit=1", "connection_limit=5");
  }
  return url;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: getPrismaUrl(),
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
