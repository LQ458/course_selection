import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { UserRole } from "@/app/types";
import mongodbAdapter from "@/app/lib/auth/mongodb-adapter";

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
          // 验证输入
          const credentialsSchema = z.object({
            username: z.string().min(1, "用户名不能为空"),
            password: z.string().min(6, "密码不能少于6个字符"),
          });

          const validatedCredentials = credentialsSchema.parse(credentials);

          // 连接数据库
          await dbConnect();

          // 查找用户
          const user = await UserModel.findOne({
            username: validatedCredentials.username,
          }).select("+password");

          if (!user || !user.password) {
            return null;
          }

          // 验证密码
          const isPasswordValid = await user.comparePassword(
            validatedCredentials.password,
          );

          if (!isPasswordValid) {
            return null;
          }

          // 返回用户信息（不包含密码）
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            studentId: user.studentId || "",
            department: user.department || "",
            image: user.image || "",
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
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.studentId = user.studentId;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as UserRole;
        session.user.studentId = token.studentId as string;
        session.user.department = token.department as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
