import { createReducer, createActions } from 'reduxsauce'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  setDefaultProducts: null,
  saveProducts: ['data']
})

export const ProductTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const defaultState = {

}

/* ------------- Reducers ------------- */
const setDefaultProducts = (state) => ({ ...defaultState })
const saveProducts = (state, { data }) => {
  const productArray = [...data.results]
  let products = {}

  productArray.forEach(product => {
    products[product.id] = product
  })

  return { ...products }
}

/* ------------- Hookup Reducers To Types ------------- */
export const productReducer = createReducer(defaultState, {
  [Types.SET_DEFAULT_PRODUCTS]: setDefaultProducts,
  [Types.SAVE_PRODUCTS]: saveProducts
})
