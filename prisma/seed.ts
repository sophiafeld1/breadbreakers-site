import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { UserRole } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/db";

const MASTER_USERNAME = "master-access";

async function main() {
  const existing = await prisma.user.findUnique({
    where: { username: MASTER_USERNAME },
  });

  if (existing) {
    console.log("Master user already exists. Skipping seed.");
    return;
  }

  const password =
    process.env.MASTER_PASSWORD ?? randomBytes(18).toString("base64url");
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      username: MASTER_USERNAME,
      passwordHash,
      role: UserRole.MASTER,
    },
  });

  console.log("Master user created.");
  console.log(`Username: ${MASTER_USERNAME}`);

  if (process.env.MASTER_PASSWORD) {
    console.log("Password: set from MASTER_PASSWORD env var.");
  } else {
    console.log(`Password (save this — shown once): ${password}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
