import { legacy_createStore as createStore } from "redux";

const initialState = {
  teamsArray: [
    {
      id: 1,
      name: 'Red Hot Chilly Peppers',
      guessedWords: [],
      skippedWords: []
    },
    {
      id: 2,
      name: 'Green Picky Cucumbers',
      guessedWords: [],
      skippedWords: []
    }
  ],
  settings: {
    roundDuration: 60,
    wordsCountToWin: 30,
    commonLastWord: false,
    penaltyForSkip: false
  },
  teamId: 3
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TEAM':
      // return [...state, action.payload.team];
      return Object.assign({}, state, {teamsArray: [...state.teamsArray, action.payload.team]});
      

    case 'REMOVE_TEAM':
      return Object.assign({}, state, {
        teamsArray: state.teamsArray.filter(team => team.id!== action.payload.team.id)
      });
    // Need to transfer team with same data but new name
    case 'RENAME_TEAM':
      // const newState = state.map((t) => {
      //   if (t.id === action.payload.team.id) {
      //     return Object.assign({}, t, {name: action.payload.team.name})
      //   } else {
      //     return t;
      //   }
      // });

      return Object.assign({}, state, {
        teamsArray: state.teamsArray.map(t => {
          return t.id === action.payload.team.id ? Object.assign({}, t, {name: action.payload.team.name}) : t;
        })
      })
    case 'UPDATE_SCORE':
      let updatedTeam = state.teamsArray.find(team => team.id === action.payload.team.id);
      updatedTeam.guessedWords?.push(...action.payload.team.guessedWords);
      updatedTeam.skippedWords?.push(...action.payload.team.skippedWords)
      return Object.assign({}, state, {
        teamsArray: state.teamsArray.map(team => team.id === action.payload.team.id ? updatedTeam : team)
      })
    case 'SET_NEW_ID':
      let i = 0;
      return Object.assign({}, state, {
        teamsArray: state.teamsArray.map((team, index) => {
          i++;
          return Object.assign({}, team, {id: i})
        })
      },
    {teamId: i+1})
    
    case 'NEXT':
      return Object.assign({}, state, {
        teamId: state.teamId + 1
      })
    case 'PREV':
      return Object.assign({}, state, {
        teamId: state.teamId - 1
      })
    
    case 'SET_ROUND_DURATION':
      return Object.assign({}, state, {
        settings: Object.assign({}, state.settings, {roundDuration: action.payload.roundDuration})
      });
    case 'SET_WORDS_TO_WIN':
      return Object.assign({}, state, {
        settings: Object.assign({}, state.settings, {wordsCountToWin: action.payload.wordsCountToWin})
      });
    case 'SET_COMMON_LAST_WORD':
      return Object.assign({}, state, {
        settings: Object.assign({}, state.settings, {commonLastWord: action.payload.commonLastWord})
      });
    case 'SET_PENALTY_FOR_SKIP':
      return Object.assign({}, state, {
        settings: Object.assign({}, state.settings, {penaltyForSkip: action.payload.penaltyForSkip})
      });
    
    default:
      return state;
  }
}

export const store = createStore(reducer);

// wordsCountToWin  commonLastWord   penaltyForSkip