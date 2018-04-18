import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './AuthView.scss'

import { UserActions, ProductActions, OfferActions, ScoringActions } from '../../store'
import { Rest } from '../../services'

import CheckSVG from '../../images/check.svg'

const formTypes = {
  firstName: 'string',
  lastName: 'string',
  email: 'email'
}

class AuthView extends Component {
  componentDidMount () {
    this.props.setDefaultUser()
    this.props.setDefaultProducts()
    this.props.setDefaultOffer()
    this.props.setDefaultScoring()
  }

  validate = (value, type = 'string') => {
    if (type === 'string') return value !== ''
    if (type === 'email') return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
    return true
  }

  validateAll = () => {
    const props = this.props

    for (let key in formTypes) {
      if (!this.validate(props[key], formTypes[key])) return false
    }
    return true
  }

  handleSubmit = () => {
    const props = this.props

    Rest.signupCustomerUser(props.firstName, props.lastName, props.email).then(res => {
      props.saveUser(res.data)
      props.router.push('welcome/verify')
    }).catch(error => {
      alert(error.message || 'Something went wrong!')
    })
  }

  render () {
    const props = this.props

    return (
      <div className='AuthView'>
        <div className='FormWrapper'>
          <div className='Form'>
            <div className='Title'>Welcome to the Numeos account builder</div>
            <div>
              <div className='SubTitle'>First, we need to confirm your email. It will be never shared with anyone outside Numeos.</div>
              <div className='FormGroup'>
                <div>First Name</div>
                <div className='FormInput'>
                  <input
                    value={props.firstName}
                    onChange={props.changeFirstName} />
                  {
                    this.validate(props.firstName)
                      ? <img src={CheckSVG} alt='check' className='check' />
                      : null
                  }
                </div>
                <div>Last Name</div>
                <div className='FormInput'>
                  <input
                    value={props.lastName}
                    onChange={props.changeLastName} />
                  {
                    this.validate(props.lastName)
                      ? <img src={CheckSVG} alt='check' className='check' />
                      : null
                  }
                </div>
                <div>Email</div>
                <div className='FormInput'>
                  <input
                    value={props.email}
                    onChange={props.changeEmail} />
                  {
                    this.validate(props.email, 'email')
                      ? <img src={CheckSVG} alt='check' className='check' />
                      : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={'Footer ' + (this.validateAll() ? '' : 'Disabled')}>
          <a className='Next Button' onClick={this.validateAll() ? this.handleSubmit : null}>Next</a>
        </div>
      </div>
    )
  }
}

AuthView.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  changeFirstName: PropTypes.func.isRequired,
  changeLastName: PropTypes.func.isRequired,
  changeEmail: PropTypes.func.isRequired,
  saveUser: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  changeFirstName: UserActions.changeFirstName,
  changeLastName: UserActions.changeLastName,
  changeEmail: UserActions.changeEmail,
  saveUser: UserActions.saveUser,
  setDefaultUser: UserActions.setDefaultUser,
  setDefaultProducts: ProductActions.setDefaultProducts,
  setDefaultScoring: ScoringActions.setDefaultScoring,
  setDefaultOffer: OfferActions.setDefaultOffer
}

const mapStateToProps = (state) => ({
  firstName : state.user.first_name,
  lastName: state.user.last_name,
  email: state.user.email
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthView)
