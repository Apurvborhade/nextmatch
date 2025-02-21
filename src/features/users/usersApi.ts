import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
interface Team {
    id: string,
    name: string,
    captainId: string,
    createdAt: string,
    players: Array<{
        id: string,
        name: string,
        role: string
    }>
}
interface TeamResponse {
    status: string,
    data: Team[]
}

export interface Match {
    id: string,
    date: string,
    location: string,
    status: 'active' | 'completed',
    team1: Team,
    team2: null | Team
}
interface MatchResponse {
    status: string,
    data: Match[]
}

interface User {
    id: string,
    username: string,
    email: string,
    role: string
}



export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/user" }),
    tagTypes:['User'],
    endpoints: (builder) => ({
        getUsers: builder.query<User[], string>({
            query: (query) => ({ url: `?username=${query}` })
        }),
        getUserData: builder.query<User, string>({
            query: (id) => ({ url: `/${id}` }),
            providesTags:['User']
        }),
        getMatches: builder.query<MatchResponse, null>({
            query: () => ({ url: `/matches` })
        }),
        getCompletedMatches: builder.query<MatchResponse, null>({
            query: () => ({ url: `/completed-matches` })
        }),
        updateUsers: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: body
            }),
            invalidatesTags:['User']
        }),

        findTeams: builder.query<TeamResponse, string>({
            query: (id) => ({
                url: `/${id}/getteams`
            })
        })

    })
})

export const { useGetUsersQuery, useUpdateUsersMutation, useGetMatchesQuery, useFindTeamsQuery, useGetCompletedMatchesQuery, useGetUserDataQuery } = usersApi