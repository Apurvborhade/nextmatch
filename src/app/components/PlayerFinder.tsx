import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function PlayerFinder() {
  const players = [
    { id: 1, name: "John Doe", position: "Forward", age: 25 },
    { id: 2, name: "Jane Smith", position: "Midfielder", age: 23 },
    { id: 3, name: "Mike Johnson", position: "Defender", age: 27 },
  ]

  return (
    <Card className="col-span-2 md:col-span-1">
      <CardHeader>
        <CardTitle>Find a Player</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex space-x-2 mb-4">
          <Input placeholder="Search players..." className="flex-grow" />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        <div className="space-y-4">
          {players.map((player) => (
            <div key={player.id} className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{player.name}</h3>
                <p className="text-sm text-muted-foreground">{player.position}</p>
              </div>
              <span className="text-sm">{player.age} years old</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

