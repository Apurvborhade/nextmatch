'use client'
import { Loader } from '@/app/components/Loader'
import { useGetMatchReqDetailsQuery, useMatchRequestAcceptMutation, useMatchRequestDeclineMutation } from '@/features/matches/matchesApi'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import { redirect, usePathname, useSearchParams } from 'next/navigation'

import React from 'react'
import { toast } from 'sonner'

interface Player {
    age: null | number
    bio: null | string
    createdAt: string
    email: string
    id: string
    name: string
    password: string
    position: null | string
    role: string
    updatedAt: string
}

const MatchRequestAccept = () => {
    const searchParams = useSearchParams()
    const { status } = useSession()
    const pathname = usePathname(); // Gets the current path without query parameters
    const requestId = searchParams.get('requestId')
    const { data, isLoading, error } = useGetMatchReqDetailsQuery(requestId)

    const asPath = searchParams.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
    React.useEffect(() => {
        if (status === "unauthenticated") {
            redirect(`/auth/signin?callbackUrl=${encodeURIComponent(asPath)}`)
        }
    }, [status, asPath])

    const [accept, { isLoading: ACCEPT_LOADING, error: ACCEPT_ERROR, isSuccess: ACCEPT_SUCCESS }] = useMatchRequestAcceptMutation()
    const [decline, { isLoading: DECLINE_LOADING, error: DECLINE_ERROR, isSuccess: DECLINE_SUCCESS }] = useMatchRequestDeclineMutation()

    React.useEffect(() => {
        if (ACCEPT_SUCCESS) {
            toast.success("Request Accepted")
        } else if (DECLINE_SUCCESS) {
            toast.success("Request Declined")
        }
    }, [ACCEPT_SUCCESS, DECLINE_SUCCESS, ACCEPT_LOADING, DECLINE_LOADING, ACCEPT_ERROR])

    React.useEffect(() => {
        if (ACCEPT_ERROR && 'message' in ACCEPT_ERROR) {
            toast.error(ACCEPT_ERROR.message)
        } else if (DECLINE_ERROR && 'message' in DECLINE_ERROR) {
            toast.error(DECLINE_ERROR.message)
        }
    }, [ACCEPT_ERROR, DECLINE_ERROR, ACCEPT_LOADING, DECLINE_LOADING])

    return (
        <>
            {isLoading &&
                (
                    <div className="w-screen h-screen flex justify-center items-center">
                        <Loader className='' />
                    </div>
                )
            }
            {data && data.data && (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl border border-gray-200">
                        <h2 className="text-2xl font-bold mb-6 text-center text-black">Match Request</h2>

                        <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="font-semibold text-lg mb-2 text-black">Requesting Team</h3>
                                <p className="text-gray-700">{data.data.sender?.name}</p>
                            </div>

                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="font-semibold text-lg mb-2 text-black">Match Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-medium text-black">Date & Time</p>
                                        <p className="text-gray-700">{format(data.data.match?.date, 'MMM do, h:mm:a')}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-black">Location</p>
                                        <p className="text-gray-700">{data.data.match?.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="font-semibold text-lg mb-2 text-black">Opponent Team Players</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {data.data.match?.team2?.players.map((player:Player) => (
                                        <p className="text-gray-700 capitalize" key={player?.id}>{player.name}</p>
                                    ))}

                                </div>
                            </div>

                            <div className="flex justify-center space-x-4 pt-4">
                                <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors" onClick={() => {
                                    accept(requestId)
                                }}>
                                    {ACCEPT_LOADING ? (<Loader className='' />) : (
                                        'Accept Request'
                                    )}
                                </button>
                                <button onClick={() => {
                                    decline(requestId)
                                }} className="bg-white text-black px-6 py-2 rounded-md hover:bg-gray-100 transition-colors border border-black">
                                    {DECLINE_LOADING ? (<Loader className='' />) : (
                                        'Decline Request'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MatchRequestAccept