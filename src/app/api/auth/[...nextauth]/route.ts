// pages/api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error("User not found");
                }

                // Compare hashed password
                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                
                return user;
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin", // You can create a custom sign-in page
    },
    session: {
        strategy: "jwt",
        maxAge: 1 * 24 * 60 * 60,
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // Set JWT expiration to 30 days (in seconds)
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id?.toString()
                token.email = user.email
                token.name = user.name
                token.role = user.role
                token.createdAt = user.createdAt
                token.updatedAt = user.updatedAt
                token.teams = user.teams
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id?.toString()
                session.user.email = token.email
                session.user.name = token.name
                session.user.role = token.role
                session.user.createdAt = token.createdAt
                session.user.updatedAt = token.updatedAt
                session.user.teams = token.teams
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        }
    },
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production"
                ? "__Secure-next-auth.session-token"
                : "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
