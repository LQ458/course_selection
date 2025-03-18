"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole } from "../types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  image?: string;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user as AuthUser | undefined;
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const isAdmin = user?.role === UserRole.ADMIN;
  const isStudent = user?.role === UserRole.STUDENT;

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    isStudent,
    logout,
  };
}
