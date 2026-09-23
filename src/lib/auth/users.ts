import bcrypt from "bcryptjs";
import { UserRole, type User } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { decryptPassword, encryptPassword } from "@/lib/auth/password-vault";

export const MASTER_USERNAME = "master-access";

export type AuthUser = Pick<User, "id" | "username" | "role">;

export type MasterDashboardUser = AuthUser & {
  password: string | null;
};

export async function authenticateUser(
  username: string,
  password: string,
): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, role: true, passwordHash: true },
  });

  if (!user) {
    return null;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
}

export async function createDashboardUser(
  username: string,
  password: string,
): Promise<AuthUser> {
  const passwordHash = await bcrypt.hash(password, 12);
  const passwordEncrypted = encryptPassword(password);

  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      passwordEncrypted,
      role: UserRole.USER,
    },
    select: { id: true, username: true, role: true },
  });

  return user;
}

export async function updateDashboardUserPassword(
  userId: string,
  password: string,
): Promise<AuthUser> {
  const passwordHash = await bcrypt.hash(password, 12);
  const passwordEncrypted = encryptPassword(password);

  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash, passwordEncrypted },
    select: { id: true, username: true, role: true },
  });
}

export async function deleteDashboardUser(userId: string): Promise<void> {
  await prisma.user.delete({ where: { id: userId } });
}

export async function listDashboardUsers(): Promise<AuthUser[]> {
  return prisma.user.findMany({
    select: { id: true, username: true, role: true },
    orderBy: [{ role: "asc" }, { username: "asc" }],
  });
}

export async function listDashboardUsersForMaster(): Promise<MasterDashboardUser[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      passwordEncrypted: true,
    },
    orderBy: [{ role: "asc" }, { username: "asc" }],
  });

  return users.map((user) => ({
    id: user.id,
    username: user.username,
    role: user.role,
    password: decryptPassword(user.passwordEncrypted),
  }));
}

export async function countMasterUsers(): Promise<number> {
  return prisma.user.count({ where: { role: UserRole.MASTER } });
}

export function sessionRoleFromUser(role: UserRole): "master" | "user" {
  return role === UserRole.MASTER ? "master" : "user";
}
