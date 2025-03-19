import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import mongodbAdapter from "@/app/lib/auth/mongodb-adapter";
import { Session } from "next-auth";

// 检查用户是否为管理员
export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === "admin";
}

export const authOptions: NextAuthOptions = {
  adapter: mongodbAdapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        try {
          await dbConnect();

          const user = await UserModel.findOne({
            username: credentials?.username,
          }).select("+password");

          if (!user) {
            return null;
          }

          const isValid = await user.comparePassword(
            credentials?.password || "",
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            username: user.username,
          };
        } catch (error) {
          console.error("认证错误:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
