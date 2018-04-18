import React, { Component } from 'react'
import { connect } from 'react-redux'
import PersonalInformation from './components/PersonalInformation'
import CheckBox from './components/CheckBox'
import { ButtonLoader } from '../../../../../components/common'
import { Rest } from '../../../../../services'
import { UserActions, PortfolioActions } from '../../../../../store'

class TermsConditions extends Component {
  location = 3

  constructor (props) {
    super(props)

    this.state = {
      valid: false,
      isLoading: false,
      array_checked: [false, false]
    }
  }

  onChangeCheck = (index, checked) => {
    let array_checked = [...this.state.array_checked]
    array_checked[index] = checked

    const valid = array_checked[0] && array_checked[1]
    this.setState({
      array_checked,
      valid
    })
  }

  onPressBack = () => {
    this.props.jumpToStep(this.location - 1)
  }

  showLoading = (visible) => {
    this.setState({
      isLoading: visible
    })
  }

  onPressFinish = () => {
    const props = this.props
    const { is_direct_debit } = props.portfolio

    this.showLoading(true)
    Rest.postMeInfo(this.getPostMeData()).then(res => {
      props.saveUser(res.data)
      return Rest.postCustomerAccount(this.getPostMeAccountData())
    }).then(res => {
      props.saveCustomerAccount(res.data)
      return Rest.postCustomerPortfolio(is_direct_debit)
    }).then(res => {
      this.showLoading(false)
      this.props.onOpenAccount()
    }).catch(error => {
      this.showLoading(false)
      alert(error.message || 'Something went wrong!')
    })
  }

  getPostMeData = () => {
    return {
      customer_user: this.props.customer_user
    }
  }

  getPostMeAccountData = () => {
    const { customer_account } = this.props

    return {
      ...customer_account
    }
  }

  render () {
    const { valid, isLoading } = this.state

    return (
      <div className='TermsConditions'>
        <div className='row content'>
          <div className='col-md-6'>
            <div className='SubTitle'>My personal information</div>
            <PersonalInformation />
          </div>
          <div className='col-md-6'>
            <div className='SubTitle'>Terms and Conditions</div>
            <div className='Header_Agree'>I agree</div>
            <div>
              <div className='TermsConditionsCheckItem'>
                <div>I confirm the personal information provided is correct, and that I am the beneficial owner of the account.</div>
                <CheckBox onChange={e => this.onChangeCheck(0, e.target.checked)} />
              </div>
              <div className='TermsConditionsCheckItem'>
                <div>I hereby confirm that I have read and accept the Terms and Conditions of Numeos Limited (<span className='hyperlink'>available here</span>). Additionally, I authorize Numeos Limited to forward my account opening details and identify me with the chosen partner banks. Once those accounts have been successfully opened, I authorize Numeos Limited to initiate the transfer of funds I wish to deposit to those accounts.</div>
                <CheckBox onChange={e => this.onChangeCheck(1, e.target.checked)} />
              </div>
            </div>
          </div>
        </div>

        <div className='footer-buttons'>
          <button className='Button Prev' onClick={this.onPressBack}>Back</button>
          <ButtonLoader
            className={`Next ${valid ? '' : 'Disabled'}`}
            onClick={valid ? this.onPressFinish : null}
            text='Open Account'
            isLoading={isLoading} />
          <div className='Info'>Questions? <span className='ChatWithUs'>Chat with us</span> or call on +44 20 3870 4200</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.portfolio
})

const mapDispatchToProps = {
  saveUser: UserActions.saveUser,
  saveCustomerUser: UserActions.saveCustomerUser,
  saveCustomerAccount: UserActions.saveCustomerAccount,
  savePortfolio: PortfolioActions.savePortfolio
}

export default connect(mapStateToProps, mapDispatchToProps)(TermsConditions)
