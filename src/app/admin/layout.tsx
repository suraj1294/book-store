import React, { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import db from "@/lib/db";
import { authUsersTable } from "@/lib/schema";
import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";
import "@/styles/admin.css";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  const isAdmin = await db
    .select({ isAdmin: authUsersTable.role })
    .from(authUsersTable)
    .where(eq(authUsersTable.id, Number(session.user.id)))
    .limit(1)
    .then((res) => res[0]?.isAdmin === "ADMIN");

  if (!isAdmin) redirect("/");

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} />

      <div className="admin-container">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};
export default Layout;
