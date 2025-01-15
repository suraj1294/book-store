import { ReactNode } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { after } from "next/server";
import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { authUsersTable } from "@/lib/schema";
import { Session } from "next-auth";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (session) redirect("/");

  after(async () => {
    if (!(session as Session | null)?.user?.id) return;

    // get the user and check if last activity date is today
    const user = await db
      .select()
      .from(authUsersTable)
      .where(
        eq(authUsersTable.id, Number((session as Session | null)?.user?.id))
      )
      .limit(1);

    if (user[0].lastActivityDate !== new Date().toISOString().slice(0, 10))
      return;

    // update last activity date
    await db
      .update(authUsersTable)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(
        eq(
          authUsersTable.id,
          Number((session as Session | null)?.user?.id ?? "")
        )
      );
  });

  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row gap-3">
            <Image src="/icons/logo.svg" alt="logo" width={37} height={37} />
            <h1 className="text-2xl font-semibold text-white">BookWise</h1>
          </div>

          <div>{children}</div>
        </div>
      </section>

      <section className="auth-illustration">
        <Image
          src="/images/auth-illustration.png"
          alt="auth illustration"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
      </section>
    </main>
  );
};

export default Layout;
