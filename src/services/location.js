
function handleError (response) {
  let errorMessage = response.statusText

  let error = new Error(errorMessage)
  error.response = response
  throw error
}

export function getAddresses (postcode, houseNumber) {
  const api_url = 'https://api.getAddress.io/find/'
  const api_key = 'cgtDohSfDEyAttbkFX_Jig12144'
  let queryURL = `${api_url}/${postcode}`
  if (houseNumber && houseNumber.length > 0) {
    queryURL += `/${houseNumber}`
  }
  queryURL += `?api-key=${api_key}`

  return fetch(queryURL)
          .then(response => {
            if (response.status >= 200 && response.status < 300) {
              return response.json()
            } else {
              return handleError(response)
            }
          })
}
