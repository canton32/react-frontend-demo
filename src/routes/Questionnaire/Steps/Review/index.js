import React, { Component } from 'react'
import { connect } from 'react-redux'
import StepZilla from 'react-stepzilla'
import PartnerBankAccounts from './Steps/PartnerBankAccounts'
import TermsConditions from './Steps/TermsConditions'
import ExistingBank from './Steps/ExistingBank'
import TaxInformation from './Steps/TaxInformation'
import CheckSVG from '../../../../images/check.svg'
import './Review.scss'
import { UIActions } from '../../../../store'

class Review extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentStep: 0
    }
  }

  onBackToDetails = () => {
    this.props.setStartAtFirstDetail(false)
    this.props.jumpToStep(2)
  }

  getSteps = () => {
    return [
      { name: 'Partner bank accounts to be opened', component: <PartnerBankAccounts onBackToDetails={this.onBackToDetails} /> },
      { name: 'Existing Bank Account Details', component: <ExistingBank CheckSVG={CheckSVG} /> },
      { name: 'Tax Information', component: <TaxInformation CheckSVG={CheckSVG} /> },
      { name: 'Terms and Conditions', component: <TermsConditions onOpenAccount={this.props.onOpenAccount} /> },
    ]
  }

  onStepChange = (step) => {
    this.setState({
      currentStep: step
    })
  }

  render () {
    const { currentStep } = this.state

    return (
      <div>
        <div className='MobileTitle'>Review</div>
        <div className='Review'>
          {
            (currentStep === 1 || currentStep === 2) &&
            <div className='FewThings'>
              <div className='Title'>Additional information required by our partners</div>
              <div className='Description'>This information is required for the mandatory checks undertaken in order to open your account(s)</div>
            </div>
          }
          <StepZilla steps={this.getSteps()}
            onStepChange={this.onStepChange}
            showSteps={false}
            showNavigation={false}
          />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  setStartAtFirstDetail: UIActions.setStartAtFirstDetail
}

export default connect(null, mapDispatchToProps)(Review)
