// app/auth/signup/page.tsx

"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default function SignUp() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    const { data: session, status } = useSession();
    useEffect(() => {
        // if(status === 'authenticated') {
        //     router.push("/dashboard")
        // }
        // console.log(session)
    }, [session])
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, name }),
        });
        // Call your API to create the user
        const data = await response.json();

        if (data.error) {
            setError(data.error)
        } else {
            const result = await signIn("credentials", {
                redirect: false, // Prevent automatic redirect to another page
                email,
                password,
            });
            if (result?.error) {
                setError(result.error);
            } else {
                router.push("/")
            }
        }
        setUserData(data)

    };

    if (status === 'loading')
        return <>Loading</>
    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}
