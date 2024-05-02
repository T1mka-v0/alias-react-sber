import { createSlice } from "@reduxjs/toolkit";

const initialTeams = [
    {
      id: '0',
      name: 'Red Hot Chilly Peppers',
      score: 0,
      guessedWords: []
    },
    {
      id: '1',
      name: 'Green Picky Cucumbers',
      score: 0,
      guessedWords: []
    }
  ]

export const teamArray = createSlice({
    name: 'teamArray',
    initialState: {
        value: initialTeams
    },
    reducers: {
        add: (state, action) => {
            state.value.push(action.team);
        },
        remove: (state, action) => {
            state.value.filter(team => team.id !== action.team.id);
        },
        rename: (state, action) => {
            state.value.forEach((t) => {
                if (t.id === action.team.id) {
                  return Object.assign({}, t, {name: action.team.name})
                } else {
                  return t;
                }
              })
        }
    }
})

export const { add, remove, rename } = teamArray.actions;

export default teamArray.reducer;