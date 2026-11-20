import { AdminHeading, fmtDateTime } from "@/components/admin/AdminHeading";
import { AdminForm, AdminField } from "@/components/admin/AdminForm";
import { saveUserAction, toggleUserAction } from "@/lib/actions/admin";
import { listAdminUsers } from "@/lib/admin-queries";
import { requirePermission } from "@/lib/auth/session";
import { ROLES, ROLE_LABELS } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const user = await requirePermission("users:manage");
  const rows = await listAdminUsers();
  const roleLabels = ROLES.map((r) => ROLE_LABELS[r]);

  return (
    <div>
      <AdminHeading
        title="User management"
        intro="Administrators are created here, never in source code. Passwords are hashed with scrypt and every change is audited."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <section className="border border-paper-line bg-white p-5">
          <h2 className="font-display text-[12px] font-bold uppercase tracking-[0.1em] text-green-900">Add an administrator</h2>
          <div className="mt-4">
            <AdminForm action={saveUserAction} submitLabel="Create user" pendingLabel="Creating…">
              <AdminField label="Full name" name="name" required />
              <AdminField label="Email address" name="email" type="email" required />
              <AdminField label="Role" name="role" value="Content Administrator" options={roleLabels} required />
              <AdminField label="Initial password" name="password" type="password" required hint="At least 12 characters with upper case, lower case, a number and a symbol. Share it out of band; the user should change it after first sign-in." />
            </AdminForm>
          </div>
        </section>

        <section>
          <div className="overflow-x-auto border border-paper-line bg-white">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">Administrator accounts</caption>
              <thead>
                <tr className="border-b border-paper-line bg-paper-warm">
                  {["Name", "Email", "Role", "Status", "Last sign-in", "Action"].map((h) => (
                    <th key={h} scope="col" className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id} className="border-b border-paper-line last:border-0">
                    <td className="px-3 py-3 text-[12px] font-semibold text-ink">{u.name}{u.id === user.id && <span className="ml-1.5 text-[10px] font-normal text-ink-muted">(you)</span>}</td>
                    <td className="px-3 py-3 break-all text-[11px] text-ink-soft">{u.email}</td>
                    <td className="px-3 py-3 text-[11px] text-ink-soft">{ROLE_LABELS[u.role as keyof typeof ROLE_LABELS] ?? u.role}</td>
                    <td className="px-3 py-3 text-[11px]">{u.isActive ? <span className="text-green-700">Active</span> : <span className="text-flag-red">Disabled</span>}</td>
                    <td className="px-3 py-3 text-[11px] text-ink-muted">{u.lastLoginAt ? fmtDateTime(u.lastLoginAt) : "Never"}</td>
                    <td className="px-3 py-3">
                      {u.id === user.id ? (
                        <span className="text-[10.5px] text-ink-muted">Cannot change own status</span>
                      ) : (
                        <form action={toggleUserAction}>
                          <input type="hidden" name="id" value={u.id} />
                          <button className="btn btn-ghost !py-1 !text-[10px]">{u.isActive ? "Disable" : "Re-enable"}</button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
            The last active super administrator cannot be disabled. Disabling an account deletes its sessions immediately.
          </p>
        </section>
      </div>
    </div>
  );
}
