import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Users, MessageCircle } from 'lucide-react'

export function Sidebar() {
  const teams = [
    { id: 1, name: "Red Dragons", unreadMessages: 3 },
    { id: 2, name: "Blue Tigers", unreadMessages: 0 },
    { id: 3, name: "Green Falcons", unreadMessages: 1 },
    { id: 4, name: "Yellow Lions", unreadMessages: 5 },
  ]

  return (
    <Card className="w-64 h-[calc(100vh-4rem)] fixed right-0 rounded-none border-l">
      <CardHeader>
        <CardTitle>My Teams</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-8rem)] px-4">
          {teams.map((team, index) => (
            <div key={team.id}>
              {index > 0 && <Separator className="my-2" />}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">{team.name}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                  {team.unreadMessages > 0 && (
                    <span className="text-xs font-medium text-primary">
                      {team.unreadMessages}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

