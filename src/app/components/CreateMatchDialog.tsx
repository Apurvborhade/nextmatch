import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CalendarIcon, Plus, X } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useDebounce } from '../hooks/useDebounce'
import { useDispatch } from 'react-redux'
import { TeamResponse, teamsApi } from '@/features/teams/teamsApi'
import { AppDispatch } from '../store'
import { Loader } from './Loader'
import { useCreateMatchMutation } from '@/features/matches/matchesApi'
const teamObject = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
})
const FormSchema = z.object({
    team: teamObject,
    location: z.string().min(2),
    time: z.date({
        required_error: "A date and time is required "
    })
})
const CreateMatchDialog = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            team: { id: "", name: "" },
            location: ""
        }
    })

    const [createMatch] = useCreateMatchMutation()
    const { setValue, watch, reset } = form
    const [showInputTeam, setShowInputTeam] = React.useState(true);
    const [teamNameInput, setTeamNameInput] = React.useState<string>("")
    const query = useDebounce(teamNameInput, 300)
    const dispatch = useDispatch<AppDispatch>();
    const [teams, setTeams] = useState<TeamResponse[]>();
    const [fetchingTeam, setFetchingTeam] = useState<boolean>(false)
    function onSubmit(data: z.infer<typeof FormSchema>) {
        const body = {
            date: data.time.toISOString(),
            team1Id: data.team.id,
            location: data.location
        }

        try {
            createMatch(body)
            toast.success(`Match created successfully`);
            reset();
            setShowInputTeam(true)
            setTeamNameInput("")
        } catch (error) {
            console.log(error)
            toast.error(`There was error in creating new match`);
        }


    }

    function handleDateSelect(date: Date | undefined) {
        if (date) {
            form.setValue("time", date);
        }
    }

    function handleTimeChange(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: "hour" | "minute", value: string) {
        e.preventDefault()
        const currentDate = form.getValues("time") || new Date();
        const newDate = new Date(currentDate);

        if (type === "hour") {
            const hour = parseInt(value, 10);
            newDate.setHours(hour);
        } else if (type === "minute") {
            newDate.setMinutes(parseInt(value, 10));
        }

        form.setValue("time", newDate);
    }


    useEffect(() => {
        if (query.trim().length === 0) {
            setTeams([]);
            return;
        }

        let isMounted = true;
        setFetchingTeam(true);
        // Create an API call and save reference
        const promise = dispatch(teamsApi.endpoints.getTeams.initiate(query));


        promise
            .then((res) => {
                if (isMounted) {
                    setTeams(res?.data?.data || []);
                }
            })
            .catch((err) => {
                if (isMounted && err.name !== "AbortError") {
                    console.log("Error fetching teams:", err);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setFetchingTeam(false);
                }
            });

        return () => {
            isMounted = false;
            promise.abort(); // Abort request when component re-renders
        };
    }, [query, dispatch]);

    const teamdetails = watch('team')

    useEffect(() => {
        console.log(teamdetails)
    }, [teamdetails])
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='w-full'>New Match <Plus /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create match</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
                        <FormField
                            control={form.control}
                            name="team"
                            render={({ field }) => (

                                <Popover>
                                    <FormItem className="flex flex-col">
                                        <FormLabel>
                                            Your Team
                                        </FormLabel>
                                        {showInputTeam ? (
                                            <>
                                                <PopoverTrigger>
                                                    <FormControl>
                                                        <Input
                                                            id="team1"
                                                            placeholder='Search for team'
                                                            className="col-span-3"
                                                            value={teamNameInput}
                                                            onChange={(e) => {
                                                                try {
                                                                    setTeamNameInput(e.target.value.trim());
                                                                } catch (error) {
                                                                    console.error("Error in input change:", error);
                                                                }
                                                            }}
                                                            autoComplete='off'
                                                        />
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                                    className={`p-2 bg-white border border-black ${teamNameInput.trim().length !== 0 ? 'visible' : 'invisible'}`}
                                                >
                                                    {/* Display a "Team Not Found" message if no teams are found */}
                                                    {teams?.length === 0 && query.trim().length > 0 && (
                                                        <span>Team Not Found</span>
                                                    )}

                                                    {/* Show the loader when fetching teams */}
                                                    {fetchingTeam && <Loader className="" />}

                                                    {/* Display teams if available */}

                                                    <ul>
                                                        {teams?.length != 0 && teams?.map((team) => (
                                                            <Button
                                                                className="w-full flex justify-start"
                                                                variant="ghost"
                                                                key={team.id}
                                                                onClick={(e) => {
                                                                    // Handle team selection here
                                                                    // setInput(team.name) or similar logic
                                                                    e.preventDefault()
                                                                    setValue("team", { id: team?.id, name: team?.name })

                                                                    setShowInputTeam(false)
                                                                }}
                                                            >
                                                                {team.name}
                                                            </Button>
                                                        ))}
                                                    </ul>

                                                </PopoverContent>

                                            </>

                                        ) : (
                                            <Button className="w-1/3" variant="outline" onClick={(e) => {
                                                e.preventDefault()
                                                setValue('team', {})
                                                setShowInputTeam(true)
                                                field.onChange()
                                            }}>{field.value.name} <X /> </Button>
                                        )}


                                        <FormMessage />

                                    </FormItem>
                                </Popover>

                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Location
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="location"
                                            placeholder='Enter Turf Address'
                                            className="col-span-3"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Enter your date & time (24h)</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "MM/dd/yyyy HH:mm")
                                                    ) : (
                                                        <span>MM/DD/YYYY HH:mm</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <div className="sm:flex bg-white">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={handleDateSelect}
                                                />
                                                <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                                                    <ScrollArea className="w-64 sm:w-auto">
                                                        <div className="flex sm:flex-col p-2">
                                                            {Array.from({ length: 24 }, (_, i) => i)
                                                                .reverse()
                                                                .map((hour) => (
                                                                    <Button
                                                                        key={hour}
                                                                        size="icon"
                                                                        variant={
                                                                            field.value && field.value.getHours() === hour
                                                                                ? "default"
                                                                                : "ghost"
                                                                        }
                                                                        className="sm:w-full shrink-0 aspect-square"
                                                                        onClick={(e) =>
                                                                            handleTimeChange(e, "hour", hour.toString())
                                                                        }
                                                                    >
                                                                        {hour}
                                                                    </Button>
                                                                ))}
                                                        </div>
                                                        <ScrollBar
                                                            orientation="horizontal"
                                                            className="sm:hidden"
                                                        />
                                                    </ScrollArea>
                                                    <ScrollArea className="w-64 sm:w-auto">
                                                        <div className="flex sm:flex-col p-2">
                                                            {Array.from({ length: 12 }, (_, i) => i * 5).map(
                                                                (minute) => (
                                                                    <Button
                                                                        key={minute}
                                                                        size="icon"
                                                                        variant={
                                                                            field.value &&
                                                                                field.value.getMinutes() === minute
                                                                                ? "default"
                                                                                : "ghost"
                                                                        }
                                                                        className="sm:w-full shrink-0 aspect-square"
                                                                        onClick={(e) =>
                                                                            handleTimeChange(e, "minute", minute.toString())
                                                                        }
                                                                    >
                                                                        {minute.toString().padStart(2, "0")}
                                                                    </Button>
                                                                )
                                                            )}
                                                        </div>
                                                        <ScrollBar
                                                            orientation="horizontal"
                                                            className="sm:hidden"
                                                        />
                                                    </ScrollArea>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Please select your preferred date and time.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateMatchDialog