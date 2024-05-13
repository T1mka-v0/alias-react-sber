import { act } from "react";
import { legacy_createStore as createStore } from "redux";

const initialTeams = [
  {
    id: 0,
    name: 'Red Hot Chilly Peppers',
    score: 0,
    guessedWords: []
  },
  {
    id: 1,
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
      return [...state, action.payload.team];
    case 'REMOVE_TEAM':
      return state.filter(team => team.id !== action.payload.team.id);
    // Need to transfer team with same data but new name
    case 'RENAME_TEAM':
      const newState = state.map((t) => {
        if (t.id === action.team.id) {
          return Object.assign({}, t, {name: action.payload.team.name})
        } else {
          return t;
        }
      });
      return newState;
    case 'UPDATE_SCORE':
      let updatedTeam = state.find(team => team.id === action.payload.team.id);
      updatedTeam.score += action.payload.team.score;
      updatedTeam.guessedWords.push(...action.payload.team.guessedWords);
      return state.map(team => team.id === action.payload.team.id ? updatedTeam : team);
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

const settingsInitialState = {
  roundDuration: 60,
  wordsCountToWin: 30,
  commonLastWord: false,
  penaltyForSkip: false
}
export const settingsReducer = (state = settingsInitialState, action) => {
  switch (action.type) {
    case 'SET_ROUND_DURATION':
      return Object.assign({}, state, {roundDuration: action.payload.roundDuration});
    case 'SET_WORDS_TO_WIN':
      return Object.assign({}, state, {wordsCountToWin: action.payload.wordsCountToWin});
    case 'SET_COMMON_LAST_WORD':
      return Object.assign({}, state, {commonLastWord: action.payload.commonLastWord});
    case 'SET_PENALTY_FOR_SKIP':
      return Object.assign({}, state, {penaltyForSkip: action.payload.penaltyForSkip});
    default:
      return state;
  }
}
export const settingsStore = createStore(settingsReducer);