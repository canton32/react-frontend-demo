import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { CircularSlider, Info } from '../../../../../../../components/common'
import { Util } from '../../../../../../../services'
import './ProductPreview.scss'

class ProductPreview extends Component {
  constructor (props) {
    super(props)

    const { offer, products } = props
    const total = parseFloat(offer.positions[0].amount) + parseFloat(offer.positions[1].amount)
    const selection = [offer.positions[0].product, offer.positions[1].product]
    const pp = Util.buildPP(products, selection)
    const productPercent = (pp[11].id === offer.positions[0].product) ? parseFloat(offer.positions[0].amount) / total : parseFloat(offer.positions[1].amount) / total

    const C15 = total
    const C17 = total * productPercent
    const C19 = pp[11].rate / 100
    const C21 = total - C17
    const C23 = pp[22].rate / 100

    const rate = (C19 * 100 * C17 / C15 + C23 * 100 * C21 / C15)

    this.state = {
      total: Util.numberWithCommas(`£${total}`),
      productPercent,
      titleLeft:  pp[22].description,
      titleRight: pp[11].description,
      amountLeft:  Util.numberWithCommas(`£${total - Math.round(total * productPercent)}`),
      amountRight: Util.numberWithCommas(`£${Math.round(total * productPercent)}`),
      combinedRate: `${rate.toFixed(2)}%`
    }
  }

  renderPot = (direction) => {
    const { titleLeft, titleRight, amountLeft, amountRight } = this.state
    let tooltip, title, value

    if (direction == 'Left') {
      title = titleLeft
      tooltip = `<b>Locking access</b> gives you a higher rate of interest, but also means that withdrawals are not permitted during the term.<br><br>
      <b>Unlocking access</b> means you are able to withdraw funds at any time, but lose any interest accrued.`
      value = amountLeft
    } else {
      title = titleRight
      tooltip = '<b>30-day notice</b> allows you to earn a higher interest rate, but you will have to wait for 30 days before the funds are released.'
      value = amountRight
    }

    return (
      <div className={`Pot ${direction}`}>
        <div className='Title'>
          {title}&nbsp;
          <Info tooltip={tooltip} />
          <ReactTooltip class='customeTheme' delayHide={1000} html effect='solid' />
        </div>
        <div className='Content'>{value}</div>
      </div>
    )
  }

  renderPotWrapper = () => {
    return (
      <div className='PotWrapper'>
        {this.renderPot('Left')}
        {this.renderPot('Right')}
      </div>
    )
  }

  render () {
    const { total, productPercent, combinedRate } = this.state
    return (
      <div className='ProductPreview'>
        <div className='LumpSum'>
          <div className='Title'>Lump Saving Sum</div>
          <div className='Content'>{total}</div>
        </div>
        <div className='AccessLevel'>
          <div className='Title'>Access Level</div>
          <CircularSlider
            radius={36}
            value={productPercent * 100}
            showTitle={false}
            showHandle={false} />
        </div>
        {this.renderPotWrapper()}
        <div className='InterestRate'>
          <div className='Title'>Combined Interest Rate</div>
          <div className='Content'>{combinedRate}</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  offer: state.offer,
  products: state.product
})

export default connect(mapStateToProps, null)(ProductPreview)
