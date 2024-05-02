import { createStore } from "redux";

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

// const action = {
//   type: 'ADD_TEAM',
//   team: {
//     id: null,
//     name: '',
//     score: 0,
//     words: []
//   }
// }

const teamChangeReducer = (state = initialTeams, action) => {
  switch (action.type) {
    case 'ADD_TEAM':
      return [...state, action.team];
    case 'REMOVE_TEAM':
      return state.filter(team => team.id !== action.team.id);
    // Need to transfer team with same data but new name
    case 'RENAME_TEAM':
      const newState = state.map((t) => {
        if (t.id === action.team.id) {
          return Object.assign({}, t, {name: action.team.name})
        } else {
          return t;
        }
      });
      return newState;
    default:
      return state;
  }
}

export const teamStore = createStore(teamChangeReducer);

const teamIdReducer = (state = 2, action) => {
  switch (action.type) {
    case 'NEXT':
      return state + 1;
    default:
      return state;
  }
}
// Содержит id последней добавленной команды
export const teamId = createStore(teamIdReducer);