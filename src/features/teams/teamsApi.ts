import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const teamsApi = createApi({
    reducerPath: "teamsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/teams" }),
    endpoints: (builder) => ({
        createTeam: builder.mutation({
            query: ({ ...args }) => ({
                url: '/',
                method: 'POST',
                body: args
            }),
            transformResponse: (response: { data: any }, meta, arg) => response.data,
            transformErrorResponse: (
                response: { status: string | number },
                meta,
                arg,
            ) => response.status,
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
        })
    })
})

export const { useCreateTeamMutation, useDeleteTeamMutation, useUpdateTeamMutation } = teamsApi