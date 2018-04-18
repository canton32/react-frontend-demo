
const hostname = window.location.hostname

const api = {
  'demo.numeos.com': 'https://dev.app.numeos.com/api/',
}

const home = {
  'demo.numeos.com': 'http://dev.home.numeos.com',
}

const config = {
  API_URL: api[hostname] || api['demo.numeos.com'],
  HOME_URL: home[hostname] || home['demo.numeos.com']
}

export default config
