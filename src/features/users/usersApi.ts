import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/user" }),
    endpoints: (builder) => ({
        getUsers: builder.query<any, string>({
            query: (query) => ({ url: `?username=${query}` })
        }),
        updateUsers: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: body
            })
        })
    })
})

export const { useGetUsersQuery, useUpdateUsersMutation } = usersApi