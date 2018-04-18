import { createReducer, createActions } from 'reduxsauce'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  setIsBuildingAccount: ['isBuildingAccount'],
  setStartAtFirstDetail: ['startAtFirstDetail']
})

export const UITypes = Types
export default Creators

/* ------------- Initial State ------------- */

const defaultState = {
  isBuildingAccount: false,
  startAtFirstDetail: true
}

/* ------------- Reducers ------------- */
const setIsBuildingAccount = (state, { isBuildingAccount }) => ({ ...state, isBuildingAccount })
const setStartAtFirstDetail = (state, { startAtFirstDetail }) => ({ ...state, startAtFirstDetail })

/* ------------- Hookup Reducers To Types ------------- */
export const uiReducer = createReducer(defaultState, {
  [Types.SET_IS_BUILDING_ACCOUNT]: setIsBuildingAccount,
  [Types.SET_START_AT_FIRST_DETAIL]: setStartAtFirstDetail
})
