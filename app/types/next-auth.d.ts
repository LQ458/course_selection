import { DefaultSession, DefaultUser } from "next-auth";
import { UserRole } from "../types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: UserRole;
      studentId?: string;
      department?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username: string;
    role: UserRole;
    studentId?: string;
    department?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: UserRole;
    studentId?: string;
    department?: string;
  }
}
