import React, { Component } from 'react'
import { connect } from 'react-redux'
import PartnerBankTableCell from './PartnerBankTableCell'
import { Util } from '../../../../../../../services'
import img_bank_tesco from '../../../../../../../images/bank_tesco.png'
import img_bank_ford from '../../../../../../../images/bank_ford.png'
import img_bank_tandem from '../../../../../../../images/bank_tandem.png'
import './PartnerBankTable.scss'

const account_images = {
  1 : img_bank_tesco,
  2 : img_bank_ford,
  3 : img_bank_tandem,
}

class PartnerBankTable extends Component {
  getItems () {
    const { accounts } = this.props.portfolio

    return accounts.map((account, i) =>
      <PartnerBankTableCell key={`PartnerBankTableCell_${i}`}
        index={i}
        image={account_images[account.bank.id]}
        name={account.bank.name}
        amount={Util.numberWithCommas(`£${account.balance_amount}`)}
        keyinfo={account.bank_term.name}
        documentTerms={account.bank_term.document_terms}
        onClickViewAccountDetails={this.props.onClickViewAccountDetails}
        onChangeCheckBox={this.props.onChangeCheckBox} />
    )
  }

  render () {
    return (
      <div className='PartnerBankTable'>
        <div className='TableHead'>
          <div className='TableRowWrapper'>
            <div className='TableRow'>
              <div>Bank Account</div>
              <div>Amount</div>
              <div>Key Info</div>
            </div>
            <div className='AgreeLabel'><div>I agree to open this account</div></div>
          </div>
        </div>
        <div className='TableBody'>
          {this.getItems()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.portfolio
})

export default connect(mapStateToProps)(PartnerBankTable)
