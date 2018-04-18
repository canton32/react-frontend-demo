import React, { Component } from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import Modal from 'react-responsive-modal'
import ProductPreview from './components/ProductPreview'
import PartnerBankTable from './components/PartnerBankTable'
import CheckBox from './components/CheckBox'
import ViewAccountDetails from './ViewAccountDetails'
import { ButtonLoader } from '../../../../../components/common'
import { PortfolioActions, UserActions } from '../../../../../store'
import { Rest, Util } from '../../../../../services'

class PartnerBankAccounts extends Component {
  location = 0

  constructor (props) {
    super(props)

    const { accounts, is_direct_debit } = this.props.portfolio
    const array_checked = accounts.map(() => false)

    this.state = {
      isShowingModal: false,
      valid: false,
      array_checked,
      is_direct_debit,
      isLoading: false
    }
  }

  componentDidMount () {
    Util.showBlurOverlay(false)
  }

  onPressBack = () => {
    this.props.onBackToDetails()
  }

  showLoading = (visible) => {
    this.setState({
      isLoading: visible
    })
  }

  onPressNext = () => {
    const props = this.props

    props.setIsDirectDebit(this.state.is_direct_debit)
    this.showLoading(true)
    Rest.getMeInfo().then(res => {
      this.showLoading(false)
      props.saveUser(res.data)
      props.jumpToStep(this.location + 1)
    }).catch(error => {
      this.showLoading(false)
      alert(error.message || 'Something went wrong!')
    })
  }

  onCloseModal = () => {
    Util.showBlurOverlay(false)

    this.setState({ isShowingModal: false })
  }

  onClickViewAccountDetails = (index) => {
    Util.showBlurOverlay(true)

    const { accounts } = this.props.portfolio
    const account = accounts[index]

    this.setState({
      accountSelected: account,
      isShowingModal: true
    })
  }

  validateChecked = (array_checked) => {
    for (let i = 0; i < array_checked.length; i += 1) {
      if (!array_checked[i]) {
        return false
      }
    }

    return true
  }

  onChangeCheckBox = (index, checked) => {
    let array_checked = [...this.state.array_checked]
    array_checked[index] = checked
    this.setState({
      array_checked,
      valid: this.validateChecked(array_checked)
    })
  }

  onChangeDirectDebit = (e) => {
    this.setState({
      is_direct_debit: e.target.checked
    })
  }

  render () {
    const { isShowingModal, valid, accountSelected, is_direct_debit, isLoading } = this.state

    return (
      <div className='PartnerBankAccounts'>
        <div className='PartnerBankAccountsWrapper'>
          <MediaQuery minWidth={769}>
            <div className='ProductPreviewWrapper'>
              <div className='SubTitle'>My Numeos product</div>
              <ProductPreview />
            </div>
          </MediaQuery>
          <div className='PartnerBankTableWrapper'>
            <div className='SubTitle'>We will open the following accounts</div>
            <PartnerBankTable
              onClickViewAccountDetails={this.onClickViewAccountDetails}
              onChangeCheckBox={this.onChangeCheckBox}
            />
            <div className='OptionalDirectDebitWrapper'>
              <div className='OptionalDirectDebit'>Optional Direct Debit</div>
              <div className='OptionalDirectDebitCheckItem'>
                <div>Allow use of <span className='hyperlink'>Direct Debit</span> to collect these amounts from your nominated account to the new accounts.</div>
                <CheckBox onChange={this.onChangeDirectDebit} checked={is_direct_debit} />
              </div>
            </div>
          </div>
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

        <Modal
          open={isShowingModal}
          onClose={this.onCloseModal}
          closeOnOverlayClick={false}
          classNames={{ overlay: 'overlay-view-account-details', modal: 'modal-view-account-details', closeIcon: 'closeIcon-view-account-details' }}
          >
          <ViewAccountDetails account={accountSelected} />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.portfolio
})

const mapDispatchToProps = {
  setIsDirectDebit: PortfolioActions.setIsDirectDebit,
  saveUser: UserActions.saveUser,
  saveCustomerAccount: UserActions.saveCustomerAccount
}

export default connect(mapStateToProps, mapDispatchToProps)(PartnerBankAccounts)
