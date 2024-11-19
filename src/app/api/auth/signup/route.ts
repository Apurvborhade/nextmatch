// pages/api/auth/signup.ts

import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";
import { errorHandler } from "@/app/middleware/errorHandler";
import { signIn } from "next-auth/react";
import { AppError } from "@/utils/CustomError";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const { email, password, name } = req.body;

            if (!email || !password || !name) {
                throw new AppError("Missing required fields", 400, false)
            }

            // Check if the user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                throw new AppError("User already exists", 400, false);
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create new user
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });

            const result = await signIn("credentials", {
                redirect: false, // Prevent automatic redirect to another page
                email,
                password,
            });
            if (result?.error) {
                throw new AppError("Failed to sign in after registration", 500, false)
            }
            return res.status(201).json({ message: "User created", user: newUser });
        } else {
            throw new AppError("Method not allowed", 405, false)
        }
    } catch (error) {
        return errorHandler(error)
    }
}
