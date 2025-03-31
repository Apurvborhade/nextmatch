// app/auth/signin/page.tsx

"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter,useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader } from "@/app/components/Loader";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchparams = useSearchParams()
  const { status } = useSession()
  const callbackUrl = searchparams.get('callbackUrl')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true)
    // Call NextAuth's signIn method for credentials login
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false)
    if (result?.error) {
      setError("Invalid credentials");
    } else {
      router.push(callbackUrl || '/dashboard')
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
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter Your details below to Signin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
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
                    Login
                  </Button>
                  {error && <div style={{ color: "red" }}>{error}</div>}
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/signup" className="underline underline-offset-4">
                    Sign up
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
