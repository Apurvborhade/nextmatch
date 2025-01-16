"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CalendarIcon, Delete, DeleteIcon, Search, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { TimePeriodSelect } from "@/components/ui/period-select";
import { Period } from "@/components/ui/time-picker-utils";


const users = [
    { id: 1, name: "apurva" },
    { id: 2, name: "shriyash" },
]

enum queryType {
    player = "player",
    captain = "captain"
}


const formSchema = z.object({
    name: z.string().min(2).max(50),
    captain: z.object({
        id: z.number(),
        name: z.string(),
    }),
    players: z.array(z.string()).min(0).max(10),
    date: z.string(),
    searchPlayerQuery: z.string().min(2).max(50),
    searchCaptainQuery: z.string().min(2).max(50),
})
export default function CreateMatch() {
    const [date, setDate] = React.useState<Date>()
    const [period, setPeriod] = React.useState<Period>("PM");
    const [searchPlayers, setSearchPlayers] = React.useState<{ id: number, name: string }[]>([]);
    const [searchCaptain, setSearchCaptain] = React.useState<{ id: number, name: string }[]>([]);
    const minuteRef = React.useRef<HTMLInputElement>(null);
    const hourRef = React.useRef<HTMLInputElement>(null);
    const secondRef = React.useRef<HTMLInputElement>(null);
    const periodRef = React.useRef<HTMLButtonElement>(null);
    const defaultPlayersValue: string[] = []


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            captain: {},
            players: defaultPlayersValue,
            date: "",
            searchPlayerQuery: "",
            searchCaptainQuery: ""
        },
    })

    const { fields, append, remove } = useFieldArray<any, any>({
        control: form.control,
        name: "players"
    })
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        form.reset();

    }

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>, type: queryType) => {
        if (type === queryType.player) {
            form.setValue('searchPlayerQuery', e.currentTarget.value.trim())
            search(form.getValues().searchPlayerQuery, queryType.player)
        } else {
            form.setValue('searchCaptainQuery', e.currentTarget.value.trim())
            search(form.getValues().searchCaptainQuery, queryType.captain)
        }
    }
    const search = (query: string, type: queryType) => {
        const searchResult = users.filter((user) => user.name.includes(query))
        if (type === queryType.player) {
            setSearchPlayers(searchResult)
        } else {
            setSearchCaptain(searchResult)
        }
    }

    return (
        <div className="match-create-form">
            <h2 className="text-2xl font-bold mb-4">Create Match</h2>
            <Separator />

            <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                    <div className="flex gap-5 my-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Match Name
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Popover>

                            <FormField
                                control={form.control}
                                name="captain"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Captain</FormLabel>
                                        <FormControl>
                                            <div className="flex justify-start items-center">
                                                <Search className="absolute ml-2 opacity-40 scale-75" />
                                                <PopoverTrigger className="w-full">
                                                    <Input placeholder="Captain of team" className="rounded-full pl-10" onChange={(e) => handleQueryChange(e, queryType.captain)}
                                                    /></PopoverTrigger>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                        <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className="p-2">
                                            {searchCaptain.length === 0 ? (
                                                "Please Enter atleast 2 Characters"
                                            ) : (

                                                <ul>
                                                    {searchCaptain.map((player) => (
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
                                )}
                            />
                        </Popover>
                    </div>
                    <div className="flex gap-5">
                        <Popover >
                            <FormField
                                control={form.control}
                                name="players"

                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Players</FormLabel>
                                        <FormControl>
                                            <div className="flex justify-start items-center">
                                                <Search className="absolute ml-2 opacity-40 scale-75" />
                                                <PopoverTrigger className="w-full">
                                                    <Input placeholder="Add Players" className="rounded-full pl-10" onChange={(e) => handleQueryChange(e, queryType.player)}
                                                    /></PopoverTrigger>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                        <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className="p-2">
                                            {searchPlayers.length === 0 ? (
                                                "Please Enter atleast 2 Characters"
                                            ) : (

                                                <ul>
                                                    {searchPlayers.map((player) => (
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
                                )} />
                        </Popover>
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="w-full flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <br />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "min-w-[240px] justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon />
                                                {date ? format(date, "PPP ") + `${hourRef.current?.value} : ${minuteRef.current?.value}` : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            align="start"
                                            className="flex w-auto flex-col space-y-2 p-2"
                                        >
                                            <Select
                                                onValueChange={(value) =>
                                                    setDate(addDays(new Date(), parseInt(value)))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent position="popper">
                                                    <SelectItem value="0">Today</SelectItem>
                                                    <SelectItem value="1">Tomorrow</SelectItem>
                                                    <SelectItem value="3">In 3 days</SelectItem>
                                                    <SelectItem value="7">In a week</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <div className="rounded-md border">
                                                <Calendar mode="single" selected={date} onSelect={setDate} {...field} />
                                                <div className="flex items-end gap-2">
                                                    <div className="grid gap-1 text-center">
                                                        <Label htmlFor="hours" className="text-xs">
                                                            Hours
                                                        </Label>
                                                        <TimePickerInput
                                                            picker="12hours"
                                                            period={period}
                                                            date={date}
                                                            setDate={setDate}
                                                            ref={hourRef}
                                                            onRightFocus={() => minuteRef.current?.focus()}
                                                        />
                                                    </div>
                                                    <div className="grid gap-1 text-center">
                                                        <Label htmlFor="minutes" className="text-xs">
                                                            Minutes
                                                        </Label>
                                                        <TimePickerInput
                                                            picker="minutes"
                                                            id="minutes12"
                                                            date={date}
                                                            setDate={setDate}
                                                            ref={minuteRef}
                                                            onLeftFocus={() => hourRef.current?.focus()}
                                                            onRightFocus={() => secondRef.current?.focus()}
                                                        />
                                                    </div>
                                                    <div className="grid gap-1 text-center">
                                                        <Label htmlFor="seconds" className="text-xs">
                                                            Seconds
                                                        </Label>
                                                        <TimePickerInput
                                                            picker="seconds"
                                                            id="seconds12"
                                                            date={date}
                                                            setDate={setDate}
                                                            ref={secondRef}
                                                            onLeftFocus={() => minuteRef.current?.focus()}
                                                            onRightFocus={() => periodRef.current?.focus()}
                                                        />
                                                    </div>
                                                    <div className="grid gap-1 text-center">
                                                        <Label htmlFor="period" className="text-xs">
                                                            Period
                                                        </Label>
                                                        <TimePeriodSelect
                                                            period={period}
                                                            setPeriod={setPeriod}
                                                            date={date}
                                                            setDate={setDate}
                                                            ref={periodRef}
                                                            onLeftFocus={() => secondRef.current?.focus()}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>
                </form>
                <Button className="mt-10" type="submit" onClick={form.handleSubmit(onSubmit)}>Submit</Button>
            </Form>

        </div >
    )
}