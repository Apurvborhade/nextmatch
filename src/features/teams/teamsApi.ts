import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export interface TeamResponse  {
    name: string;
    captainId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export const teamsApi = createApi({
    reducerPath: "teamsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/teams" }),
    endpoints: (builder) => ({
        createTeam: builder.mutation({
            query: (data) => ({
                url: '/',
                method: 'POST',
                body: {
                    name: data.name,
                    players: data.players,
                    captainId: data.captainId
                }
            }),
            transformResponse: (response: { data: TeamResponse }) => response.data,
            transformErrorResponse: (response) => response.data,
        }),
        updateTeam: builder.mutation({
            query: ({ id, ...put }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: put
            }),
            transformResponse: (response: { data: TeamResponse }) => response.data,
            transformErrorResponse: (response: { status: string | number }) => response.status,
        }),
        deleteTeam: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: { data: TeamResponse }) => response.data,
            transformErrorResponse: (response: { status: string | number }) => response.status,
        }),
        getTeams: builder.query<{ data: TeamResponse[] }, string>({
            query: (teamName) => ({
                url: `?teamName=${teamName}`,                
            }),
            transformResponse: (response: { data: TeamResponse[] }) => response
        })
    })
})

export const { useCreateTeamMutation, useDeleteTeamMutation, useUpdateTeamMutation, useGetTeamsQuery } = teamsApi