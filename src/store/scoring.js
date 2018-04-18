import { createReducer, createActions } from 'reduxsauce'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  setDefaultScoring: null,
  saveQuestions: ['questions'],
  saveAnswers: ['answers']
})

export const ScoringTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const defaultState = {
  questions: [],
  answers: {
    data: {
      amount: 20000,
      objective: [
      ],
      objective_time: 1,
      objective_timeframe: 3
    },
    score: 3
  }
}

/* ------------- Reducers ------------- */
const setDefaultScoring = (state) => ({ ...defaultState })
const saveQuestions = (state, { questions }) => ({ ...state, questions })
const saveAnswers = (state, { answers }) => ({ ...state, answers })

/* ------------- Hookup Reducers To Types ------------- */
export const scoringReducer = createReducer(defaultState, {
  [Types.SET_DEFAULT_SCORING]: setDefaultScoring,
  [Types.SAVE_QUESTIONS]: saveQuestions,
  [Types.SAVE_ANSWERS]: saveAnswers
})
