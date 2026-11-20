/**
 * Administrator bootstrap.
 *
 * There is no default account and no password in the source tree. The first super administrator is
 * created from environment variables:
 *
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:seed
 *
 * The password is checked against the same policy the application enforces and is stored as a
 * scrypt hash. Re-running the script does not overwrite an existing account.
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword, passwordPolicyIssues } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Municipal Administrator";

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set. No account was created.");
    process.exitCode = 1;
    return;
  }
  const issues = passwordPolicyIssues(password);
  if (issues.length) {
    console.error(`ADMIN_PASSWORD does not meet the policy: ${issues.join(" ")}`);
    process.exitCode = 1;
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`An account already exists for ${email}. Nothing changed.`);
    return;
  }

  const user = await prisma.user.create({
    data: { email, name, role: "SUPER_ADMIN", passwordHash: await hashPassword(password) },
  });
  await prisma.auditLog.create({
    data: {
      actorId: user.id, actorEmail: email, action: "USER_BOOTSTRAPPED", entityType: "User",
      entityId: user.id, summary: "Initial super administrator created by the seed script.",
    },
  });
  console.log(`Created super administrator ${email}. Sign in at /admin/login and change the password.`);
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
