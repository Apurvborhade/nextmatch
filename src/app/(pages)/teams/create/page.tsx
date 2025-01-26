"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
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
import SearchAddField from "@/app/components/SearchAddField";
import { Card } from "@/components/ui/card";



export type Player = {
    id: string,
    name: string
}
const PlayerObject = z.object({
    id: z.string(),
    name: z.string()
})


const formSchema = z.object({
    name: z.string().min(2).max(50),

    players: z.array(PlayerObject),
    date: z.date(),

})
export default function CreateMatch() {
    const [date, setDate] = React.useState<Date>()

    const [period, setPeriod] = React.useState<Period>("PM");

    const minuteRef = React.useRef<HTMLInputElement>(null);
    const hourRef = React.useRef<HTMLInputElement>(null);
    const secondRef = React.useRef<HTMLInputElement>(null);
    const periodRef = React.useRef<HTMLButtonElement>(null);
    const defaultPlayersValue: Player[] = []

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            players: defaultPlayersValue,
            date: new Date(),
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
        console.log("Submit")
        console.log(values)
        setDate(undefined)
        form.reset();
    }


    return (
        <div className="w-full flex justify-center items-center">
            <Card className="md:w-1/2 w-full p-10">
                <div className="match-create-form">
                    <h2 className="text-2xl font-bold mb-4">Create Team</h2>
                    <Separator />

                    <Form {...form} getFieldState={form.getFieldState}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>


                            <div className="flex gap-5 my-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Madrid" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Team Name
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
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
                                                    {date ? format(date, "PPP ") : <span>Pick a date</span>}
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
                                                    <FormControl>
                                                        <Calendar mode="single" selected={date} onSelect={setDate} {...field} />
                                                    </FormControl>

                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <div className="flex gap-5">
                                <Popover >
                                    <FormField
                                        control={form.control}
                                        name="players"
                                        render={() => (
                                            <SearchAddField form={form} append={append} isCaptain={false} />
                                        )} />
                                </Popover>
                            </div>
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
                            <Button className="mt-10" type="submit" onClick={() => console.log(form.formState.errors)}>Submit</Button>
                        </form>
                    </Form>

                </div >
            </Card>
        </div>

    )
}