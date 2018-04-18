import { combineReducers } from 'redux'
import location from './location'
import { userReducer as user } from './user'
import { scoringReducer as scoring } from './scoring'
import { productReducer as product } from './product'
import { offerReducer as offer } from './offer'
import { uiReducer as ui } from './ui'
import { portfolioReducer as portfolio } from './portfolio'

export default () => {
  return combineReducers({
    location,
    user,
    scoring,
    product,
    offer,
    ui,
    portfolio
  })
}
