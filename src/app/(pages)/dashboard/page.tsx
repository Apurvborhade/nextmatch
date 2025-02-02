'use client'
import { Inter } from 'next/font/google'

import { UserStats } from '@/app/components/UserStats'
import { RecentActivity } from '@/app/components/RecentActivity'
import { TodayMatches } from '@/app/components/TodayMatches'
import Teams from '@/app/components/Teams'
import RecentMatches from '@/app/components/RecentMatches'
import { useEffect } from 'react'
import { decode } from 'next-auth/jwt'
import { storeUser } from '@/features/users/userSlice'
import { useDispatch } from 'react-redux'


const inter = Inter({ subsets: ['latin'] })


export default function DashboardLayout({
    children
}: {
   children:React.ReactElement
}) {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3 relative">
                <div className="md:col-span-2">
                    <UserStats />
                </div>
                <div className="space-y-4 grid md:grid-rows-3">
                    <RecentActivity />
                    <TodayMatches />
                    <Teams />
                </div>
            </div>
            <RecentMatches />
        </div>
    )
}

