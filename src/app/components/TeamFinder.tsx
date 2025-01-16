import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function TeamFinder() {
  const teams = [
    { id: 1, name: "Red Dragons", location: "New York", players: 22 },
    { id: 2, name: "Blue Tigers", location: "Los Angeles", players: 20 },
    { id: 3, name: "Green Falcons", location: "Chicago", players: 21 },
  ]

  return (
    <Card className="col-span-2 md:col-span-1">
      <CardHeader>
        <CardTitle>Find a Team</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex space-x-2 mb-4">
          <Input placeholder="Search teams..." className="flex-grow" />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{team.name}</h3>
                <p className="text-sm text-muted-foreground">{team.location}</p>
              </div>
              <span className="text-sm">{team.players} players</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

