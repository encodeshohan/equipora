import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { SuspendUserButton } from "@/components/dashboard/suspend-user-button"
import { UserRoleSelect } from "@/components/dashboard/user-role-select"
import { NativeSelect } from "@/components/shared/native-select"
import { Pagination } from "@/components/shared/pagination"
import { StatusPill } from "@/components/shared/status-pill"
import { UserAvatar } from "@/components/shared/user-avatar"
import { getAdminUsers } from "@/lib/api/admin"
import { getSession } from "@/lib/core/server"
import { formatDate } from "@/lib/formatters"
import { firstParam, pageParam } from "@/lib/page-params"
import { ROLE_META, USER_ROLES } from "@/lib/types/user"
import Link from "next/link"

export const metadata = { title: "All Users" }

const headClass =
    "px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-fg-secondary uppercase"
const cellClass = "px-4 py-3.5 align-middle whitespace-nowrap"

const ACTIVE = {
    label: "Active",
    className: "border-success/40 bg-success/10 text-success",
}
const SUSPENDED = {
    label: "Suspended",
    className: "border-error/40 bg-error/10 text-error",
}

export default async function AllUsersPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
    const raw = await searchParams
    const roleRaw = firstParam(raw.role)
    const role = (USER_ROLES as string[]).includes(roleRaw) ? roleRaw : ""
    const search = firstParam(raw.search).slice(0, 60)
    const current = pageParam(raw.page)

    const query = new URLSearchParams({ page: String(current), limit: "10" })
    if (role) query.set("role", role)
    if (search) query.set("search", search)

    const filterParams: Record<string, string> = {}
    if (role) filterParams.role = role
    if (search) filterParams.search = search

    const [session, result] = await Promise.all([
        getSession(),
        getAdminUsers(query.toString()),
    ])
    const myId = session?.user.id

    return (
        <PageContainer>
            <PageHeader
                overline="Admin"
                title="All Users"
                subtitle="Change roles and manage access for every account."
            />

            <form className="mb-4 flex flex-wrap items-end gap-3" role="search">
                <div className="flex min-w-56 flex-1 flex-col gap-2">
                    <label htmlFor="search" className="text-sm font-medium">
                        Search
                    </label>
                    <input
                        id="search"
                        name="search"
                        defaultValue={search}
                        maxLength={60}
                        placeholder="Search by name or email"
                        className="surface-field h-11 w-full rounded-lg border px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                    />
                </div>
                <div className="flex w-44 flex-col gap-2">
                    <label htmlFor="role" className="text-sm font-medium">
                        Role
                    </label>
                    <NativeSelect id="role" name="role" defaultValue={role}>
                        <option value="">All roles</option>
                        {USER_ROLES.map((item) => (
                            <option key={item} value={item}>
                                {ROLE_META[item].label}
                            </option>
                        ))}
                    </NativeSelect>
                </div>
                <button type="submit" className="btn-brand h-11 px-6">
                    Filter
                </button>
                <Link
                    href="/dashboard/admin/users"
                    className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-elevated"
                >
                    Reset
                </Link>
            </form>

            <section className="surface-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[56rem] text-left text-sm">
                        <thead className="bg-elevated">
                            <tr>
                                <th scope="col" className={headClass}>Name</th>
                                <th scope="col" className={headClass}>Email</th>
                                <th scope="col" className={headClass}>Role</th>
                                <th scope="col" className={headClass}>Registered</th>
                                <th scope="col" className={headClass}>Status</th>
                                <th scope="col" className={headClass}>Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.items.map((user) => {
                                const isMe = user.id === myId
                                return (
                                    <tr key={user.id} className="border-t border-border">
                                        <td className={cellClass}>
                                            <div className="flex items-center gap-3">
                                                <UserAvatar src={user.image} name={user.name} />
                                                <span className="block max-w-44 truncate font-medium">
                                                    {user.name}
                                                    {isMe ? (
                                                        <span className="ml-2 text-xs font-normal text-fg-muted">
                                                            (you)
                                                        </span>
                                                    ) : null}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={`${cellClass} text-fg-secondary`}>{user.email}</td>
                                        <td className={cellClass}>
                                            <UserRoleSelect
                                                key={`${user.id}-${user.role}`}
                                                userId={user.id}
                                                name={user.name}
                                                role={user.role}
                                                disabled={isMe}
                                            />
                                        </td>
                                        <td className={`${cellClass} text-fg-secondary`}>
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className={cellClass}>
                                            <StatusPill {...(user.banned ? SUSPENDED : ACTIVE)} />
                                        </td>
                                        <td className={cellClass}>
                                            {isMe || user.role === "admin" ? (
                                                <span className="text-fg-muted">-</span>
                                            ) : (
                                                <SuspendUserButton
                                                    userId={user.id}
                                                    name={user.name}
                                                    banned={user.banned}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {result.items.length === 0 ? (
                        <p className="p-10 text-center text-fg-secondary">No users found.</p>
                    ) : null}
                </div>
            </section>

            <p className="mt-4 text-xs text-fg-muted">
                Admin accounts cannot be suspended. Change their role first.
            </p>

            <Pagination
                basePath="/dashboard/admin/users"
                params={filterParams}
                page={result.page}
                totalPages={result.totalPages}
            />
        </PageContainer>
    )
}