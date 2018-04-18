import Config from '../config/appConfig'

const { API_URL } = Config

function getFormData (object) {
  if (object === null) { return null }

  const formData = new FormData()
  Object.keys(object).forEach(key => formData.append(key, object[key]))
  return formData
}

function handleError (response) {
  let errorMessage = response.statusText

  return response.json().then(res => {
    if (res && res.error) {
      if (res.error.errors) {
        errorMessage = JSON.stringify(res.error.errors)
      } else if (res.error.message) {
        errorMessage = res.error.message
      }
    }

    let error = new Error(errorMessage)
    error.response = response
    throw error
  })
}

function request (url, method, parameters, token) {
  const USE_FORM_DATA = false
  const queryURL = `${API_URL}${url}`
  const body = USE_FORM_DATA ? getFormData(parameters) : JSON.stringify(parameters)

  const headers = {
    Accept: 'application/json'
  }
  if (!USE_FORM_DATA) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers.authorization = `Token ${token}`
  }
  let params = { method, headers }
  if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT') {
    params.body = body
  }

  return fetch(queryURL, params)
          .then(response => {
            if (response.status >= 200 && response.status < 300) {
              return response.json()
            } else {
              return handleError(response)
            }
          })
}

function validateCustomerOffers (res) {
  /*
    MARK: Temporary logic to add missing second offer
          Backend will choose second offer and send */
  return new Promise((resolve, reject) => {
    const newRes = { ...res }

    if (newRes.data.positions.length === 1) {
      let additionalOffer = {
        id: null,
        rate: null,
        amount: '0.00'
      }

      if (newRes.data.positions[0].product > 2) {
        additionalOffer.product = 1
      } else {
        additionalOffer.product = 5
      }

      newRes.data.positions.push(additionalOffer)
    }

    resolve(newRes)
  })
}

let apiToken = null

export const Rest = {
  setToken: (_apiToken) => {
    apiToken = _apiToken
  },

  signupCustomerUser: (firstName, lastName, email) => {
    const param = {
      first_name: firstName,
      last_name: lastName,
      email
    }
    return request('signup/customer-user/', 'POST', param, null)
  },

  signupVerification: (key) => {
    const param = {
      key
    }
    return request('signup/verification/', 'POST', param, null)
  },

  signup2fa: (number) => {
    const param = {
      number
    }
    return request('signup/2fa/', 'POST', param, apiToken)
  },

  signup2faVerification: (number, verifyCode) => {
    const param = {
      number,
      token: verifyCode
    }
    return request('signup/2fa/verification/', 'POST', param, apiToken)
  },

  getScoring: () => {
    return request('scoring/', 'GET', null, apiToken)
  },

  postScoring: (answers) => {
    return request(`scoring/`, 'POST', answers, apiToken)
  },

  getProduct: (id) => {
    return request(`products/${id}/`, 'GET', null, apiToken)
  },

  getProducts: () => {
    return request('products/', 'GET', null, apiToken)
  },

  getCustomerOffers: () => {
    return request('me/customer/offer/', 'GET', null, apiToken)
      .then(res => {
        return validateCustomerOffers(res)
      })
  },

  postCustomerOffers: (positions) => {
    const param = {
      positions
    }
    return request('me/customer/offer/', 'POST', param, apiToken)
  },

  setPassword: (password, password2) => {
    const param = {
      password,
      password2
    }
    return request('me/password/', 'POST', param, apiToken)
  },

  getMeInfo: () => {
    return request('me/', 'GET', null, apiToken)
  },

  postMeInfo: (param) => {
    return request('me/', 'POST', param, apiToken)
  },

  getCustomerAccount: () => {
    return request('me/customer/account/', 'GET', null, apiToken)
  },

  postCustomerAccount: (param) => {
    return request('me/customer/account/', 'POST', param, apiToken)
  },

  getCustomerPortfolio: () => {
    return request('me/customer/portfolio/', 'GET', null, apiToken)
  },

  postCustomerPortfolio: (is_direct_debit) => {
    const param = {
      is_direct_debit
    }
    return request('me/customer/portfolio/', 'POST', param, apiToken)
  }
}
