import React, { Component } from 'react'
import './NuInput.css'

export class NuInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value,
      prefix: props.prefix || '',
      suffix: props.suffix || '',
      precision: props.precision || 0
    }
  }

  getOutput () {
    let dotPos = Math.pow(10, this.state.precision)
    let num = Math.round(this.state.value * dotPos)
    num = num / dotPos
    return this.addCommas(this.state.prefix + num + this.state.suffix)
  }

  addCommas (intNum) {
    return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }

  onChange () {

  }

  componentWillReceiveProps (newProps) {
    this.setState({
      value: newProps.value,
      prefix: newProps.prefix || '',
      suffix: newProps.suffix || '',
      precision: newProps.precision || 0
    })
  }

  render () {
    return (
      <input
        value={this.getOutput()}
        onChange={this.onChange()}
        disabled
      />
    )
  }
}

export default NuInput
