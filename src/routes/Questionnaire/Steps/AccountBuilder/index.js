import React, { Component } from 'react'
import { connect } from 'react-redux'
import Toggle from 'react-toggle'
import ReactTooltip from 'react-tooltip'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import 'react-circular-progressbar/docs/styles.css'

import CurrencyInput from './components/currency-input/CurrencyInput'
import { Info, ButtonLoader, CircularSlider, Modal } from '../../../../components/common'

import './components/toggle/react-toggle-style.css'
import './AccountBuilder.scss'

import { Rest, Util } from '../../../../services'
import { OfferActions, UIActions } from '../../../../store'
import CustomisePots from './CustomisePots'

const descriptions = {
  '22': 'I can completely lock access to this pot',
  '11': 'I can give 30-day notice to withdraw',
}

class AccountBuilder extends Component {
  percentStep = 1

  constructor (props) {
    super(props)

    const { offer, questions, answers } = props
    const amount = parseFloat(offer.positions[0].amount) + parseFloat(offer.positions[1].amount)
    const selection = [offer.positions[0].product, offer.positions[1].product]
    const pp = this.buildPP(selection)
    const productPercent = (pp[11].id === offer.positions[0].product) ? parseFloat(offer.positions[0].amount) / amount : parseFloat(offer.positions[1].amount) / amount

    let modal = {}
    selection.forEach((product, index) => {
      modal['product-' + product.id] = true
    })

    const { objective } = answers.data

    let objectiveChoices = [], objectiveAnswers = []
    if (questions.length > 1) {
      objectiveChoices = questions[1].choices
      objectiveAnswers = objective
    }

    this.percentStep = 125 * 100 / amount

    this.state = {
      total: amount,
      objectiveAnswers,
      objectiveChoices,
      pp,
      selection,
      modal,
      productPercent,
      isShowingModal: false,
      isChoosingProduct: false
    }
  }

  componentDidMount () {
    const { questions } = this.props

    if (questions.length == 0) {
      setTimeout(() => {
        this.setState({
          isShowingModal: true
        })
      }, 100)
    }

    Util.showBlurOverlay(false)
  }

  isString = (object) => {
    return typeof (object) === 'string' || object instanceof String
  }
  onProducts = () => {
    const { products } = this.props

    let state = Object.assign({}, this.state)
    const { modal } = state
    let selection = []
    Object.keys(products).forEach((productId) => {
      if (modal['product-' + productId]) selection.push(products[productId])
    })
    this.setProducts(selection)
    this.handleClose()
  }

  getSelection () {
    const { products } = this.props

    const { modal } = this.state
    let selection = []

    Object.keys(products).forEach((productId) => {
      if (modal['product-' + productId]) selection.push(productId)
    })

    return selection.length == 2
  }

  handleProductsChange = (data) => {
    const { products } = this.props

    let id = data.target.id
    let state = Object.assign({}, this.state)
    let selection = []
    const { modal } = state
    Object.keys(products).forEach((productId) => {
      if (modal['product-' + productId]) selection.push(productId)
    })
    if (selection.length < 2 || (selection.length == 2 && !data.target.checked)) {
      modal[id] = data.target.checked
    } else {
      modal[id] = !data.target.checked
      alert('You cannot select more than 2 products')
    }
    this.handleUpdate(state)
  }

  buildPP = (selection) => {
    return Util.buildPP(this.props.products, selection)
  }

  setProducts (selection) {
    const pp = this.buildPP(selection)

    this.setState({
      pp,
      selection
    })
  }

  handleClick = () => {
    Util.showBlurOverlay(true)
    this.setState({ isShowingModal: true })
  }

  handleClose = () => {
    Util.showBlurOverlay(false)
    this.setState({ isShowingModal: false })
  }

  getC27 = () => {
    const { pp } = this.state
    return Math.max(Number(pp[11].term_years) || 1, Number(pp[22].term_years) || 1)
  }

  calculator (type) {
    let ret = 0
    const { total, pp, productPercent } = this.state
    const C15 = total
    const C17 = total * productPercent
    const C19 = pp[11].rate / 100
    const C21 = total - C17
    const C23 = pp[22].rate / 100
    const C27 = this.getC27()
    if (type === 1) {
      // =C19*C17/C15+C23*C21/C15
      ret = (C19 * 100 * C17 / C15 + C23 * 100 * C21 / C15)
    } else {
      // =ROUND(C17*((1+C19)^C27-1)+C21*((1+C23)^C27-1),0)
      ret = Math.round(C17 * (Math.pow((1 + C19), C27) - 1) + C21 * (Math.pow((1 + C23), C27) - 1))
    }
    return ret
  }

  handleUpdate = (state) => {
    this.setState(state)
  }

  handleTofuChange = (event) => {
    const { products } = this.props
    const pp = { ...this.state.pp }
    let id = event.target.id

    if (pp[id].type === 11) {
      if (event.target.checked) {
        pp[id] = products[pp[id].id + 1]
      } else {
        pp[id] = products[pp[id].id - 1]
      }
    } else {
      if (event.target.checked) {
        pp[id] = products[pp[id].id - 2]
      } else {
        pp[id] = products[pp[id].id + 2]
      }
    }

    let selection = [pp[22].id, pp[11].id]

    let modal = {}
    selection.forEach((product, index) => {
      modal['product-' + product.id] = true
    })

    this.setState({
      pp,
      selection,
      modal
    })
  }

  handleSliderChange = (percent) => {
    let state = Object.assign({}, this.state)
    state.productPercent = percent / 100
    this.handleUpdate(state)
  }

  onPressBack = () => {
    const props = this.props
    const { questions, onBackToWelcome } = props

    if (questions.length === 0) {
      onBackToWelcome()
    } else {
      props.jumpToStep(0)
    }
  }

  showLoading = (visible) => {
    this.setState({
      isChoosingProduct: visible
    })
  }

  onPressChooseProduct = () => {
    const props = this.props
    const { total, pp, productPercent } = this.state
    const positions = [
      {
        amount: `${total - Math.round(total * productPercent)}`,
        product: pp[22].id
      },
      {
        amount: `${Math.round(total * productPercent)}`,
        product: pp[11].id
      }
    ]

    this.showLoading(true)
    Rest.postCustomerOffers(positions).then(res => {
      this.showLoading(false)
      props.saveOffers(res.data)
      props.setStartAtFirstDetail(true)
      props.jumpToStep(2)
    }).catch(error => {
      this.showLoading(false)
      alert(error.message)
    })
  }

  renderPotToggle = (direction) => {
    const { total, pp, productPercent } = this.state

    let title, id, checked, description, tooltip, inputId, inputValue, inputColor
    if (direction === 'Left') {
      title = pp[22].description
      id = '22'
      checked = (pp[22].type === 22 ? !pp[22].option_is_access_prior : pp[22].option_is_notice_period)
      description = descriptions[pp[22].type]
      tooltip = `<b>Locking access</b> gives you a higher rate of interest, but also means that withdrawals are not permitted during the term.<br><br>
                  <b>Unlocking access</b> means you are able to withdraw funds at any time, but lose any interest accrued.`
      inputId = 'fixedPot'
      inputValue = total - Math.round(total * productPercent)
      inputColor = '#3BB4DC'
    } else {
      title = pp[11].description
      id = '11'
      checked = (pp[11].type === 22 ? !pp[11].option_is_access_prior : pp[11].option_is_notice_period)
      description = descriptions[pp[11].type]
      tooltip = '<b>30-day notice</b> allows you to earn a higher interest rate, but you will have to wait for 30 days before the funds are released.'
      inputId = 'accessPot'
      inputValue = Math.round(total * productPercent)
      inputColor = '#6ABF82'
    }

    return (
      <div className={`ToggleWrapper ${direction}`}>
        <div className='ToggleTitle'>{title}</div>
        <div className={`ToggleBody ${direction}`}>
          <Toggle
            id={id}
            checked={checked}
            icons={false}
            onChange={this.handleTofuChange} />
          <div className={`ToggleSubTitle ${direction}`}>
            <div>
              {description} &nbsp;
              <Info tooltip={tooltip} />
              <ReactTooltip class='customeTheme' delayHide={1000} html effect='solid' />
            </div>
          </div>
        </div>
        <CurrencyInput id={inputId} value={inputValue} onChange={this.handleUpdate} color={inputColor} disabled />
      </div>
    )
  }

  renderPotToggleWrapper = () => {
    const { productPercent } = this.state

    return (
      <div className='PotToggleWrapper'>
        { this.renderPotToggle('Left') }
        <div className='CircularSliderWrapper'>
          <CircularSlider
            step={this.percentStep}
            value={productPercent * 100}
            onChange={this.handleSliderChange} />
        </div>
        { this.renderPotToggle('Right') }
      </div>
    )
  }

  render () {
    const { products } = this.props

    const { total, objectiveAnswers, objectiveChoices, modal, isChoosingProduct, isShowingModal } = this.state

    return (
      <div className='AccountBuilderWrapper'>
        <div className='MobileTitle'>Account Builder</div>
        <div className='AccountBuilder'>
          <div className='Header'>
            <div className='LumpSum GreyBlock'>
              <div className='Title'>Your lump sum</div>
              <div className='SubTitle'>Fully FSCS protected, even beyond the £85,000 limit</div>
              <div className='Content'>
                <CurrencyInput value={total} onChange={this.handleUpdate} />
              </div>
            </div>
            <div className='Goals GreyBlock'>
              <div className='Title'>Your goals</div>
              <div className='SubTitle'>Including your timeline and access constraints</div>
              {
                objectiveAnswers.length > 0 &&
                <div className='Content'>
                  <div className='Products'>
                    {
                    objectiveAnswers.map((answer, index) => {
                      return (
                        <div key={index} className='Product ImageWrapper'>
                          {
                            Number(objectiveChoices[answer - 1][0]) < 8
                            ? <div className='Image'>
                              <img src={require(`../Questions/Images/type${objectiveChoices[answer - 1][0]}.svg`)} />
                            </div>
                            : <div className='Image Text'>
                              ?
                            </div>
                          }
                          <div className='Text'>{objectiveChoices[answer - 1][1]}</div>
                        </div>
                      )
                    })
                  }
                  </div>
                </div>
              }
            </div>
          </div>

          { this.renderPotToggleWrapper() }

          <div className='Footer'>
            <div className='GreyBlock'>
              <div className='InterestBlock'>
                <div className='SubTitle'>YOUR RATE (AER)</div>
                <div className='Amount'>{this.calculator(1).toFixed(2)}%</div>
              </div>
              <div className='InterestRateOffer'>
                Our offer<br />
                <div className='SubDescription'>We compute this rate by fittingly combining offers from our partners</div>
              </div>
              <div className='InterestBlock'>
                <div className='SubTitle'>INTEREST AFTER {this.getC27()} YEAR{this.getC27() > 1 && 'S'}</div>
                <div className='Amount'>£{this.calculator(2)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='footer-buttons'>
          <button className='Button Prev' onClick={this.onPressBack}>Back</button>
          <div className='CustomisePots'>
            <div className='InfoText'>Want to tweak this?</div>
            <button className='Button' onClick={this.handleClick}>Customise my pots</button>
          </div>
          <ButtonLoader
            className='Next'
            onClick={this.onPressChooseProduct}
            text='Choose this product'
            isLoading={isChoosingProduct} />
          {
            <Modal
              open={isShowingModal}
              onClose={this.handleClose}>
              <CustomisePots
                products={products}
                modal={modal}
                handleProductsChange={this.handleProductsChange}
                onProducts={this.onProducts}
              />
            </Modal>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  questions: state.scoring.questions,
  answers: state.scoring.answers,
  products: state.product,
  offer: state.offer
})

const mapDispatchToProps = {
  setStartAtFirstDetail: UIActions.setStartAtFirstDetail,
  saveOffers: OfferActions.saveOffers
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountBuilder)
