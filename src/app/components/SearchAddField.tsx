import { Button } from '@/components/ui/button'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { LoaderCircle, Search, Trash2 } from 'lucide-react'
import React from 'react'
import { UseFieldArrayAppend, UseFormReturn } from 'react-hook-form'
import { useDebounce } from '../hooks/useDebounce'
import { AppDispatch } from '../store'
import { useDispatch } from 'react-redux'
import { usersApi } from '@/features/users/usersApi'
import { Player } from '../(pages)/teams/create/page'


const SearchAddField = ({ form, append }: {
    form: UseFormReturn<{
        name: string;
        date: Date;
        players: Player[];
    }, any, undefined>,
    append: UseFieldArrayAppend<any, any>,
    isCaptain: boolean
}) => {
    const [users, setUsers] = React.useState<{ id: number, name: string }[]>([])
    const [input, setInput] = React.useState<string>("")
    const [fetchingPlayer, setFetchingPlayer] = React.useState<Boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const query = useDebounce(input, 300)




    React.useEffect(() => {
        if (query.length !== 0) {
            setFetchingPlayer(true)
            dispatch(usersApi.endpoints.getUsers.initiate(query)) // Unwraps the promise to handle the result or error
                .then((response) => {
                    console.log(response.data.data)
                    setFetchingPlayer(false)
                    setUsers(response.data.data)
                })
                .catch((error) => {
                    console.log(error) // Stop loading
                });
        } else {
            setUsers([])
        }
    }, [query])
    return (
        <FormItem className="w-full">
            <FormLabel>Players</FormLabel>
            <PopoverTrigger className="w-full">
                <FormControl>
                    <div className="flex justify-start items-center outline-none">
                        <Search className="absolute ml-2 opacity-40 scale-75" />
                        <Input placeholder="Add Players" className="rounded-full pl-10" value={input} onChange={(e) => setInput(e.currentTarget.value.trim())}
                        />
                    </div>
                </FormControl>
            </PopoverTrigger>
            <FormMessage />
            <div className='invisible'>
                <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`p-2 ${input.length !== 0 ? 'visible' : 'invisible'}`}>
                    {users.length === 0 && query.length !== 0 ? (
                        "Player Not Found"
                    ) : null}
                    {fetchingPlayer && (
                        <LoaderCircle />
                    )}
                    <ul>
                        {users.map((player) => (
                            <Button className="w-full flex justify-start" variant={"ghost"} key={player.name} onClick={(e) => {
                                append(player);
                                setInput("")

                            }}>{player.name}</Button>
                        ))}
                    </ul>

                </PopoverContent>
            </div>

            <Table className="w-full">
                <TableBody className='w-full'>
                    {form.getValues().players.map((player) => (
                        <TableRow className="w-full flex justify-between" key={player.id}>
                            <TableCell className="font-medium">1.</TableCell>
                            <TableCell className='mx-auto'>{player.name}</TableCell>
                            <TableCell className='mx-auto'>Defense</TableCell>
                            <TableCell className="text-right text-red-600 cursor-pointer ml-auto"><Trash2 /></TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </FormItem>
    )
}


export default SearchAddField