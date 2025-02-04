'use client'
import { storeUser } from '@/features/users/userSlice'
import { RootState } from '@/app/store'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const UserInitializer = ({
    user
}: Readonly<{
    user: any
}>) => {

    const { user:alreadyUserExist } = useSelector((state: RootState) => state.user)

    const dispatch = useDispatch()
    if(!alreadyUserExist) {
        dispatch(storeUser(user))
    }
    return null
}

export default UserInitializer