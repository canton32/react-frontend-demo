import React, { Component } from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { UserActions } from '../../../../../store'

class ExistingBank extends Component {
  location = 1

  constructor (props) {
    super(props)

    const { customer_account } = props

    if (customer_account) {
      const { bank_code, bank_account_number, bank_account_holder } = customer_account

      this.state = {
        sort_code: bank_code || '403020',
        account_number: bank_account_number || '78563412',
        account_holder_name: bank_account_holder || 'MR JOHN SMITH'
      }
    } else {
      this.state = {
        sort_code: '403020',
        account_number: '78563412',
        account_holder_name: 'MR JOHN SMITH'
      }
    }
  }

  handleInputChange = (event) => {
    let id = event.target.id
    this.setState({
      [id]: event.target.value
    })
  }

  isGoodSortCode = () => {
    const { sort_code } = this.state
    const newCode = sort_code.replace(/-|\s/g, '')

    if (newCode.length !== 6) {
      return false
    }

    const regex = /^[0-9]+$/
    return regex.test(newCode)
  }

  isGoodAccountNumber = () => {
    const { account_number } = this.state
    if (account_number.length !== 8) {
      return false
    }

    const regex = /^[0-9]+$/
    return regex.test(account_number)
  }

  formValidation () {
    const { account_holder_name } = this.state
    return this.isGoodSortCode() &&
          this.isGoodAccountNumber() &&
          account_holder_name !== ''
  }

  onPressBack = () => {
    this.props.jumpToStep(this.location - 1)
  }

  onPressNext = () => {
    const props = this.props
    const { sort_code, account_number, account_holder_name } = this.state

    const newSortCode = sort_code.replace(/-|\s/g, '')

    props.saveCustomerAccount({
      bank_code: newSortCode,
      bank_account_number: account_number,
      bank_account_holder: account_holder_name
    })
    props.jumpToStep(this.location + 1)
  }

  render () {
    const { sort_code, account_number, account_holder_name } = this.state
    const valid = this.formValidation()

    return (
      <div>
        <div className='SubTitle'>
          Nominated Bank Account
          {valid && <img src={this.props.CheckSVG} />}
        </div>
        <div className='SubDescription'>
          This is the UK bank account in your name that will be used exclusively for all transfers to and from your account(s) at our partner banks
        </div>
        <div className='Form ExistingBank'>
          <div className='Field'>
            <div className='Label'>Sort code</div>
            <input id='sort_code' value={sort_code} className='Input' onChange={this.handleInputChange} placeholder='Enter sort code' />
          </div>
          <div className='Field'>
            <div className='Label'>Account number</div>
            <input id='account_number' value={account_number} className='Input' onChange={this.handleInputChange} placeholder='Enter account number' />
          </div>
          <div className='Field'>
            <div className='Label'>Account holder name</div>
            <input id='account_holder_name' value={account_holder_name} className='Input' onChange={this.handleInputChange} placeholder='Enter account holder name' />
          </div>
          <MediaQuery minWidth={769}>
            <div className='Field' />
          </MediaQuery>
        </div>
        <div className='footer-buttons'>
          <button className='Button Prev' onClick={this.onPressBack}>Back</button>
          <button className={`Button Next ${valid ? '' : 'Disabled'}`} onClick={valid ? this.onPressNext : null}>Next</button>
          <div className='Info'>Questions? <span className='ChatWithUs'>Chat with us</span> or call on +44 20 3870 4200</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  customer_account: state.user.customer_account
})

const mapDispatchToProps = {
  saveCustomerAccount: UserActions.saveCustomerAccount
}

export default connect(mapStateToProps, mapDispatchToProps)(ExistingBank)
