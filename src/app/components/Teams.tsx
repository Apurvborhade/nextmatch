import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Teams = () => {
    const teams = [
        { id: 1, name: "Red Dragons ", playersQty: 12 },
        { id: 2, name: "Green Falcons", playersQty: 12 },
    ]
    return (
        <Card>
            <CardHeader>
                <CardTitle>Teams</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {teams.map((team) => (
                        <li key={team.id} className="flex justify-between items-start">
                            <span className="text-sm">{team.name}</span>
                            <span>{team.playersQty} players</span>
                        </li>
                    ))}

                </ul>
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