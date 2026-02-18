import type { NextAuthConfig } from "next-auth";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import authService from "@/services/auth.service";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 hari
  },
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Credentials Provider (email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // 🔹 login untuk dapatkan token
          const res = await authService.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });
          const token = res.data?.data;

          // 🔹 ambil user detail pakai token
          const userByToken = await authService.getUserByToken(token);
          const user = userByToken?.data.data;

          if (
            res.status === 200 &&
            token &&
            userByToken.status === 200 &&
            user.id
          ) {
            return { ...user, token };
          }

          return null;
        } catch (error) {
          console.log("Authorization error: ", error);

          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth sign in
      if (account?.provider === "google") {
        try {
          // For Google users, we'll create/get their account via API
          return true;
        } catch (error) {
          console.error("Google sign in error:", error);

          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      // 🔹 Pertama kali login → simpan data user ke token
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.username = user.username;
        token.name = user.name as string;
        token.role = user.role;
        token.accessToken = user.token;

        // For Google OAuth users
        if (account?.provider === "google") {
          token.provider = "google";
          // 🔹 Sync with backend and get internal JWT
          try {
            const res = await authService.googleLogin({
              email: user.email as string,
              name: user.name as string,
              photoUrl: user.image as string,
            });

            // If backend returns a token and user data, use it
            if (res.data?.data) {
              token.accessToken = res.data.data;
              // 🔹 Optional: fetch user data to get the latest role
              const userRes = await authService.getUserByToken(res.data.data);
              if (userRes.data?.data?.role) {
                token.role = userRes.data.data.role;
              }
            }
          } catch (error) {
            console.error("Backend sync failed:", error);
          }

          // Fallback role if still not set
          if (!token.role) {
            token.role =
              user.email === "ahmadfauzan280503@gmail.com" ? "admin" : "user";
          }
        }
      }

      // 🔹 Kalau ada update dari client → replace field yang dikirim
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.username) token.username = session.username;
        if (session.role) token.role = session.role;
      }

      return token;
    },
    async session({ session, token }) {
      // 🔹 Mapping token -> session
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.token = token.accessToken;
        session.user.provider = token.provider;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// For backwards compatibility
export const getSession = auth;
