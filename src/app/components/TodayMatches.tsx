
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import CreateMatchDialog from './CreateMatchDialog'
import { Match, useGetMatchesQuery } from '@/features/users/usersApi'
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
export function TodayMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const { data, isLoading, error } = useGetMatchesQuery(null);

  const formatDate = (dateString: string) => {
    // format
    return format(dateString, 'h:mm a')
  }
  useEffect(() => {
    if (data) {
      setMatches(data.data)
    }
  }, [data])
  return (
    <Card className='flex flex-col justify-between'>
      <div>
        <CardHeader>
          <CardTitle>Today's Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {isLoading && (
              <>
                <Skeleton className="w-full h-[20px] rounded-full" />
                <Skeleton className="w-full mt-3 h-[20px] rounded-full" />
              </>
            )}
            {matches && matches.map((match) => (
              <li key={match.id} className="flex justify-between items-start">
                <div className="flex items-center w-auto gap-5">
                  <span className="text-sm md:mr-1">{match.team1.name}</span> vs
                  <span className="text-sm">{match.team2 ? match.team2.name : 'TBD'}</span>
                </div>
                <span className="text-xs text-muted-foreground">{match.date && formatDate(match.date)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </div>
      <CardFooter className=''>
        <CreateMatchDialog />
      </CardFooter>
    </Card>
  )
}

