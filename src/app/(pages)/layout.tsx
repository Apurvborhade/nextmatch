
import localFont from "next/font/local";
import "../globals.css";


import { Inter } from "next/font/google";
import { Header } from "@/app/components/Header";
import { Sidebar } from "@/app/components/Sidebar";
import React from "react";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import UserInitializer from "../components/UserInitializer";

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies()
    const token = cookieStore.get('next-auth.session-token')?.value
    const user = await decode({
        token,
        secret: process.env.NEXTAUTH_SECRET as string
    })
    return (
        <div className={`min-h-screen  bg-background ${inter.className}`}>
            <Header />
            <div className="flex pt-16">
                <main className="overflow-auto p-4 md:p-8 w-full">
                    <div className="container mx-auto">
                        <UserInitializer user={user} />
                        {React.cloneElement(children as React.ReactElement, { user: user })}
                    </div>
                </main>
                {/* <Sidebar /> */}
            </div>
        </div>
    );
}
