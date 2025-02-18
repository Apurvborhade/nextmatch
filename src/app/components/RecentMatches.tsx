import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Match, useGetCompletedMatchesQuery } from '@/features/users/usersApi'
import { useEffect, useState } from 'react'

export default function RecentMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const { data, isLoading, error } = useGetCompletedMatchesQuery(null)
  useEffect(() => {
    if (data) {
      setMatches(data.data)
    }
  }, [data])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {matches && matches.length != 0 ? matches.map((match) => (
            <li key={match.id} className="flex justify-between items-start">
              <span className="text-sm">{match.team1.name} vs {match?.team2?.name}</span>
            </li>
          )) : (
            <p>There are no recent matches</p>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}

