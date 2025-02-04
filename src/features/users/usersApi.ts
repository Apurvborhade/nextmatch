import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
interface Team {
    id: string,
    name: string,
    captainId: string,
    createdAt: string,
    players: Array<any>
}
interface TeamResponse {
    status: string,
    data: Team[]
}
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
        }),

        findTeams: builder.query<TeamResponse, any>({
            query: (id) => ({
                url: `/${id}/getteams`
            })
        })

    })
})

export const { useGetUsersQuery, useUpdateUsersMutation, useFindTeamsQuery } = usersApi