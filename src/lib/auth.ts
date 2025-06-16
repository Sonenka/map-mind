import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        name: { label: "Name", type: "name" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        if (credentials.password !== user.password) return null;

        return { id: user.id, name: user.name, email: user.email };
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
  async session({ session, token, user }) {
    // Обновляем сессию из БД при каждом запросе
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (dbUser) {
      session.user.name = dbUser.name;
      session.user.email = dbUser.email;
    }
    
    return session;
  }
}
};
