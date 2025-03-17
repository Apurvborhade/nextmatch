import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const notificationsApi = createApi({
    reducerPath: "notificationsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/notifications" }),

    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: (userId) => ({ url: `?userId=${userId}` }),
        }),
    })
})

export const { useGetNotificationsQuery } = notificationsApi