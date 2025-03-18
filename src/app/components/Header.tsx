'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BellDot, MessageSquare, User, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import useSocket from '../hooks/useSocket'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import React from 'react'
import { useGetNotificationsQuery } from '@/features/notifications/notificationsApi'
import { toast } from 'sonner'
import { signOut } from 'next-auth/react'

export function Header() {
  const { user } = useSelector((state: RootState) => state.user)
  const [notifications, setNotifications] = React.useState<any[]>([])
  // const socket = useSocket()
  const { data, isSuccess, error } = useGetNotificationsQuery(user && user.id)
  // React.useEffect(() => {
  //   if (!socket) return;
  //   console.log("🟢 Connected to socket");
  //   if (data) {
  //     setNotifications(data.data)
  //   }
  //   socket.on("notification", (data) => {
  //     console.log("📩 New notification:", data);
  //     setNotifications((prev) => [data, ...prev]);
  //     toast.success("New Notification")
  //   });

  //   return () => {
  //     socket.off("notification");
  //   };
  // }, [socket, data])
  return (
    <header className="fixed top-0 left-0 right-0 bg-background z-10 border-b">
      <div className="w-full  flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="text-2xl font-bold ">
          NextMatch
        </Link>
        {/* Search Box */}
        {/* <div className="flex justify-center w-full h-full">
          <div className="flex items-center relative h-4/6 mt-auto mb-auto w-1/4">
            <Input
              type="text"
              placeholder="Search..."
              className="min-w-max rounded-full h-full focus-visible:ring-0"
            />
            <Button className='rounded-full absolute right-0 h-full bg-black'>
              Search
            </Button>
          </div>
        </div> */}
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <BellDot className="scale-125" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-20">

              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>You have 3 unread messages.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  {notifications && notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                    >
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-black" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Check /> Mark all as read
                </Button>
              </CardFooter>

            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon">
            <MessageSquare className="scale-125" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <User className="scale-100" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2 mt-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={'/dashboard'}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({callbackUrl:"/auth/signin"})}>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  )
}

