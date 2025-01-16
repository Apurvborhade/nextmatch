import { Inter } from 'next/font/google'
import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { UserStats } from '../../components/UserStats'
import { RecentActivity } from '../../components/RecentActivity'
import { TodayMatches } from '../../components/TodayMatches'
import { MatchCards } from '../../components/MatchCards'

const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3" style={{ height: '60vh' }}>
                <div className="md:col-span-2">
                    <UserStats />
                </div>
                <div className="space-y-4">
                    <RecentActivity />
                    <TodayMatches />
                </div>
            </div>
        </div>
    )
}

