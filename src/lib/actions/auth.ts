"use server";

import { eq } from "drizzle-orm";
import db from "../db";
import { authUsersTable } from "../schema";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
) {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    // return { success: false, error: "Too many requests" };
    redirect("/too-fast");
  }

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      return { success: false, error: res.error };
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error creating user" };
  }
}

export async function signUp(params: AuthCredentials) {
  const { fullName, email, password, universityId, universityCard } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    // return { success: false, error: "Too many requests" };
    redirect("/too-fast");
  }

  const existingUser = await db
    .select()
    .from(authUsersTable)
    .where(eq(authUsersTable.email, email))
    .limit(1);

  if (existingUser[0]) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db
      .insert(authUsersTable)
      .values({
        fullName,
        email,
        password: hashedPassword,
        universityId,
        universityCard,
      })
      .returning();

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: {
        email,
        fullName,
      },
    });

    await signInWithCredentials({ email, password });
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error creating user" };
  }

  return { success: true };
}
