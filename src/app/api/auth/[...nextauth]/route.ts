// pages/api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { authOptions } from "@/lib/authOptions";



const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
