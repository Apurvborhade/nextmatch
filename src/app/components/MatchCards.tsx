"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Match } from '@/features/users/usersApi'
import { useEffect, useState } from 'react'
import { RootState } from '../store'
import { useSelector } from 'react-redux'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import CreateMatchDialog from './CreateMatchDialog'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import MatchRequestDialog from './MatchRequestDialog'

export function MatchCards({ matches, isLoading }: { matches: Match[], isLoading: boolean }) {

  const [filteredMatches, setFilteredMatches] = useState<Match[]>(matches)
  const user = useSelector((state: RootState) => state.user.user)
  useEffect(() => {
    if (matches) setFilteredMatches(matches)
  }, [matches])
  const filterMatches = (status: string) => {
    if (status === 'createdByMe') {
      setFilteredMatches(matches.filter((match) => match.team1.captainId === user?.id))
    } else if (status === 'all') {
      setFilteredMatches(matches)
    } else {
      setFilteredMatches(matches.filter((match) => match.status === status))
    }
  }
  const selectValueChange = (value: string) => {
    filterMatches(value)
  }
  return (
    <div>
      <div className='flex justify-between items-start mb-1'>
        <h2 className="text-2xl font-bold mb-4">Open Matches</h2>
        <div className='flex gap-2'>
          <CreateMatchDialog />
          <Select defaultValue='all' onValueChange={selectValueChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Matches</SelectItem>
              <SelectItem value="createdByMe">Created by Me</SelectItem>
              <SelectItem value="joined">Joined Matches</SelectItem>
              <SelectItem value="active">Pending Matches</SelectItem>
              <SelectItem value="completed">Completed Matches</SelectItem>
              <SelectItem value="upcoming">Upcoming Matches</SelectItem>

            </SelectContent>
          </Select>
        </div>

      </div>

      {filteredMatches && !isLoading && filteredMatches.length === 0 && (
        <div className="w-full min-h-[70vh] flex justify-center items-center">
          <h2 className="text-2xl">No matches found :( </h2>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3 ">
        {isLoading && (
          <>

            <Card className=''>
              <CardHeader className='flex flex-row justify-between'>
                <div className='w-full'>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardHeader>
              <CardContent className='flex flex-row justify-between'>
                <div>
                  <Skeleton className="h-4 w-[120px] mb-2" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-[80px] rounded-full mr-2" />
                <Skeleton className="h-9 w-[140px] rounded-full" />
              </CardFooter>
            </Card>
            <Card className=''>
              <CardHeader className='flex flex-row justify-between'>
                <div className='w-full'>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardHeader>
              <CardContent className='flex flex-row justify-between'>
                <div>
                  <Skeleton className="h-4 w-[120px] mb-2" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-[80px] rounded-full mr-2" />
                <Skeleton className="h-9 w-[140px] rounded-full" />
              </CardFooter>
            </Card>
            <Card className=''>
              <CardHeader className='flex flex-row justify-between'>
                <div className='w-full'>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardHeader>
              <CardContent className='flex flex-row justify-between'>
                <div>
                  <Skeleton className="h-4 w-[120px] mb-2" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-[80px] rounded-full mr-2" />
                <Skeleton className="h-9 w-[140px] rounded-full" />
              </CardFooter>
            </Card>
            <Card className=''>
              <CardHeader className='flex flex-row justify-between'>
                <div className='w-full'>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardHeader>
              <CardContent className='flex flex-row justify-between'>
                <div>
                  <Skeleton className="h-4 w-[120px] mb-2" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-[80px] rounded-full mr-2" />
                <Skeleton className="h-9 w-[140px] rounded-full" />
              </CardFooter>
            </Card>
          </>
        )}
        {filteredMatches.length != 0 && filteredMatches.map((match) => (
          <Card key={match.id} className=''>
            <CardHeader className='flex flex-row justify-between'>
              <div>
                <CardTitle>{match?.team1?.name}</CardTitle>
                <CardDescription>{format(match?.date, 'MMM do, h:mm:a')}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className='flex flex-row justify-between'>
              <div>
                <p className='flex items-center'><MapPin className='scale-75' /><span className='opacity-75 ml-2 text-sm'> {match?.location}</span></p>
                <p className='flex items-center'><Clock className='scale-75' /><span className='opacity-75 ml-2 text-sm'>Tue, 3:00 Pm</span></p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className='mr-2 rounded-full bg-white text-black border border-black shadow-none hover:bg-black hover:text-white'>View</Button>
              <Dialog>
                <DialogTrigger asChild>
                  {!match.team2 ? (
                    <Button className='rounded-full' disabled={user?.id === match.team1.captainId}>
                        {user?.id === match.team1.captainId ? 'Created by you': 'Send Match Request'}
                    </Button>
                  ):(
                    <Button className='rounded-full' disabled>
                      <p className="text-sm">Match confirmed</p>
                    </Button>
                  )}
                </DialogTrigger>
                <MatchRequestDialog  receiverId={match.team1.id} matchId={match.id}/>
              </Dialog>

            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

