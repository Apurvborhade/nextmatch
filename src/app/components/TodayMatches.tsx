import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function TodayMatches() {
  const matches = [
    { id: 1, teams: "Red Dragons vs Blue Tigers", time: "14:00" },
    { id: 2, teams: "Green Falcons vs Yellow Lions", time: "16:30" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {matches.map((match) => (
            <li key={match.id} className="flex justify-between items-start">
              <span className="text-sm">{match.teams}</span>
              <span className="text-xs text-muted-foreground">{match.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

