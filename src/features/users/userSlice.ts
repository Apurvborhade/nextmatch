import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user:null
    },
    reducers: {
        storeUser(state, action) {
            state.user = action.payload
        }
    }
})

export const { storeUser } = userSlice.actions

export default userSlice.reducer
