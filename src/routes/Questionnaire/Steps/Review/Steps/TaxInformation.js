import React, { Component } from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import Countries from '../../assets/Countries'
import { ButtonLoader } from '../../../../../components/common'
import { UserActions } from '../../../../../store'

class TaxInformation extends Component {
  location = 2
  constructor (props) {
    super(props)

    const { tax_id, tax_residence, us_residence } = props.customer_user

    this.state = {
      taxIdentifierNumber: tax_id || '',
      countryOfTaxResidence: tax_residence || 'GB',
      USPersonForUSTaxPurposes: us_residence ? 'Yes' : 'No',
      isLoading: false
    }
  }

  handleInputChange = (event) => {
    let id = event.target.id

    this.setState({
      [id]: event.target.value
    })
  }

  showLoading = (visible) => {
    this.setState({
      isLoading: visible
    })
  }

  formValidation () {
    const { countryOfTaxResidence, USPersonForUSTaxPurposes } = this.state
    if (countryOfTaxResidence === '') return false
    if (USPersonForUSTaxPurposes === '') return false
    return true
  }

  onPressBack = () => {
    this.props.jumpToStep(this.location - 1)
  }

  onPressNext = () => {
    const props = this.props

    props.saveCustomerUser(this.getTaxData())
    props.jumpToStep(this.location + 1)
  }

  getTaxData = () => {
    const { taxIdentifierNumber, countryOfTaxResidence, USPersonForUSTaxPurposes } = this.state

    return {
      tax_id: taxIdentifierNumber,
      tax_residence: countryOfTaxResidence,
      us_residence: USPersonForUSTaxPurposes === 'Yes'
    }
  }

  render () {
    const { taxIdentifierNumber, countryOfTaxResidence, USPersonForUSTaxPurposes, isLoading } = this.state
    const valid = this.formValidation()
    const taxStatuses = [
      'Yes', 'No'
    ]
    return (
      <div>
        <div className='SubTitle'>
          Tax Information
          {valid && <img src={this.props.CheckSVG} />}
        </div>
        <div className='SubDescription'>
          {`Please feel free to leave your Tax identifier number blank for now if you don't have it at hand
        - we will inform you if it is required by one of our partner banks`}
        </div>
        <div className='Form TaxInformation'>
          <div className='Field'>
            <div className='Label'>Country of tax residence</div>
            <select id='countryOfTaxResidence' value={countryOfTaxResidence} className='Select' onChange={this.handleInputChange}>
              <option value=''>Choose Country</option>
              {
                Countries.map((item, index) => {
                  return (
                    <option value={item.code} key={index}>{item.name}</option>
                  )
                })
              }
            </select>
          </div>
          <div className='Field'>
            <div className='Label'>Tax identifier number (TIN or NI)</div>
            <input id='taxIdentifierNumber' value={taxIdentifierNumber} className='Input' onChange={this.handleInputChange} placeholder='Enter tax identifier number' />
          </div>
          <div className='Field USPersonForUSTaxPurposes'>
            <div className='Label'>Are you a "US person" for US tax purposes?</div>
            <select id='USPersonForUSTaxPurposes' value={USPersonForUSTaxPurposes} className='Select' onChange={this.handleInputChange}>
              <option value=''>Choose US tax status</option>
              {
                taxStatuses.map((item, index) => {
                  return (
                    <option value={item} key={index}>{item}</option>
                  )
                })
              }
            </select>
          </div>
          <MediaQuery minWidth={769}>
            <div className='Field' />
          </MediaQuery>
        </div>
        <div className='footer-buttons'>
          <button className='Button Prev' onClick={this.onPressBack}>Back</button>
          <ButtonLoader
            className={`Button Next ${valid ? '' : 'Disabled'}`}
            onClick={valid ? this.onPressNext : null}
            text='Next'
            isLoading={isLoading} />
          <div className='Info'>Questions? <span className='ChatWithUs'>Chat with us</span> or call on +44 20 3870 4200</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  customer_user: state.user.customer_user,
})

const mapDispatchToProps = {
  saveCustomerUser: UserActions.saveCustomerUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(TaxInformation)
