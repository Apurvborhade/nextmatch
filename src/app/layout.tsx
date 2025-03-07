
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "./Provider";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import UserInitializer from "@/app/components/UserInitializer";
import { Toaster } from "@/components/ui/sonner";
import { ServiceInitializer } from "@/ServiceInitializer";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};



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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <Provider>
          <ServiceInitializer />
          <UserInitializer user={user} />
          <Toaster />
          {children}
        </Provider>
      </body>
    </html>
  );
}
