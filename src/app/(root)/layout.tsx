import { auth } from "@/auth";
import Header from "@/components/header";
import db from "@/lib/db";
import { authUsersTable } from "@/lib/schema";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { eq } from "drizzle-orm";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

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

    if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10))
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
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
