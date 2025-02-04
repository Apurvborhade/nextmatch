import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RecentMatches() {
  const matches = [
    { id: 1, teams: "Red Dragons vs Blue Tigers", result: "Win" },
    { id: 2, teams: "Green Falcons vs Yellow Lions", result: "loss" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {matches.map((match) => (
            <li key={match.id} className="flex justify-between items-start">
              <span className="text-sm">{match.teams}</span>
              <span className={`text-xs text-muted-foreground ${match.result === 'Win' ? 'text-green-700' : 'text-red-700'} font-medium text-3xl`}>{match.result} (3-4)</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

