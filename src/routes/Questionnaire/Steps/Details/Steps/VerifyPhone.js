import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Rest } from '../../../../../services'
import { ButtonLoader } from '../../../../../components/common'

class VerifyPhone extends Component {
  location = 1

  constructor (props) {
    super(props)

    this.state = {
      verifyCode: '',
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
    if (this.state.verifyCode === '') return false
    return true
  }

  fieldValidation (field, compare = null) {
    if (this.state[field] === '') return false
    if (this.state[field].length !== 6) return false
    if (compare && this.state[field] !== this.state[compare]) return false
    return true
  }

  onPressBack = () => {
    this.props.jumpToStep(this.location - 1)
  }

  showLoading = (visible) => {
    this.setState({
      isLoading: visible
    })
  }

  onPressNext = () => {
    const props = this.props
    const { mobileNumber } = props
    const { verifyCode } = this.state

    let newMobileNumber = mobileNumber.replace(/^0+/, '') // remove leading zeros
    if (newMobileNumber.length > 0 && newMobileNumber[0] !== '+') {
      newMobileNumber = `+44${newMobileNumber}`
    }

    this.showLoading(true)
    Rest.signup2faVerification(newMobileNumber, verifyCode).then(res => {
      this.showLoading(false)
      props.jumpToStep(this.location + 1)
    }).catch(error => {
      this.showLoading(false)
      alert(error.message || 'Something went wrong!')
    })
  }

  render () {
    const { mobileNumber, CheckSVG } = this.props
    const { verifyCode, isLoading } = this.state
    const valid = this.fieldValidation('verifyCode')

    return (
      <div>
        <div className='Title'>Verify your phone number</div>
        <div className='Description' style={{ maxWidth: 495 }}> An SMS with a 6-digit verification code has been sent to <strong style={{ color: 'black' }}>{mobileNumber}</strong>.<br /> Please enter it in the field below.</div>
        <div className='SubTitle' />
        <div className='Form VerifyPhone'>
          <div className='Field Check'>
            <div className='Label'>SMS VERIFICATION CODE</div>
            {this.fieldValidation('verifyCode') && <img src={CheckSVG} />}
            <input type='password' id='verifyCode' value={verifyCode} className='Input' onChange={this.handleInputChange} placeholder='Enter 6-digit code' />
          </div>
          <div className='FooterText'>Didn’t get the SMS? <a>Try again</a></div>
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
  mobileNumber: state.user.customer_user.mobile
})

export default connect(mapStateToProps)(VerifyPhone)
