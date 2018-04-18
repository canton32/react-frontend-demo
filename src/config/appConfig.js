
const hostname = window.location.hostname

const api = {
  'dev.signup.numeos.com': 'https://dev.app.numeos.com/api/',
  'staging.signup.numeos.com': 'https://staging.app.numeos.com/api/',
  'signup.numeos.com': 'https://app.numeos.com/api/',
}

const home = {
  'dev.signup.numeos.com': 'http://dev.home.numeos.com',
  'staging.signup.numeos.com': 'http://staging.home.numeos.com',
  'signup.numeos.com': 'http://home.numeos.com'
}

const config = {
  API_URL: api[hostname] || api['dev.signup.numeos.com'],
  HOME_URL: home[hostname] || home['dev.signup.numeos.com']
}

export default config
