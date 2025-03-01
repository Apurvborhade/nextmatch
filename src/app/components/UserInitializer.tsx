'use client'
import { storeUser } from '@/features/users/userSlice'
import { RootState } from '@/app/store'

import { useDispatch, useSelector } from 'react-redux'
import React from 'react'
import { redirect, usePathname } from 'next/navigation'

const UserInitializer = ({
    user
}: Readonly<{
    user: unknown
}>) => {
    const pathname = usePathname()

    React.useEffect(() => {
        if (!user && pathname !== '/auth/signin' && pathname !== '/auth/signup' && pathname !== '/' && !pathname.startsWith('/matches/match-request')) {
            redirect('/auth/signin')
        }
    }, [user,pathname])
    const { user: alreadyUserExist } = useSelector((state: RootState) => state.user)

    const dispatch = useDispatch()
    if (!alreadyUserExist) {
        dispatch(storeUser(user))
    }
    

    return null
}

export default UserInitializer