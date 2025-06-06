import prisma from "@/app/lib/prisma";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            // @ts-expect-error - CredentialsProvider type definition is incomplete
            async authorize(credentials): Promise<{
                id: string;
                name: string;
                email: string;
                password: string;
                role: 'USER' | 'ADMIN' | null;
                createdAt: Date;
                updatedAt: Date;
                age: number | null;
                bio: string | null;
                position: string | null;
            }> {
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
        async redirect({ baseUrl }) {
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
                secure: process.env.NODE_ENV === "production" && process.env.NEXTAUTH_URL?.startsWith("https"),
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};