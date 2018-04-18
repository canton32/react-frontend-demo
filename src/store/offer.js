import { createReducer, createActions } from 'reduxsauce'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  setDefaultOffer: null,
  saveOffers: ['offers']
})

export const OfferTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const defaultState = {
  id: null,
  positions: [
    {
      id: null,
      amount: '10000.00',
      rate: 2.050,
      product: 4
    },
    {
      id: null,
      amount: '10000.00',
      rate: 1.250,
      product: 1
    }
  ],
  status: 1
}

/* ------------- Reducers ------------- */
const setDefaultOffer = (state) => ({ ...defaultState })
const saveOffers = (state, { offers }) => ({ ...offers })

/* ------------- Hookup Reducers To Types ------------- */
export const offerReducer = createReducer(defaultState, {
  [Types.SET_DEFAULT_OFFER]: setDefaultOffer,
  [Types.SAVE_OFFERS]: saveOffers
})
