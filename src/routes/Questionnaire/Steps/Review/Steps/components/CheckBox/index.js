import React, { Component } from 'react'
import './CheckBox.scss'

class CheckBox extends Component {
  render () {
    const { checked, onChange } = this.props

    return (
      <label className='checkbox_wrapper'>
        <input type='checkbox' onChange={onChange} checked={checked} />
        <span className='checkmark' />
      </label>
    )
  }
}

export default CheckBox
