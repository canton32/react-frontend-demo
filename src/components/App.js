import React from 'react'
import PropTypes from 'prop-types'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'

class App extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    const { store, routes } = this.props

    return (
      <Provider store={store.store}>
        <PersistGate loading={null} persistor={store.persistor}>
          <RootContainer routes={routes} />
        </PersistGate>
      </Provider>
    )
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired
}

export default App
