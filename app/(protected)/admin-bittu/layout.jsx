import React from "react";
import Sidebar from "../../components/sideBarAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = "hellobittukumar12@gmail.com";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Not logged in
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  // Logged in but not the admin
  if (session.user.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-full bg-[#050507] overflow-hidden text-slate-200 font-sans selection:bg-blue-500/30">

      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto relative pt-[60px] lg:pt-0 bg-[#050507]">

        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

        {/* Premium Translucent Grid Pattern */}
        <div
          className="min-h-full w-full relative z-10"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {children}
        </div>

      </main>
    </div>
  );
}