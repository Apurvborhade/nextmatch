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
            query: (body) => ({
                url: '/',
                method: 'POST',
                body: {
                    name: body.name,
                    players: body.players,
                    captainId: body.captainId
                }
            }),
            transformResponse: (response: { data: any }, meta, arg) => response.data,
            transformErrorResponse: (
                response,
                meta,
                arg,
            ) => response.data,
        }),
        updateTeam: builder.mutation({
            query: ({ id, ...put }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: put
            }),
            transformResponse: (response: { data: any }, meta, arg) => response.data,
            transformErrorResponse: (
                response: { status: string | number },
                meta,
                arg,
            ) => response.status,
        }),
        deleteTeam: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: { data: any }, meta, arg) => response.data,
            transformErrorResponse: (
                response: { status: string | number },
                meta,
                arg,
            ) => response.status,
        }),
        getTeams: builder.query<any, string>({
            query: (teamName) => ({
                url: `?teamName=${teamName}`,                
            })
        })
    })
})

export const { useCreateTeamMutation, useDeleteTeamMutation, useUpdateTeamMutation, useGetTeamsQuery } = teamsApi