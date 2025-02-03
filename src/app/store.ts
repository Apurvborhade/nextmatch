import { matchesApi } from '@/features/matches/matchesApi'
import { teamsApi } from '@/features/teams/teamsApi'
import { usersApi } from '@/features/users/usersApi'
import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/features/users/userSlice'

export const store = configureStore({
    reducer: {
        [teamsApi.reducerPath]: teamsApi.reducer,
        [matchesApi.reducerPath]: matchesApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        user:userReducer
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(teamsApi.middleware).concat(matchesApi.middleware).concat(usersApi.middleware),
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch