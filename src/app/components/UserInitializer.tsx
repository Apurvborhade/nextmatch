'use client'
import { storeUser } from '@/features/users/userSlice'
import { RootState } from '@/app/store'

import { useDispatch, useSelector } from 'react-redux'
import React from 'react'
import { redirect, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

const UserInitializer = ({
    user
}: Readonly<{
    user: unknown
}>) => {
    const pathname = usePathname()
    const dispatch = useDispatch()
    const { data: userLogged, status } = useSession();
    React.useEffect(() => {
        if (status === "loading") return; // Avoid redirecting before session loads

        if (!userLogged && pathname !== "/auth/signin" && pathname !== "/auth/signup" && pathname !== "/" && !pathname.startsWith("/matches/match-request")) {
            redirect("/auth/signin");
        }
    }, [userLogged, status, pathname]);

    const { user: alreadyUserExist } = useSelector((state: RootState) => state.user)
    React.useEffect(() => {
        if (!alreadyUserExist) {
            dispatch(storeUser(user || userLogged))
        }
    }, [user, userLogged, dispatch, alreadyUserExist])



    return null
}

export default UserInitializer