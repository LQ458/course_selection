import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./dbConnect";
import { User } from "../models";

/**
 * NextAuth配置选项
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnect();

          // 在实际应用中，这里应该进行密码验证
          // 为了简化，这里只通过邮箱查找用户
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          // 模拟密码验证成功
          // 在实际应用中，应该使用bcrypt等工具比较密码
          // const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          // if (!isValidPassword) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("认证错误:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

/**
 * 检查用户是否有管理员权限
 */
export function isAdmin(session: any) {
  return session?.user?.role === "admin";
}

/**
 * 获取当前用户ID
 */
export function getCurrentUserId(session: any) {
  return session?.user?.id || null;
}
