import { legacy_createStore as createStore } from "redux";

const initialState = {
  teamsArray: [
    {
      id: 1,
      name: 'Red Hot Chilly Peppers',
      guessedWords: [],
      skippedWords: [],
      score: 0
    },
    {
      id: 2,
      name: 'Green Picky Cucumbers',
      guessedWords: [],
      skippedWords: [],
      score: 0
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
  // Действия с командами
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
      return Object.assign({}, state, {
        teamsArray: state.teamsArray.map(t => {
          return t.id === action.payload.team.id ? Object.assign({}, t, {name: action.payload.team.name}) : t;
        })
      })
    case 'UPDATE_SCORE':
      let updatedTeam = state.teamsArray.find(team => team.id === action.payload.team.id);
      updatedTeam.guessedWords = action.payload.team.guessedWords;
      updatedTeam.skippedWords = action.payload.team.skippedWords;
      updatedTeam.score = action.payload.team.score;
      return Object.assign({}, state, {
        teamsArray: state.teamsArray.map(team => team.id === action.payload.team.id ? updatedTeam : team)
      })
    case 'ADD_ONE_WORD':
      let superTeam = state.teamsArray.find(team => team.id === action.payload.team.id);
      superTeam.guessedWords.push(action.payload.team.word);
      superTeam.score++;
      return Object.assign({}, state, {
        teamsArray: state.teamsArray.map(team => team.id === action.payload.team.id ? superTeam : team)
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
    
    // Изменения айди id
    case 'NEXT':
      return Object.assign({}, state, {
        teamId: state.teamId + 1
      })
    case 'PREV':
      return Object.assign({}, state, {
        teamId: state.teamId - 1
      })
    
    // Настрйоки раунда
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
    
      // Возврат изначальных настроек
    case 'RESET':
      return Object.assign({}, initialState, 
        {settings: initialState.settings},
        {teamsArray: [
          {
            id: 1,
            name: 'Red Hot Chilly Peppers',
            guessedWords: [],
            skippedWords: [],
            score: 0
          },
          {
            id: 2,
            name: 'Green Picky Cucumbers',
            guessedWords: [],
            skippedWords: [],
            score: 0
          }
        ]},
        {teamId: initialState.teamId}
      );
      //return initialState;
      
    default:
      return state;
  }
}

export const store = createStore(reducer);

// wordsCountToWin  commonLastWord   penaltyForSkip