import db from "@/lib/db";
import { authUsersTable } from "@/lib/schema";
import { sendEmail } from "@/lib/workflow";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";

type InitialData = {
  email: string;
  fullName: string;
};

const MIN_IN_MS = 60 * 1000;
const HRS_IN_MS = 60 * MIN_IN_MS;
const DAY_IN_MS = 24 * HRS_IN_MS;
const THREE_DAYS_IN_MS = 3 * DAY_IN_MS;
const ONE_MONTH_IN_MS = 30 * DAY_IN_MS;

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  // welcome email
  await context.run("new-signup", async () => {
    await sendEmail({
      email,
      subject: "Welcome to the platform",
      message: `Hi ${fullName}, welcome to the platform.`,
    });

    //await sendEmail("Welcome to the platform", email);
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "Email to non-active users",
          message: `Hi ${fullName}, you have not been active for 3 days.`,
        });

        //await sendEmail("Email to non-active users", email);
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
          email,
          subject: "Send newsletter to active users",
          message: `Hi ${fullName}, you have been active for 3 days.`,
        });
        //await sendEmail("Send newsletter to active users", email);
      });
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});

type UserState = "non-active" | "active";

const getUserState = async (email: string): Promise<UserState> => {
  const user = await db
    .select()
    .from(authUsersTable)
    .where(eq(authUsersTable.email, email))
    .limit(1);

  if (user.length === 0) {
    return "non-active";
  }

  const lastActivityDate = new Date(user[0].lastActivityDate!);

  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();

  if (timeDifference > THREE_DAYS_IN_MS && timeDifference <= ONE_MONTH_IN_MS) {
    return "active";
  }

  return "non-active";
};
