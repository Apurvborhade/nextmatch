"use client"
import { MatchCards } from "@/app/components/MatchCards";
import { useGetAllMatchesQuery } from "@/features/matches/matchesApi";
import { Match } from "@/features/users/usersApi";
import { useEffect, useState } from "react";

export default function Matches() {
    const { data, isLoading, error } = useGetAllMatchesQuery("")
    const [matches, setMatches] = useState<Match[]>([])
    useEffect(() => {
        if (data) setMatches(data.data)
    }, [data])
    return (
        <div style={{ height: '100%' }}>
            <MatchCards matches={matches} isLoading={isLoading}/>
        </div>
    )
}