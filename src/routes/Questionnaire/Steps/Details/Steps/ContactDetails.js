import React, { Component } from 'react'
import { connect } from 'react-redux'
import { UserActions, PortfolioActions } from '../../../../../store'
import { Util, getAddresses, Rest } from '../../../../../services'
import { ButtonLoader } from '../../../../../components/common'

class ContactDetails extends Component {
  location = 3
  typingTimer = null
  doneTypingInterval = 1500
  addressSelected = ''

  constructor (props) {
    super(props)

    const { phone, address } = props.customer_user
    const { address1, address2, city, county, postcode } = address

    this.addressSelected = `${address1 || ''}, ${address2 || ''}, , , , ${city || ''}, ${county || ''}`

    this.state = {
      postcode: postcode || '',
      houseNumber: Util.prettifyAddress(this.addressSelected),
      landlinePhone: phone || '',
      addresses: [],
      isLoading: false
    }
  }

  componentDidMount () {
    setTimeout(this.loadInitialAddresses, 100)
  }

  showLoading = (visible) => {
    this.setState({
      isLoading: visible
    })
  }

  prettifyAddresses = (addresses) => {
    let res = []
    addresses.forEach(address => {
      const addressPrettified = Util.prettifyAddress(address)
      res.push({
        addressPrettified,
        address
      })
    })
    return res
  }

  loadInitialAddresses = () => {
    const { postcode } = this.state

    getAddresses(postcode).then(res => {
      this.setState({
        addresses: this.prettifyAddresses(res.addresses)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  doneTypingAddress = () => {
    const { postcode, houseNumber } = this.state

    getAddresses(postcode, houseNumber).then(res => {
      this.setState({
        addresses: this.prettifyAddresses(res.addresses)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  handleInputChange = (event) => {
    const { id, value } = event.target
    const { addresses } = this.state
    this.setState({
      [id]: value
    })

    if (id === 'postcode' || id === 'houseNumber') {
      clearTimeout(this.typingTimer)

      this.addressSelected = ''
      addresses.forEach(item => {
        if (item.addressPrettified === value) {
          this.addressSelected = item.address
        }
      })

      if (this.addressSelected.length == 0) {
        this.typingTimer = setTimeout(this.doneTypingAddress, this.doneTypingInterval)
      }
    }
  }

  formValidation () {
    if (this.state.postcode === '') return false
    if (this.state.houseNumber === '') return false
    // if (this.state.landlinePhone === '') return false
    return true
  }

  onPressBack = () => {
    this.props.jumpToStep(this.location - 1)
  }

  onPressFinish = () => {
    const props = this.props

    this.showLoading(true)

    Rest.postMeInfo(this.getPostMeData()).then(res => {
      props.saveUser(res.data)
      return Rest.getCustomerPortfolio()
    }).then(res => {
      this.showLoading(false)
      props.savePortfolio(res.data)
      props.onFinish()
    }).catch(error => {
      this.showLoading(false)
      alert(error.message || 'Something went wrong!')
    })
  }

  getPostMeData = () => {
    const { customer_user } = this.props
    const { postcode, landlinePhone } = this.state
    const addressItems = this.addressSelected.split(', ')

    return {
      customer_user: {
        ...customer_user,
        phone: landlinePhone,
        address: {
          ...customer_user.address,
          address1: addressItems[0],
          address2: addressItems[1],
          city: addressItems[5],
          county: addressItems[6],
          postcode
        }
      }
    }
  }

  render () {
    const valid = this.formValidation()
    const { addresses, isLoading } = this.state

    return (
      <div>
        <div className='SubTitle'>
          Contact Details
          {valid && <img src={this.props.CheckSVG} />}
        </div>
        <div className='Form ContactDetails'>
          <div className='Field Postcode'>
            <div className='Label'>Postcode</div>
            <input id='postcode' value={this.state.postcode} className='Input' onChange={this.handleInputChange} placeholder='Enter postcode' />
          </div>
          <div className='Field HouseNumber'>
            <div className='Label'>Personal Address</div>
            <input id='houseNumber' value={this.state.houseNumber} className='Input' onChange={this.handleInputChange} placeholder='Start typing house number...' list='addresses' />
            <datalist id='addresses'>
              {
                addresses.map((item, index) => {
                  return (
                    <option value={item.addressPrettified} key={index} />
                  )
                })
              }
              {
                !addresses.length && <option value='No Address matches' disabled />
              }
            </datalist>
          </div>
          <div className='FooterText'>Outside the UK? <a>Enter address manually</a></div>
          <div className='Field LandlinePhone'>
            <div className='Label'>Landline phone</div>
            <input id='landlinePhone' value={this.state.landlinePhone} className='Input' onChange={this.handleInputChange} placeholder='Enter landline phone number' />
          </div>
          <div className='Field' />
        </div>
        <div className='footer-buttons'>
          <button className='Button Prev' onClick={this.onPressBack}>Back</button>
          <ButtonLoader
            className={`Button Next ${valid ? '' : 'Disabled'}`}
            onClick={valid ? this.onPressFinish : null}
            text='Next'
            isLoading={isLoading} />
          <div className='Info'>Questions? <span className='ChatWithUs'>Chat with us</span> or call on +44 20 3870 4200</div>
        </div>
      </div >
    )
  }
}

const mapStateToProps = (state) => ({
  customer_user: state.user.customer_user
})

const mapDispatchToProps = {
  saveUser: UserActions.saveUser,
  saveCustomerAccount: UserActions.saveCustomerAccount,
  savePortfolio: PortfolioActions.savePortfolio
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetails)
