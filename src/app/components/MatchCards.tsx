"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Locate, MapPin, Plus, TrendingUp } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
const chartData = [
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function MatchCards() {
  const matches = [
    { id: 1, title: "Friendly Match", location: "Central Park", time: "Saturday, 15:00", teams: "Red Dragons vs Blue Tigers" },
    { id: 2, title: "Tournament Quarter-Final", location: "City Stadium", time: "Sunday, 14:30", teams: "Green Falcons vs Yellow Lions" },
    { id: 3, title: "Practice Game", location: "Community Field", time: "Monday, 18:00", teams: "Purple Pandas vs Orange Owls" },
  ]

  return (
    <div>
      <div className='flex justify-between items-start mb-1'>
        <h2 className="text-2xl font-bold mb-4">Open Matches</h2>
        <div className='flex gap-2'>
          <Button>New match <Plus /></Button>
          <Select defaultValue='all'>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdByMe">Created by Me</SelectItem>
              <SelectItem value="joined">Joined Matches</SelectItem>
              <SelectItem value="pending">Pending Matches</SelectItem>
              <SelectItem value="completed">Completed Matches</SelectItem>
              <SelectItem value="upcoming">Upcoming Matches</SelectItem>
              <SelectItem value="all">All Matches</SelectItem>

            </SelectContent>
          </Select>
        </div>

      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {matches.map((match) => (
          <Card key={match.id} className=''>
            <CardHeader className='flex flex-row justify-between'>
              <div>
                <CardTitle>{match.title}</CardTitle>
                <CardDescription>Madrid, 6h ago</CardDescription>
              </div>
            </CardHeader>
            <CardContent className='flex flex-row justify-between'>
              <div>
                <p className='flex items-center'><MapPin className='scale-75' /><span className='opacity-75 ml-2 text-sm'> Hk Turf</span></p>
                <p className='flex items-center'><Clock className='scale-75' /><span className='opacity-75 ml-2 text-sm'>Tue, 3:00 Pm</span></p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className='mr-2 rounded-full bg-white text-black border border-black shadow-none hover:bg-black hover:text-white'>View</Button>
              <Button className='rounded-full'>
                Send Match Request
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

