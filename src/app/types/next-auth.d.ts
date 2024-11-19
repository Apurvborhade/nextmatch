import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface User {
        id?: string,
        name?: string,
        email?: string,
        role?: string,
        createdAt?: Date,
        updatedAt?: Date,
        teams?:Array,
    }
    interface Session {
        user: {
            id?: string,
        name?: string,
        email?: string,
        role?: string,
        createdAt?: Date,
        updatedAt?: Date,
        teams?:Array,
        } & DefaultSession["user"]
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string,
        name?: string,
        email?: string,
        role?: string,
        createdAt?: Date,
        updatedAt?: Date,
        teams?:Array,
    }
}