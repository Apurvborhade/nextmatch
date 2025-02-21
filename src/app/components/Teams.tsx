import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useFindTeamsQuery } from '@/features/users/usersApi'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'

const Teams = () => {
    const { user } = useSelector((state: RootState) => state.user)
    const { data, isLoading } = useFindTeamsQuery(user?.id)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Teams</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[100px]">
                    <ul className="space-y-4">
                        {isLoading && (
                            <>
                                <Skeleton className="w-full h-[20px] rounded-full" />
                                <Skeleton className="w-full mt-3 h-[20px] rounded-full" />
                            </>
                        )}
                        {!isLoading && data?.data.map((team) => (
                            <li key={team.id} className="flex justify-between items-start">
                                <span className="text-sm">{team.name}</span>
                                <span>{team.players.length} players</span>
                            </li>
                        ))}

                    </ul>
                </ScrollArea>
            </CardContent>
            <CardFooter className='flex items-center gap-4'>
                <Link href="/teams/create" className='w-full'>
                    <Button className='w-full'>Join a Team</Button>
                </Link>
                <Link href="/teams/create" className='w-full'>
                    <Button className='w-full' variant={'outline'}>Create a Team</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

export default Teams