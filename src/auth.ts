import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import db from "./lib/db";
import { eq } from "drizzle-orm";
import { authUsersTable } from "./lib/schema";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialProvider({
      name: "Credentials",

      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const user = await db
          .select()
          .from(authUsersTable)
          .where(eq(authUsersTable.email, credentials.email.toString()))
          .limit(1);

        if (!user[0]) {
          return null;
        }

        const isValid = await compare(
          credentials.password.toString(),
          user[0].password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].fullName,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
      }
      return session;
    },
  },
});
