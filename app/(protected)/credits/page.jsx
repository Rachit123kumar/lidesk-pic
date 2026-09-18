import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";
import Sidebar from "../../components/SIdeBar";
import { Receipt, History, AlertCircle, Clock } from "lucide-react";
import LocalTime from "../../components/Localtime"; // Adjust path as needed

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const payments = await prisma.payment.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      providerPaymentId: true,
      providerOrderId: true,
      coins: true,
      amount: true,
      currency: true,
      status: true,
      createdAt: true,
      plan: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto pt-20 lg:pt-10 p-5 md:p-8">
        <div className="max-w-6xl mx-auto pb-20">
          
          {/* Header Section */}
          <div className="mb-10 mt-4">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 px-4 py-2 rounded-full mb-6">
              <History size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold text-sm tracking-wide uppercase">
                Billing
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Payment History
            </h1>

            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
              Track your previous purchases, coin top-ups, and transaction statuses.
            </p>
          </div>

          {/* Main Content */}
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl p-16 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-full mb-6 border border-slate-100 dark:border-slate-800">
                <Receipt size={40} className="text-slate-400 dark:text-slate-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                No payments yet
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Your transaction history will appear here after your first purchase.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-5 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Plan</th>
                      <th className="px-6 py-5 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Coins</th>
                      <th className="px-6 py-5 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Amount</th>
                      <th className="px-6 py-5 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Status</th>
                      <th className="px-6 py-5 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Payment ID</th>
                      <th className="px-6 py-5 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors duration-150"
                      >
                        <td className="px-6 py-5 font-semibold text-slate-900 dark:text-white">
                          {payment.plan.name}
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg text-sm font-medium">
                            {payment.coins}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-semibold text-slate-900 dark:text-white">
                          {payment.currency} {(payment.amount / 100).toFixed(2)}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                              payment.status === "captured"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                : payment.status === "authorized"
                                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                                : payment.status === "failed"
                                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                                : payment.status === "refunded"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                                : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-mono text-sm text-slate-500 dark:text-slate-400">
                          {payment.providerPaymentId || (
                            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 font-sans font-medium">
                              <Clock size={14} /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap">
                          {/* Replaced server-side date formatting with the client component */}
                          <LocalTime date={payment.createdAt} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}