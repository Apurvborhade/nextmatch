
import "../globals.css";


import { Inter } from "next/font/google";
import { Header } from "@/app/components/Header";
import React from "react";

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className={`min-h-screen  bg-background ${inter.className}`}>
            <Header />
            <div className="flex pt-16">
                <main className="overflow-auto p-4 md:p-8 w-full">
                    <div className="container mx-auto">
                        {children}
                    </div>
                </main>
                {/* <Sidebar /> */}
            </div>
        </div>
    );
}
