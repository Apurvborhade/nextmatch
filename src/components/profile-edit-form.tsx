"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useUpdateUsersMutation } from "@/features/users/usersApi"
import { useSelector } from "react-redux"
import { RootState } from "@/app/store"
import { toast } from "sonner"
import { Loader } from "@/app/components/Loader"


export function ProfileEditForm() {
    const router = useRouter()
    const [age, setAge] = useState<number | null>(18)
    const [bio, setBio] = useState("")
    const [position, setPosition] = useState("")
    const [shooting, setShooting] = useState(5)
    const [passing, setPassing] = useState(5)
    const [dribbling, setDribbling] = useState(5)
    const [defending, setDefending] = useState(5)
    const [speed, setSpeed] = useState(5)
    
    const [updateProfile, { isLoading, error }] = useUpdateUsersMutation()
    const user = useSelector((state:RootState) => state.user.user)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const updateArgs = {
            id:user?.id,
            age,
            bio,
            position,
            skills:{
                shooting,
                passing,
                dribbling,
                defending,
                speed
            }
        }
        try {
            await updateProfile(updateArgs)
            toast.success(`User updated successfully`);
            setAge(18);
            setBio("");
            setPosition("");
            setShooting(5);
            setPassing(5);
            setDribbling(5);
            setDefending(5);
            setSpeed(5);
            router.push('/dashboard');
        } catch (error) {
            console.log(error)
            toast.error(`User update Error`);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                    </label>
                    <Input
                        type="number"
                        id="age"
                        value={age as number}
                        onChange={(e) => setAge(parseInt(e.target.value))}
                        className="w-full"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                    </label>
                    <Select value={position} onValueChange={setPosition}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your position" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="forward">Forward</SelectItem>
                            <SelectItem value="midfielder">Midfielder</SelectItem>
                            <SelectItem value="defender">Defender</SelectItem>
                            <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                    </label>
                    <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full" />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                <div className="space-y-6">
                    {[
                        { name: "Shooting", value: shooting, setValue: setShooting },
                        { name: "Passing", value: passing, setValue: setPassing },
                        { name: "Dribbling", value: dribbling, setValue: setDribbling },
                        { name: "Defending", value: defending, setValue: setDefending },
                        { name: "Speed", value: speed, setValue: setSpeed },
                    ].map((skill) => (
                        <div key={skill.name}>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor={skill.name.toLowerCase()} className="block text-sm font-medium text-gray-700">
                                    {skill.name}
                                </label>
                                <span className="text-sm font-medium text-gray-500">{skill.value}</span>
                            </div>
                            <Slider
                                id={skill.name.toLowerCase()}
                                min={0}
                                max={10}
                                step={1}
                                value={[skill.value]}
                                onValueChange={(value) => skill.setValue(value[0])}
                                className="w-full"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                {isLoading ? <Loader className=""/> : 'Update Profile'}
            </Button>
        </form>
    )
}

