import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

interface Match {
    id: string;
    // Add other match properties here
}

interface MatchResponse {
    data: Match;
}

export const matchesApi = createApi({
    reducerPath: "matchesApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/matches" }),
    tagTypes: ['Match'],
    endpoints: (builder) => ({
        getAllMatches: builder.query({
            query: () => ({ url: "/" }),
            providesTags: ['Match']
        }),
        getMatchReqDetails: builder.query({
            query: (requestId) => ({ url: `/match-request?requestId=${requestId}` }),
        }),
        createMatch: builder.mutation({
            query: ({ ...body }) => ({
                url: '/',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Match'],
            transformResponse: (response: MatchResponse) => response.data,
            transformErrorResponse: (
                response: { status: string | number }
            ) => response.status,

        }),
        deleteMatch: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: MatchResponse) => response.data,
            transformErrorResponse: (
                response: { status: string | number }
            ) => response.status,
        }),
        sendMatchRequest: builder.mutation<Match, { senderId: string, receiverId: string, message: string, matchId: string }>({
            query: ({ ...body }) => ({
                url: `/match-request`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Match'],
            transformResponse: (response: MatchResponse) => response.data,
            transformErrorResponse: (
                response: FetchBaseQueryError
            ) => {
                if ('data' in response && response.data && typeof response.data === 'object' && 'message' in response.data) {
                    return { message: (response.data as { message: string }).message };
                } else if ('message' in response) {
                    return { message: response.message }; // Handles SerializedError case
                }
                return { message: 'An unknown error occurred' };
            }
        }),
        matchRequestAccept: builder.mutation({
            query: (requestId) => ({
                url: `/match-request/accept?requestId=${requestId}`,
                method: 'PATCH'
            }),
            invalidatesTags: ['Match'],
            transformErrorResponse: (
                response: FetchBaseQueryError
            ) => {
                if ('data' in response && response.data && typeof response.data === 'object' && 'message' in response.data) {
                    return { message: (response.data as { message: string }).message };
                } else if ('message' in response) {
                    return { message: response.message }; // Handles SerializedError case
                }
                return { message: 'An unknown error occurred' };
            }
        }),
        matchRequestDecline: builder.mutation({
            query: (requestId) => ({
                url: `/match-request/decline?requestId=${requestId}`,
                method: 'PATCH'
            }),
            invalidatesTags: ['Match'],

            transformErrorResponse: (
                response: FetchBaseQueryError
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

export const { useCreateMatchMutation, useDeleteMatchMutation, useGetAllMatchesQuery, useSendMatchRequestMutation, useMatchRequestAcceptMutation, useMatchRequestDeclineMutation,useGetMatchReqDetailsQuery } = matchesApi