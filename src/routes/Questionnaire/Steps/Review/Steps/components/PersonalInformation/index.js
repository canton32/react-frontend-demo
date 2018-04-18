import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Util } from '../../../../../../../services'
import './PersonalInformation.scss'

class PersonalInformation extends Component {
  getItems () {
    const { first_name, last_name } = this.props.user
    const { gender, birthdate, mobile, phone, tax_residence, tax_id, us_residence, address } = this.props.user.customer_user
    const { address1, address2, postcode, city, country } = address
    const { bank_code, bank_account_number } = this.props.user.customer_account

    const information_data = [
      { field: 'First Name', value: first_name },
      { field: 'Last Name', value: last_name },
      { field: 'Gender', value: gender === 1 ? 'Male' : 'Female' },
      { field: 'Date of Birth', value: birthdate },
      { field: 'Mobile Phone', value: mobile },
      { field: 'Land Line', value: phone },
      { field: 'Nationality', value: country },
      { field: 'Tax Residence', value: tax_residence },
      { field: 'Tax ID / NI', value: tax_id },
      { field: 'Sort Code', value: bank_code },
      { field: 'Account No', value: bank_account_number },
      { field: 'US Person', value: us_residence ? 'Yes' : 'No' },
      { field: 'Address', value: Util.prettifyAddress(`${address1}, ${address2}, ${postcode}, ${city}`) }
    ]

    return information_data.map((datum, i) =>
      <div className='PersonalInformationItem' key={`PersonalInformationItem_${i}`}>
        <div>{datum.field}</div>
        <div>{datum.value}</div>
      </div>
    )
  }

  render () {
    return (
      <div className='PersonalInformation'>
        <div>
          {this.getItems()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(PersonalInformation)
