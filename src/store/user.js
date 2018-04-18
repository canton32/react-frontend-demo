import { createReducer, createActions } from 'reduxsauce'
import { Rest } from '../services'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  setDefaultUser: null,
  changeFirstName: ['event'],
  changeLastName: ['event'],
  changeEmail: ['event'],
  changeMobileNumber: ['mobileNumber'],
  setWelcomeKey: ['welcomeKey'],
  saveUser: ['user'],
  saveCustomerUser: ['customer_user'],
  saveCustomerAccount: ['customer_account'],
  saveAddress: ['address']
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */
const defaultState = {
  customer_account: {
    id: null,
    bank_code: null,
    bank_account_iban: null,
    bank_account_number: null,
    bank_account_holder: null
  },
  customer_user: {
    title: null,
    mobile: null,
    phone: null,
    address: {
      id: null,
      address1: null,
      address2: null,
      city: null,
      county: null,
      postcode: null,
      country: null
    },
    gender: null,
    birthdate: null,
    tax_id: null,
    tax_residence: null,
    us_residence: false
  },
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  is_email_verified: false,
  token: null,
  groups: [],
  user_permissions: [],
  welcomeKey: null
}

/* ------------- Reducers ------------- */
const setDefaultUser = (state) => ({ ...defaultState })
const changeFirstName = (state, { event }) => ({
  ...state,
  first_name: event.target.value
})
const changeLastName = (state, { event }) => ({
  ...state,
  last_name: event.target.value
})
const changeEmail = (state, { event }) => ({
  ...state,
  email: event.target.value
})
const changeMobileNumber = (state, { mobileNumber }) => ({
  ...state,
  customer_user: {
    ...state.customer_user,
    mobile: mobileNumber
  }
})
const setWelcomeKey = (state, { welcomeKey }) => ({ ...state, welcomeKey })
const saveUser = (state, { user }) => {
  if (user.token) {
    Rest.setToken(user.token)
  }
  return {
    ...state,
    ...user
  }
}
const saveCustomerUser = (state, { customer_user }) => ({
  ...state,
  customer_user: {
    ...state.customer_user,
    ...customer_user,
    address: {
      ...state.customer_user.address,
      ...customer_user.address
    }
  }
})
const saveAddress = (state, { address }) => ({
  ...state,
  customer_user: {
    ...state.customer_user,
    address: {
      ...state.customer_user.address,
      ...address
    }
  }
})
const saveCustomerAccount = (state, { customer_account }) => ({
  ...state,
  customer_account: {
    ...state.customer_account,
    ...customer_account
  }
})

/* ------------- Hookup Reducers To Types ------------- */
export const userReducer = createReducer(defaultState, {
  [Types.SET_DEFAULT_USER]: setDefaultUser,
  [Types.CHANGE_FIRST_NAME]: changeFirstName,
  [Types.CHANGE_LAST_NAME]: changeLastName,
  [Types.CHANGE_EMAIL]: changeEmail,
  [Types.CHANGE_MOBILE_NUMBER]: changeMobileNumber,
  [Types.SET_WELCOME_KEY]: setWelcomeKey,
  [Types.SAVE_USER]: saveUser,
  [Types.SAVE_CUSTOMER_USER]: saveCustomerUser,
  [Types.SAVE_ADDRESS]: saveAddress,
  [Types.SAVE_CUSTOMER_ACCOUNT]: saveCustomerAccount
})
