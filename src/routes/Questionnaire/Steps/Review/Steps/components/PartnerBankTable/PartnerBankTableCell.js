import React, { Component } from 'react'
import MediaQuery from 'react-responsive'
import CheckBox from '../CheckBox'
import './PartnerBankTable.scss'

class PartnerBankTableCell extends Component {
  render () {
    const { image, name, amount, keyinfo, documentTerms, index, onClickViewAccountDetails, onChangeCheckBox } = this.props

    return (
      <div className='TableRowWrapper'>
        <div className='TableRow PartnerBankTableCell'>
          <MediaQuery maxWidth={768}>
            {(matches) => {
              if (matches) {
                return (
                  <div>
                    <img src={image} width='50px' height='50px' />
                  </div>
                )
              } else {
                return (
                  <div>
                    <img src={image} width='40px' height='40px' />
                    {name}
                  </div>
                )
              }
            }}
          </MediaQuery>
          <div>
            {amount}
          </div>
          <div>
            • {keyinfo}<br />
            • <a className='hyperlink' target='_blank' href={documentTerms}>Terms & conditions</a><br />
            • <span className='hyperlink' onClick={() => onClickViewAccountDetails(index)}>View account details</span>
          </div>
        </div>
        <div>
          <CheckBox onChange={(e) => onChangeCheckBox(index, e.target.checked)} />
        </div>
      </div>
    )
  }
}

export default PartnerBankTableCell
