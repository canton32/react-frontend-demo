import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StepZilla from 'react-stepzilla'
import { connect } from 'react-redux'
import './Questionnaire.scss'
import './StepZilla.scss'

import Questions from './Steps/Questions'
import AccountBuilder from './Steps/AccountBuilder'
import Details from './Steps/Details'
import Review from './Steps/Review'

import Config from '../../config/appConfig'

const { HOME_URL } = Config

class Questionnaire extends Component {
  onBackToWelcome = () => {
    const props = this.props
    const { welcomeKey } = props

    props.router.push(`/welcome/${welcomeKey}`)
  }

  onOpenAccount = () => {
    const { token } = this.props

    window.location.replace(`${HOME_URL}/signin/${token}`)
  }

  getSteps = () => {
    return [
      { name: 'Questions', component: <Questions onBackToWelcome={this.onBackToWelcome} /> },
      { name: 'Account Builder', component: <AccountBuilder onBackToWelcome={this.onBackToWelcome} /> },
      { name: 'Your Details', component: <Details /> },
      { name: 'Review', component: <Review onOpenAccount={this.onOpenAccount} /> },
    ]
  }

  render () {
    const props = this.props

    return (
      <div className='Questionnaire'>
        <div className='QuestionnaireWrapper'>
          <StepZilla steps={this.getSteps()}
            showNavigation={false}
            startAtStep={props.questions.length > 0 ? 0 : 1}
            // startAtStep={3}
          />
        </div>
      </div >
    )
  }
}

Questionnaire.propTypes = {
  questions: PropTypes.array,
}

const mapStateToProps = (state) => ({
  questions: state.scoring.questions,
  welcomeKey: state.user.welcomeKey,
  token: state.user.token
})

export default connect(mapStateToProps)(Questionnaire)
