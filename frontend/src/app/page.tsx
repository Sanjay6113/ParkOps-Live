import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">ParkOps Live</p>
            <h1 className="text-3xl font-bold">Choose your console</h1>
            <p className="text-sm text-slate-600">Admin Command Center or Guest Companion</p>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">Admin Command Center</h2>
            <p className="mt-2 text-sm text-slate-600">
              Manage rides, override status, view alerts, and respond to guest reports.
            </p>
          </Link>

          <Link
            href="/guest"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">Guest Companion</h2>
            <p className="mt-2 text-sm text-slate-600">
              Browse rides, see live wait times, and submit accuracy reports.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
