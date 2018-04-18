import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ScoringActions, UserActions, ProductActions, OfferActions } from '../../store'
import { Rest } from '../../services'
import './Welcome.scss'

class Welcome extends Component {
  constructor (props) {
    super(props)

    this.state = {
      verified: true
    }
  }

  componentDidMount () {
    this.doDemoSignin()
  }

  doDemoSignin = () => {
    Rest.signin('user22@numeos.com', 'test').then(res => {
      this.props.saveUser(res.data)
      return Rest.getMeInfo()
    }).then(res => {
      this.props.saveUser(res.data)
    }).catch(error => {
      alert(error.message || 'Something went wrong!')
    })
  }

  handleClick = (props, state) => {
    console.log(props)
  }

  handleToQuestionnaire = () => {
    const props = this.props

    Rest.getScoring().then(res => {
      props.saveQuestions(res.data.questions)
      props.router.push('/questionnaire')
    }).catch(error => {
      alert(error.message || 'Something went wrong!')
    })
  }

  handleToAccountSimulator = () => {
    const props = this.props
    props.saveDefaultScoring()

    Rest.getProducts().then(res => {
      props.saveProducts(res.data)
      return Rest.getCustomerOffers()
    }).then(res => {
      props.saveOffers(res.data)
      props.router.push('/questionnaire')
    }).catch(error => {
      alert(error.message || 'Something went wrong!')
    })
  }

  render () {
    const props = this.props
    const { verified } = this.state

    return (
      <div className='Welcome'>
        <div className='WelcomeWrapper'>
          {
            // props.params.id == 'verify'
            //   ?
            //   <div className='Form'>
            //     <div className='Title'>Welcome to the Numeos account builder</div>
            //     <div className='SubTitle NotVerified'>Thanks. The validation email has been sent to you <span className='Email'>{props.user.email}</span>. Please click on the link contained in it to confirm your email and to continue the registration.</div>
            //     <div className='SubTitle'>Didn’t get the email? <span className='TryAgain'>Try again</span></div>
            //   </div>
            //   :
            <div className='Form'>
              <div className='Title'>Welcome to the Numeos account builder</div>
              <div>
                <div className='SubTitle Verified'>To get started, we recommend a short 2 minute questionnaire. Our customers say it helps a lot to configure the savings account most suited to you and your objectives.</div>
                {verified && <div className='Button' style={{ marginTop: 24 }} onClick={this.handleToQuestionnaire}>START WITH QUESTIONS</div>}
                <div className='SubTitle CustomTitle'>Or you can jump directly to building your savings account.</div>
                {verified && <div className='Button White' onClick={this.handleToAccountSimulator}>GO STRAIGHT TO THE ACCOUNT BUILDER</div>}
              </div>
            </div>
          }
        </div>
        <div className={'Footer'}>
          {
            props.user ? null
              : <a className='Next Button' onClick={() => { this.handleClick(props, this.state) }}>Verify</a>
          }
        </div>
      </div >
    )
  }
}

Welcome.propTypes = {
  user: PropTypes.object,
  saveQuestions: PropTypes.func.isRequired,
  saveUser: PropTypes.func.isRequired,
  saveProducts: PropTypes.func.isRequired,
  saveOffers: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  saveDefaultScoring: ScoringActions.setDefaultScoring,
  saveQuestions: ScoringActions.saveQuestions,
  saveUser: UserActions.saveUser,
  saveProducts: ProductActions.saveProducts,
  saveOffers: OfferActions.saveOffers
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
