import { createSlice } from "@reduxjs/toolkit";

export const teamId = createSlice({
    name: 'teamId',
    initialState: 2,
    reducers: {
        next: (state) => {
            return state.value + 1;
        }
    }
})

export const { next } = teamId.actions;

export default teamId.reducer;