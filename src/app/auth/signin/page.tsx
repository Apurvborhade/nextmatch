// app/auth/signin/page.tsx

"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("signin")
    // Call NextAuth's signIn method for credentials login
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    console.log(result)
    if (result?.error) {
      setError("Invalid credentials");
    } else {
      console.log("push")
      router.push("/")
    }
  };

  if (status === 'loading')
    return <>Loading</>

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
