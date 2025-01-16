import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RecentActivity() {
  const activities = [
    { id: 1, description: "Joined a new team", time: "2 hours ago" },
    { id: 2, description: "Won a match", time: "1 day ago" },
    { id: 3, description: "Created a new tournament", time: "3 days ago" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex justify-between items-start">
              <span className="text-sm">{activity.description}</span>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

