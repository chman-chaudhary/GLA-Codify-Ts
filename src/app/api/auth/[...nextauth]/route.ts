import NextAuth from "next-auth";

import { AuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/db";

export const authOptions: AuthOptions = {
  //   Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      const email = user.email;
      if (!email) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email,
            name: user.name,
            image: user.image,
          },
        });
      }

      return true;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
