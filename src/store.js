import { configureStore } from '@reduxjs/toolkit'
import teamArrayReducer from './slices/teamArray'
import teamIdReducer from './slices/teamId'

export default configureStore({
  reducer: {
    teamArray: teamArrayReducer,
    teamId: teamIdReducer
  },
})

// const action = {
//   type: 'ADD_TEAM',
//   team: {
//     id: null,
//     name: '',
//     score: 0,
//     words: []
//   }
// }