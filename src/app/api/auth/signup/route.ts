// pages/api/auth/signup.ts

import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";
import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        console.log(email, password, name)
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


        return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
    } catch (error) {
        return errorHandler(error)
    }
}
