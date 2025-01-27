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
})
export default function CreateMatch() {




   
    const defaultPlayersValue: Player[] = []

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            players: defaultPlayersValue,

        },
    })

    const { fields, append, remove } = useFieldArray<any, any>({
        control: form.control,
        name: "players"
    })
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Submit ✅")
        console.log(values)
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
                            
                            <Button className="mt-10" type="submit" onClick={() => console.log(form.formState.errors)}>Submit</Button>
                        </form>
                    </Form>

                </div >
            </Card>
        </div>

    )
}