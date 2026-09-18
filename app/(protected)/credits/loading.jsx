import Sidebar from "../../components/SIdeBar";

export default function Loading() {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto pt-20 lg:pt-10 p-5 md:p-8">
        <div className="max-w-6xl mx-auto pb-20">
          
          {/* -----------------------------
              Header Skeleton
          ----------------------------- */}
          <div className="mb-10 mt-4 animate-pulse">
            {/* Pill Skeleton */}
            <div className="h-9 w-28 bg-indigo-100 dark:bg-indigo-500/20 rounded-full mb-6"></div>

            {/* Title Skeleton */}
            <div className="h-10 md:h-12 w-64 md:w-80 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4"></div>

            {/* Subtitle Skeleton */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="h-5 w-full max-w-xl bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              <div className="h-5 w-3/4 max-w-md bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            </div>
          </div>

          {/* -----------------------------
              Table Skeleton
          ----------------------------- */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden animate-pulse">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    {/* Render 6 header column skeletons matching original table */}
                    {[...Array(6)].map((_, i) => (
                      <th key={`th-skeleton-${i}`} className="px-6 py-5">
                        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {/* Render 5 skeleton rows */}
                  {[...Array(5)].map((_, rowIndex) => (
                    <tr key={`row-skeleton-${rowIndex}`}>
                      {/* Plan Skeleton */}
                      <td className="px-6 py-5">
                        <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                      </td>

                      {/* Coins Skeleton */}
                      <td className="px-6 py-5">
                        <div className="h-7 w-12 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                      </td>

                      {/* Amount Skeleton */}
                      <td className="px-6 py-5">
                        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                      </td>

                      {/* Status Badge Skeleton */}
                      <td className="px-6 py-5">
                        <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700"></div>
                      </td>

                      {/* Payment ID Skeleton */}
                      <td className="px-6 py-5">
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                      </td>

                      {/* Date Skeleton */}
                      <td className="px-6 py-5">
                        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}