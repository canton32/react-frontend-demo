import React, { Component } from 'react'
import { connect } from 'react-redux'
import CheckSVG from '../../../../images/check.svg'
import StepZilla from 'react-stepzilla'

import CreatePassword from './Steps/CreatePassword'
import VerifyPhone from './Steps/VerifyPhone'
import PersonalInformation from './Steps/PersonalInformation'
import ContactDetails from './Steps/ContactDetails'

import './Details.scss'

class Details extends Component {
  constructor (props) {
    super(props)

    const { startAtFirstDetail } = props

    this.state = {
      currentStep: startAtFirstDetail ? 0 : 3
    }
  }

  onBackToBuilder = () => {
    this.props.jumpToStep(1)
  }

  onFinish = () => {
    this.props.jumpToStep(3)
  }

  getSteps = () => {
    return [
      { name: 'Create Password', component: <CreatePassword CheckSVG={CheckSVG} onBackToBuilder={this.onBackToBuilder} /> },
      { name: 'Verify Phone Number', component: <VerifyPhone CheckSVG={CheckSVG} /> },
      { name: 'Personal Information', component: <PersonalInformation CheckSVG={CheckSVG} /> },
      { name: 'Contact Details', component: <ContactDetails CheckSVG={CheckSVG} onFinish={this.onFinish} /> },
    ]
  }

  onStepChange = (step) => {
    this.setState({
      currentStep: step
    })
  }

  render () {
    const { startAtFirstDetail } = this.props
    const { currentStep } = this.state
    return (
      <div>
        <div className='MobileTitle'>Your Details</div>
        <div className='YourDetails'>
          {
            currentStep >= 2 &&
            <div className='FewThings'>
              <div className='Title'>A few things about you</div>
              <div className='Description'>In order to open your accounts with our partner banks, we need the following details</div>
            </div>
          }
          <StepZilla steps={this.getSteps()}
            onStepChange={this.onStepChange}
            showSteps={false}
            showNavigation={false}
            // startAtStep={startAtFirstDetail ? 0 : 3}
            startAtStep={startAtFirstDetail ? 2 : 3}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  startAtFirstDetail: state.ui.startAtFirstDetail
})

export default connect(mapStateToProps)(Details)
