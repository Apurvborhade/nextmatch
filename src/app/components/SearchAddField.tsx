import { Button } from '@/components/ui/button'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Search, Trash2 } from 'lucide-react'
import React from 'react'
import { UseFieldArrayAppend, UseFormReturn } from 'react-hook-form'
import { useDebounce } from '../hooks/useDebounce'
import { AppDispatch } from '../store'
import { useDispatch } from 'react-redux'
import { usersApi } from '@/features/users/usersApi'
enum queryType {
    player = "player",
    captain = "captain"
}

const SearchAddField = ({ form, append, isCaptain }: {
    form: UseFormReturn<{
        captain: {
            id: number;
            name: string;
        };
        name: string;
        date: string;
        players: string[];
    }, any, undefined>,
    append: UseFieldArrayAppend<any, any>,
    isCaptain: boolean
}) => {
    const [users, setUsers] = React.useState<{ id: number, name: string }[]>([])
    const [input, setInput] = React.useState<string>("")
    const dispatch = useDispatch<AppDispatch>();
    const query = useDebounce(input, 300)




    React.useEffect(() => {
        if (query.length !== 0) {
            dispatch(usersApi.endpoints.getUsers.initiate(query)) // Unwraps the promise to handle the result or error
                .then((response) => {

                    console.log(response.data.data)
                    setUsers(response.data.data)

                })
                .catch((error) => {
                    console.log(error) // Stop loading
                });
        } else {
            setUsers([])
        }
    }, [query])
    if (isCaptain) {
        return (
            <FormItem className="w-full">
                <FormLabel>Captain</FormLabel>
                <FormControl>
                    <div className="flex justify-start items-center">
                        <Search className="absolute ml-2 opacity-40 scale-75" />
                        <PopoverTrigger className="w-full">
                            <Input placeholder="Captain of team" className="rounded-full pl-10" onChange={(e) => setInput(e.currentTarget.value.trim())}
                            /></PopoverTrigger>
                    </div>
                </FormControl>
                <FormMessage />
                <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className="p-2">
                    {users.length === 0 ? (
                        "Please Enter atleast 2 Characters"
                    ) : (

                        <ul>
                            {users.map((player) => (
                                <Button className="w-full flex justify-start" variant={"ghost"} key={player.name} onClick={(e) => {
                                    form.setValue("captain", player)
                                }}>{player.name}</Button>
                            ))}
                        </ul>
                    )}
                </PopoverContent>
                <Table className="w-auto">
                    <TableBody>

                        {Object.keys(form.getValues().captain).length === 0 && form.getValues().captain.constructor === Object ? (

                            null

                        ) : (
                            <TableRow className="gap-44 rounded-full shadow-none border-none grid grid-cols-4" key={form.getValues().captain.id}>
                                <TableCell className="font-medium">{form.getValues().captain.id}</TableCell>
                                <TableCell>{form.getValues().captain.name}</TableCell>
                                <TableCell>Defense</TableCell>
                                <TableCell className="text-right text-red-600 cursor-pointer ml-auto"><Trash2 /></TableCell>
                            </TableRow>
                        )}

                    </TableBody>
                </Table>
            </FormItem>
        )
    } else {

        return (
            <FormItem className="w-full">
                <FormLabel>Players</FormLabel>
                <FormControl>

                    <div className="flex justify-start items-center">
                        <Search className="absolute ml-2 opacity-40 scale-75" />
                        <PopoverTrigger className="w-full">
                            <Input placeholder="Add Players" className="rounded-full pl-10" onChange={(e) => setInput(e.currentTarget.value.trim())}
                            /></PopoverTrigger>
                    </div>
                </FormControl>
                <FormMessage />
                <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className="p-2">
                    {users.length === 0 ? (
                        "Please Enter atleast 2 Characters"
                    ) : (

                        <ul>
                            {users.map((player) => (
                                <Button className="w-full flex justify-start" variant={"ghost"} key={player.name} onClick={(e) => {
                                    append(e.currentTarget.innerText.trim());


                                }}>{player.name}</Button>
                            ))}
                        </ul>
                    )}
                </PopoverContent>
                <Table className="w-auto">
                    <TableBody>
                        {form.getValues().players.map((player) => (
                            <TableRow className="gap-44 rounded-full shadow-none border-none grid grid-cols-4" key={player}>
                                <TableCell className="font-medium">1.</TableCell>
                                <TableCell>{player}</TableCell>
                                <TableCell>Defense</TableCell>
                                <TableCell className="text-right text-red-600 cursor-pointer ml-auto"><Trash2 /></TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </FormItem>
        )
    }
}

export default SearchAddField