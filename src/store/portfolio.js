import { createReducer, createActions } from 'reduxsauce'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  setDefaultPortfolio: null,
  savePortfolio: ['portfolio'],
  setIsDirectDebit: ['is_direct_debit']
})

export const PortfolioTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const defaultState = {
  id: null,
  accounts: [
    {
      id: null,
      product: {
        id: null,
        type: 11,
        currency: 'EUR',
        name: null,
        description: null,
        option_is_access_prior: false,
        option_is_notice_period: false,
        option_notice_period: 0,
        rate: null,
        term_years: 0,
        term_months: 0,
        term_date: 0
      },
      bank: {
        id: null,
        name: null,
        name_legal: null,
        website: null,
        phone: null
      },
      bank_term: {
        id: null,
        name: null,
        is_joint_accounts: true,
        is_overseas_residents: true,
        cooling_period: 0,
        deposit_amount_min: 0,
        deposit_amount_max: 0,
        deposit_is_multiple: true,
        interest_period: 1,
        withdrawal_is_partial: true,
        withdrawal_penalty_period: 0,
        withdrawal_penalty_is_full: true,
        withdrawal_cooling_period: 0,
        description: null,
        document_terms: null,
        document_details: null
      },
      rate: null,
      opened_datetime: null,
      term_date: null,
      bank_sort_code: null,
      bank_account_iban: null,
      bank_account_number: null,
      bank_account_holder: null,
      balance_amount: null,
      balance_date: null,
      status: 1
    }
  ],
  сurrency: 'EUR',
  is_direct_debit: true,
  opened_datetime: null,
  status: 1
}

/* ------------- Reducers ------------- */
const setDefaultPortfolio = (state) => ({ ...defaultState })
const savePortfolio = (state, { portfolio }) => ({ ...state, ...portfolio })
const setIsDirectDebit = (state, { is_direct_debit }) => ({ ...state, is_direct_debit })

/* ------------- Hookup Reducers To Types ------------- */
export const portfolioReducer = createReducer(defaultState, {
  [Types.SET_DEFAULT_PORTFOLIO]: setDefaultPortfolio,
  [Types.SAVE_PORTFOLIO]: savePortfolio,
  [Types.SET_IS_DIRECT_DEBIT]: setIsDirectDebit
})
