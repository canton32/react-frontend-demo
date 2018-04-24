import React, { Component } from 'react'
import { connect } from 'react-redux'
import Countries from '../../assets/Countries'
import { UserActions } from '../../../../../store'

class PersonalInformation extends Component {
  location = 2

  constructor (props) {
    super(props)

    const { first_name, last_name } = props.user
    const { title, gender, birthdate, address } = props.user.customer_user

    this.state = {
      title: title || 'Mr',
      firstName: first_name || '',
      lastName: last_name || '',
      gender: gender || 0,
      dateOfBirth: birthdate || '', // '2018-01-01',
      nationality: address.country || 'GB'
    }
  }

  handleInputChange = (event) => {
    let id = event.target.id

    this.setState({
      [id]: event.target.value
    })
  }

  formValidation () {
    const { title, firstName, lastName, gender, nationality } = this.state
    if (title === '') return false
    if (firstName === '') return false
    if (lastName === '') return false
    if (gender === 0) return false
    if (nationality === '') return false
    return true
  }

  onPressBack = () => {
    this.props.jumpToStep(this.location - 1)
  }

  onPressNext = () => {
    const props = this.props
    const { firstName, lastName, gender, dateOfBirth, nationality } = this.state

    props.saveCustomerUser({
      first_name: firstName,
      last_name: lastName,
      gender,
      birthdate: dateOfBirth
    })
    props.saveAddress({
      country: nationality
    })
    props.jumpToStep(this.location + 1)
  }

  render () {
    const valid = this.formValidation()
    const { title, firstName, lastName, gender, nationality, dateOfBirth } = this.state

    return (
      <div>
        <div className='SubTitle'>
          Personal information
          {valid && <img src={this.props.CheckSVG} />}
        </div>
        <div className='Form PersonalInformation'>
          <div className='Field Title'>
            <div className='Label'>Title</div>
            <select id='title' value={title} className='Select' onChange={this.handleInputChange}>
              <option value=''>Title</option>
              <option value='Mr'>Mr</option>
              <option value='Ms'>Ms</option>
              <option value='Dr'>Dr</option>
            </select>
          </div>
          <div className='Field'>
            <div className='Label'>First Name(s)</div>
            <input id='firstName' value={firstName} className='Input' onChange={this.handleInputChange} placeholder='Enter first name(s)' />
          </div>
          <div className='Field LastName'>
            <div className='Label'>Last Name</div>
            <input id='lastName' value={lastName} className='Input' onChange={this.handleInputChange} placeholder='Enter last name' />
          </div>
          <div className='Field Gender'>
            <div className='Label'>Gender</div>
            <select id='gender' value={gender} className='Select' onChange={this.handleInputChange}>
              <option value={0}>Choose gender</option>
              <option value={1}>Male</option>
              <option value={2}>Female</option>
            </select>
          </div>
          <div className='Field'>
            <div className='Label'>Nationality</div>
            <select id='nationality' value={nationality} className='Select' onChange={this.handleInputChange}>
              <option value=''>Choose nationality</option>
              {
                Countries.map((item, index) => {
                  return (
                    <option key={index} value={item.code}>{item.name}</option>
                  )
                })
              }
            </select>
          </div>
          <div className='Field DateOfBirth'>
            <div className='Label'>Date of Birth</div>
            <input id='dateOfBirth' value={dateOfBirth} className='Input' onChange={this.handleInputChange} placeholder='Enter date of birth' type='Date' />
          </div>
        </div>
        <div className='footer-buttons'>
          {/* <button className="Button Prev" onClick={this.onPressBack}>Back</button> */}
          <div />
          <button className={`Button Next ${valid ? '' : 'Disabled'}`} onClick={valid ? this.onPressNext : null}>Next</button>
          <div className='Info'>Questions? <span className='ChatWithUs'>Chat with us</span> or call on +44 20 3870 4200</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = {
  saveCustomerUser: UserActions.saveCustomerUser,
  saveAddress: UserActions.saveAddress
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInformation)
