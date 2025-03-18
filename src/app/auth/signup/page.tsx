// app/auth/signup/page.tsx

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { useSession } from "next-auth/react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/app/components/Loader";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUp() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [, setUserData] = useState(null);
    const router = useRouter()
    const { data: session, status } = useSession();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });
            // Call your API to create the user
            const data = await response.json();
            setIsLoading(false)
            if (typeof data === 'object' && 'success' in data &&  !data.success) {
                throw new Error(data.message)
            } else {
                setUserData(data)
                toast.success("User registered successfully")
                const result = await signIn("credentials", {
                    redirect: false, // Prevent automatic redirect to another page
                    email,
                    password,
                });
                router.push('/dashboard')
            }
        } catch (error) {
            if (error && typeof error === 'object' && 'message' in error) {
                setError((error as any).message)
            }
            setIsLoading(false)
        }





    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6")}>
                    <Card className={`${status === 'loading' || isLoading ? 'opacity-55 pointer-events-none' : ''} relative`}>
                        {status === 'loading' || isLoading ? (
                            <Loader className="absolute right-1/2 top-1/2" />
                        ) : null}
                        <CardHeader>
                            <CardTitle className="text-2xl">Sign Up</CardTitle>
                            <CardDescription>
                                Enter Your details below to Signup
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter Name"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="m@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            <a
                                                href="#"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Sign Up
                                    </Button>
                                    {error && <div style={{ color: "red" }}>{error}</div>}
                                    <Button variant="outline" className="w-full">
                                        Login with Google
                                    </Button>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/auth/signin" className="underline underline-offset-4">
                                        Login
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
