import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const matchesApi = createApi({
    reducerPath: "matchesApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/matches" }),
    tagTypes:['Match'],
    endpoints: (builder) => ({
        getAllMatches: builder.query({
            query: () => ({ url: "/" }),
            providesTags:['Match']
        }),
        createMatch: builder.mutation({
            query: ({ ...body }) => ({
                url: '/',
                method: 'POST',
                body: body
            }),
            invalidatesTags:['Match'],
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
        })
    })
})


export const { useCreateMatchMutation, useDeleteMatchMutation,useGetAllMatchesQuery } = matchesApi