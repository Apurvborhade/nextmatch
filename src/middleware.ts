import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { apiMiddleware } from './app/middleware/api.middleware'
import { errorHandler } from './app/middleware/errorHandler'
import rateLimitMiddleware from './app/middleware/rateLimiter'

export { default } from "next-auth/middleware"

const secret = process.env.AUTH_SECRET
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret });
    const url = request.nextUrl
    

    
    try {

        if (token && (
            url.pathname.startsWith('/auth/signin') ||
            url.pathname.startsWith('/auth/signup')
        )) {

            return NextResponse.redirect(new URL('/matches', request.url))
        }

        if (!token && url.pathname === "/") {
            console.log("not Authenticated")
            return NextResponse.redirect(new URL('/auth/signin', request.url))
        }
        if (!token && url.pathname !== "/auth/signin" && url.pathname !== "/auth/signup" && url.pathname !== "/") {
            console.log("not Authenticated")
            console.log("Redirect")
            return NextResponse.redirect(new URL('/auth/signin', request.url), { status: 302 })
        }



        // Protected Route
        if (url.pathname.startsWith('/api')) {
            rateLimitMiddleware(request);
            return await apiMiddleware(request)
        }

        
        return NextResponse.next();
    } catch (error: Error | SyntaxError | unknown ) {
        return errorHandler(error)
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/auth/signin', '/auth/signup', '/api/matches', '/api/teams','/api/user','/api/user/matches','/api/user/completed-matches','/api/user/:path*','/api/matches/match-request/:path*'],
}