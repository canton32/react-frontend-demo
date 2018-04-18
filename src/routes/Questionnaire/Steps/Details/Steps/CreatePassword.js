import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Rest } from '../../../../../services'
import { UserActions } from '../../../../../store'
import { ButtonLoader } from '../../../../../components/common'

class CreatePassword extends Component {
  location = 0

  constructor (props) {
    super(props)

    this.state = {
      password: '',
      mobileNumber: '',
      repeatPassword: '',
      isLoading: false
    }
  }

  handleInputChange = (event) => {
    let id = event.target.id
    this.setState({
      [id]: event.target.value
    })
  }

  formValidation () {
    return this.fieldValidation('password') &&
            this.fieldValidation('repeatPassword', 'password') &&
            this.fieldValidation('mobileNumber')
  }

  /**
   *
   * @param {String} field - "password", "repeatPassword", "mobileNumber"
   * @param {String} compare: another field to compare
   */
  fieldValidation (field, compare = null) {
    if (this.state[field] === '') {
      return false
    }
    if (compare && this.state[field] !== this.state[compare]) {
      return false
    }

    if (field === 'password' || field === 'repeatPassword') {
      return this.isGoodPassword(this.state[field])
    }
    return true
  }

  isGoodPassword (pwd) {
    if (pwd.length < 8) {
      return false
    }
    let regex = /[a-z]/
    if (!regex.test(pwd)) {
      return false
    }
    regex = /[A-Z]/
    if (!regex.test(pwd)) {
      return false
    }
    regex = /[0-9]/
    if (!regex.test(pwd)) {
      return false
    }

    return true
  }

  showLoading = (visible) => {
    this.setState({
      isLoading: visible
    })
  }

  onPressBack = () => {
    this.props.onBackToBuilder()
  }

  onPressNext = () => {
    const props = this.props
    const { password, repeatPassword, mobileNumber } = this.state

    let newMobileNumber = mobileNumber.replace(/^0+/, '') // remove leading zeros
    if (newMobileNumber.length > 0 && newMobileNumber[0] !== '+') {
      newMobileNumber = `+44${newMobileNumber}`
    }

    this.showLoading(true)
    Rest.setPassword(password, repeatPassword).then(res => {
      return Rest.signup2fa(newMobileNumber)
    })
    .then(res => {
      this.showLoading(false)
      props.changeMobileNumber(mobileNumber)
      props.jumpToStep(this.location + 1)
    }).catch(error => {
      this.showLoading(false)
      alert(error.message || 'Something went wrong!')
    })
  }

  render () {
    const valid = this.formValidation()
    const { isLoading } = this.state

    return (
      <div>
        <div className='Title'>Let’s create your password</div>
        <div className='Description'>{`Please choose a strong password you are not using elsewhere. You password must have a minimum of 8 characters,
                                        and contain at least one number, one uppercase letter, and one lower case letter.`}</div>
        <div className='Form CreatePassword'>
          <div className='Field Check'>
            <div className='Label'>Password</div>
            {this.fieldValidation('password') && <img src={this.props.CheckSVG} />}
            <input type='password' id='password' value={this.state.password} className='Input' onChange={this.handleInputChange} placeholder='Enter password' />
          </div>
          <div className='Field Check'>
            <div className='Label'>Repeat Password</div>
            {this.fieldValidation('repeatPassword', 'password') && <img src={this.props.CheckSVG} />}
            <input type='password' id='repeatPassword' value={this.state.repeatPassword} className='Input' onChange={this.handleInputChange} placeholder='Enter password' />
          </div>
          <div className='Description'>{`For your security, we would also require your mobile number, in order to enable an extra layer of authentication
                                      to access your account in the future. You will then receive a confirmation code via SMS, to be entered in the next page.`}</div>
          <div className='Field Check'>
            <div className='Label'>Mobile Number</div>
            {this.fieldValidation('mobileNumber') && <img src={this.props.CheckSVG} />}
            <input id='mobileNumber' value={this.state.mobileNumber} className='Input' onChange={this.handleInputChange} placeholder='Enter mobile number' />
          </div>
          <div className='Field' />
        </div>
        <div className='footer-buttons'>
          <button className='Button Prev' onClick={this.onPressBack}>Back</button>
          <ButtonLoader
            className={`Next ${valid ? '' : 'Disabled'}`}
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

})

const mapDispatchToProps = {
  changeMobileNumber: UserActions.changeMobileNumber
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePassword)
