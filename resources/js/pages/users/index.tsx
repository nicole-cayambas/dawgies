import AppLayout from '@/layouts/app-layout';
import users from '@/routes/users';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: users.index().url,
    },
];

export default function Users() {
    const { users } = usePage().props as any;

    console.log(users);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Users</h1>

                <table className="min-w-full overflow-hidden rounded-lg bg-background shadow">
                    <thead className="bg-background">
                        <tr>
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Likes</th>
                            <th className="px-4 py-2 text-left">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((user) => (
                            <tr key={user.id} className="border-b">
                                <td className="px-4 py-2">{user.id}</td>
                                <td className="px-4 py-2">{user.name}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.likes?.map((like) => like?.breed).join(', ')}</td>
                                <td className="px-4 py-2">
                                    {new Date(
                                        user.created_at,
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-4 flex justify-center space-x-2">
                    {Array.from(
                        { length: users.last_page },
                        (_, i) => i + 1,
                    ).map((page) => (
                        <Link
                            key={page}
                            href="/users"
                            as="button"
                            method="get"
                            data={{ page }}
                            className={`rounded px-3 py-1 ${
                                page === users.current_page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200'
                            }`}
                        >
                            {page}
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
