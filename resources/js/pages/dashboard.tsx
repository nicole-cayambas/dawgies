import { BreedList } from '@/components/breed/breed';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { breeds } = usePage().props as any;
    console.log(breeds);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Breeds</h1>

                {/* Card grid */}
                <BreedList breeds={breeds.data} />

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-center gap-4">
                    {breeds.current_page > 1 && (
                        <Link
                            href={`?page=${breeds.current_page - 1}`}
                            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                        >
                            Prev
                        </Link>
                    )}

                    <span className="text-gray-700">
                        Page {breeds.current_page} of {breeds.last_page}
                    </span>

                    {breeds.current_page < breeds.last_page && (
                        <Link
                            href={`?page=${breeds.current_page + 1}`}
                            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                        >
                            Next
                        </Link>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
