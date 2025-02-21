import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { AnyNaptrRecord } from 'dns'


export const matchesApi = createApi({
    reducerPath: "matchesApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/matches" }),
    tagTypes: ['Match'],
    endpoints: (builder) => ({
        getAllMatches: builder.query({
            query: () => ({ url: "/" }),
            providesTags: ['Match']
        }),
        createMatch: builder.mutation({
            query: ({ ...body }) => ({
                url: '/',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Match'],
            transformResponse: (response: { data: any }, meta, arg) => response.data,
            transformErrorResponse: (
                response: { status: string | number },
                meta,
                arg,
            ) => response.status,
        }),
        deleteMatch: builder.mutation({
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
        sendMatchRequest: builder.mutation<any, { senderId: string, receiverId: string, message: string, matchId: string }>({
            query: ({ ...body }) => ({
                url: `/match-request`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Match'],
            transformResponse: (response: { data: any }, meta, arg) => response.data,
            transformErrorResponse: (
                response: FetchBaseQueryError,
                meta,
                arg,
            ) => {
                if ('data' in response && response.data && typeof response.data === 'object' && 'message' in response.data) {
                    return { message: (response.data as { message: string }).message };
                } else if ('message' in response) {
                    return { message: response.message }; // Handles SerializedError case
                }
                return { message: 'An unknown error occurred' };
            }
        })
    })
})


export const { useCreateMatchMutation, useDeleteMatchMutation, useGetAllMatchesQuery, useSendMatchRequestMutation } = matchesApi