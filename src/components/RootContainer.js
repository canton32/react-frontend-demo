import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory, Router } from 'react-router'
import { Rest } from '../services'

class RootContainer extends Component {
  componentDidMount () {
    Rest.setToken(this.props.token)
  }

  render () {
    return (
      <Router history={browserHistory} children={this.props.routes} />
    )
  }
}

RootContainer.propTypes = {
  routes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  token: state.user.token
})

export default connect(mapStateToProps)(RootContainer)
