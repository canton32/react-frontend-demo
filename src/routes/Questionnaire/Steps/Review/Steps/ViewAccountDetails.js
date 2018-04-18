import React, { Component } from 'react'
import { Util } from '../../../../../services'

class ViewAccountDetails extends Component {
  getItems () {
    const { account } = this.props

    let account_data = [
      { field: 'Bank', value: account.bank.name },
      { field: 'Currency', value: account.product.currency },
      { field: 'Type of account', value: account.product.type === 11 ? 'Easy Access' : 'Fixed Term' }
    ]

    if (account.product.type === 22) {
      account_data = [
        ...account_data,
        { field: 'Term', value: `${account.product.term_years} year${account.product.term_years > 1 ? 's' : ''}` }
      ]
    }

    account_data = [
      ...account_data,
      { field: 'Notice Period', value: account.product.option_is_notice_period ? `${account.product.option_notice_period} days` : 'None' },
      { field: 'Interest Rate', value: `${account.rate.toFixed(2)}%` },
      { field: 'Allow Joint Account', value: account.bank_term.is_joint_accounts ? 'Yes' : 'No' },
      { field: 'Allow Overseas residents', value: account.bank_term.is_overseas_residents ? 'Yes' : 'No' },
      { field: 'Cooling off Period (days)', value: account.bank_term.cooling_period },
      { field: 'Minimum Balance', value: `£${Util.numberWithCommas(account.bank_term.deposit_amount_min)}` },
      { field: 'Maximum Balance', value: `£${Util.numberWithCommas(account.bank_term.deposit_amount_max)}` }
    ]

    if (account.product.type === 11) {
      account_data = [
        ...account_data,
        { field: 'Allow Multiple Deposits', value: account.bank_term.deposit_is_multiple ? 'Yes' : 'No' }
      ]
    }

    const interest_period_strings = {
      1: 'Monthly',
      5: 'Yearly',
      9: 'Maturity'
    }
    account_data = [
      ...account_data,
      { field: 'Interest Paid', value: interest_period_strings[account.bank_term.interest_period] || '' }
    ]

    if (account.product.type === 22) {
      account_data = [
        ...account_data,
        { field: 'Access prior to term', value: account.product.option_is_access_prior ? 'Yes' : 'No' }
      ]

      if (account.product.option_is_access_prior) {
        account_data = [
          ...account_data,
          { field: 'Allow Partial Withdrawals', value: account.bank_term.withdrawal_is_partial ? 'Yes' : 'No' }
        ]

        if (account.bank_term.withdrawal_penalty_period) {
          account_data = [
            ...account_data,
            { field: 'Early Withdrawal Penalty', value: `${account.bank_term.withdrawal_penalty_period} days of interest` }
          ]
        }

        account_data = [
          ...account_data,
          { field: 'Penalty applies to', value: account.bank_term.withdrawal_penalty_is_full ? 'Full Amount' : 'Amount Withdrawn' }
        ]

        if (account.bank_term.withdrawal_cooling_period) {
          account_data = [
            ...account_data,
            { field: '0% Interest if Withdrawal Before', value: `${account.bank_term.withdrawal_cooling_period} days` }
          ]
        }
      }
    }

    if (account.bank_term.description) {
      account_data = [
        ...account_data,
        { field: 'Additional information', value: account.bank_term.description }
      ]
    }

    account_data = [
      ...account_data,
      { field: 'Product Information Sheet', value: account.bank_term.document_details }
    ]

    return account_data.map((datum, i) =>
      <div className='AccountDetailsItem' key={i}>
        <div className='field'>{datum.field}</div>
        {
          (i == account_data.length - 1) &&
          <div className='value'><a className='hyperlink' href={datum.value} download>Download PDF</a></div>
        }
        {
          (i != account_data.length - 1) &&
          <div className='value'>{datum.value}</div>
        }
        <div className='line-bottom' />
      </div>
    )
  }

  render () {
    return (
      <div>
        <h2>Account details</h2>
        <div className='AccountDetailsContainer'>
          {this.getItems()}
        </div>
        {/* <div className="AccountDetailsDescription">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
        </div> */}
      </div>
    )
  }
}

export default ViewAccountDetails
