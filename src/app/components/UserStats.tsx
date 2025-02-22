'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, } from '@/components/ui/card'
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useGetUserDataQuery } from '@/features/users/usersApi'
import { useEffect, useState } from 'react'

interface chartDataSkel {
  skill:string,
  desktop:number,
  mobile:number 
}
const chartConfig = {
  desktop: {
    label: "value",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig



export function UserStats() {
  const user = useSelector((state: RootState) => state.user.user);
  const [chartData,setChartData] = useState<chartDataSkel[]>()
  const { data } = useGetUserDataQuery(user?.id as string)


  useEffect(() => {
    if (data) {
      const skipkeys= new Set(['id','userId'])
      const graphData = Object.entries(data?.data?.skills ? data?.data?.skills : {})
      .filter(([key])=> !skipkeys.has(key))
      .map(([key,value]) => ({
        skill:key,
        desktop:value as number,
        mobile:value as number,
      })) 

      setChartData(graphData)

    }
  }, [data])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Card className='border-none shadow-none'>
          <CardHeader className="items-center pb-4">
            <CardTitle>Radar Chart</CardTitle>
            <CardDescription>
              Showing total visitors for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[350px]"
            >
              <RadarChart data={chartData}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <PolarAngleAxis dataKey="skill" />
                <PolarGrid />
                <Radar
                  dataKey="desktop"
                  fill="var(--color-desktop)"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  )
}

