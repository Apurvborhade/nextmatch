'use client'

import { UserStats } from '@/app/components/UserStats'
import { RecentActivity } from '@/app/components/RecentActivity'
import { TodayMatches } from '@/app/components/TodayMatches'
import Teams from '@/app/components/Teams'
import RecentMatches from '@/app/components/RecentMatches'
import Link from 'next/link'
import { Button } from '@/components/ui/button'




export default function DashboardLayout() {
    return (
        <div className="space-y-8">
            <div className='flex items-center w-full'>

                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className='ml-auto'>
                    <Link href={'/matches'} className='mr-2'>
                        <Button variant={'outline'}>View all matches</Button>
                    </Link>
                    <Link href={'/dashboard/edit-profile'} className='ml-auto'>
                        <Button>Edit profile</Button>
                    </Link>
                </div>
            </div>

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

