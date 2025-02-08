import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Volleyball as SoccerBall } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/app/store"
import { useEffect } from "react"

export default function Header() {
  const { user } = useSelector((state: RootState) => state.user)
  useEffect(() => {},[user])
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 px-10">
          <SoccerBall className="h-8 w-8" />
          <span className="font-bold text-xl">NextMatch</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-6 text-sm font-medium">
          <Link href="#features">Features</Link>
          <Link href="#testimonials">Testimonials</Link>
          <Link href={user ? '/dashboard' : '/auth/signup'}>

            <Button>{user ? 'Dashboard' : 'Sign Up'}</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

