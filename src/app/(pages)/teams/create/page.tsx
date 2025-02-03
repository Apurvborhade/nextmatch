"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import React, { useEffect } from "react";
import SearchAddField from "@/app/components/SearchAddField";
import { Card } from "@/components/ui/card";
import { useCreateTeamMutation } from "@/features/teams/teamsApi";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Loader } from "@/app/components/Loader";



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
    players: z.array(PlayerObject).min(1, "Must Contain Atleast one Player"),
})

export default function CreateMatch() {
    const defaultPlayersValue: Player[] = []
    const { user } = useSelector((state: RootState) => state.user)
    const [captainId,setCaptainId] = React.useState<string | undefined>("")
    const [createTeam, { data, isLoading, error, isError }] = useCreateTeamMutation()

    useEffect(() => {
        console.log(data, error, isError)
    }, [error, isError])

    useEffect(() => {
        setCaptainId(user?.id as string)
    },[user])
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            players: defaultPlayersValue,

        },
    })

    const { append } = useFieldArray({
        control: form.control,
        name: "players"
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        const playersId = values.players.map((player) => player.id)
        createTeam({
            name: values.name,
            captainId,
            players: playersId,
        })
    }
    useEffect(() => {
        if (data != undefined) {
            toast("Team created successfull", {
                style: {
                    color: "white",
                    backgroundColor: "green"
                }
            })
            form.reset();
        }
    },[data])

    return (
        <div className="w-full flex justify-center items-center">
            <Toaster />
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
                                            <>
                                                <SearchAddField form={form} append={append} isCaptain={false} />
                                                {/* <FormMessage /> */}
                                            </>
                                        )} />
                                </Popover>
                            </div>

                            {error ? <p className="text-red-700">{'message' in error ? error.message : null}</p> : null}
                            <Button className="mt-10" type="submit" onClick={() => console.log(form.formState.errors)}>{isLoading ? (<Loader className=""/>) : 'Submit'}</Button>
                        </form>
                    </Form>

                </div >
            </Card>
        </div>

    )
}