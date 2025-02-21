import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useFindTeamsQuery } from '@/features/users/usersApi'
import { Loader } from './Loader'
import { Textarea } from '@/components/ui/textarea'
import { useSendMatchRequestMutation } from '@/features/matches/matchesApi'
import { toast } from 'sonner'
import { Form } from '@/components/ui/form'

const MatchRequestDialog = ({ receiverId, matchId }: { receiverId: string, matchId: string }) => {
    const user = useSelector((state: RootState) => state.user.user)
    const [teamId, setTeamId] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const { data, isLoading, error } = useFindTeamsQuery(user?.id)
    const [sendMatchRequest, { isLoading: RequestSending, error: RequestError, isSuccess }] = useSendMatchRequestMutation();
    const valueChange = (value: string) => {
        setTeamId(value)
        console.log(teamId)
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const body = {
                senderId: teamId,
                receiverId,
                message,
                matchId
            }
            await sendMatchRequest(body)
        } catch (error) {
            console.log(error)
        }


    }
    useEffect(() => {
        if (RequestError) {
            let errorMessage = 'An unknown error occurred';
            if ('data' in RequestError && RequestError.data && typeof RequestError.data === 'object' && 'message' in RequestError.data) {
                errorMessage = (RequestError.data as { message: string }).message;
            } else if ('message' in RequestError) {
                errorMessage = RequestError.message as string
            }
            toast.error(errorMessage, {
                style: {
                    backgroundColor: '#D2665A',
                    color: 'white',
                    borderColor: '#D2665A'
                }
            })
        }
        if (isSuccess) {
            toast.success("Match Request Send Successfully")
        }
    }, [RequestError, isSuccess])
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Select team to send request</DialogTitle>
            </DialogHeader>

            <form onSubmit={onSubmit}>
                <Select onValueChange={valueChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Team" />
                    </SelectTrigger>
                    <SelectContent className='max-h-[200px]'>
                        {isLoading && <Loader className="" />}
                        {data && data.data.map((team) => (
                            <SelectItem value={team.id} key={team.id}>{team.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Textarea className='mt-4' placeholder='Send your message' required value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button className='mt-4'>
                    {RequestSending ? (<Loader className='' />) : (
                        'Send Match Request'
                    )}
                </Button>


            </form>

        </DialogContent>
    )
}

export default MatchRequestDialog