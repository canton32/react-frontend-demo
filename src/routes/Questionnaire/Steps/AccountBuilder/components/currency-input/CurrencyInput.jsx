import React, { Component } from 'react'
import MediaQuery from 'react-responsive'
import { TriangleUpper, TriangleLower } from '../../../../../../components/common'
import './CurrencyInput.scss'

String.prototype.matchAll = function (regexp) {
  var matches = []
  this.replace(regexp, function () {
    var arr = ([]).slice.call(arguments, 0)
    var extras = arr.splice(-2)
    arr.index = extras[0]
    arr.input = extras[1]
    matches.push(arr)
  })
  return matches.length ? matches : null
}

var tempCount = 0

export class CurrencyInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      total: this.formatCurrency(props.value),
      disabled: props.disabled
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      total: this.formatCurrency(newProps.value),
    })
  }

  handleChange (event) {
    let id = event.target.id
    let data = {}
    data[id] = event.target.value
    this.updateState(data)
  }

  updateState (data) {
    let state = this.state
    state = Object.assign(state, data)
    this.setState(state)
    this.stateUpdated()

    // disabled by milan to stop keyboard opening when user uses triangle button
    // this.nameInput.focus()
    let start = this.nameInput.selectionStart
    start = start + tempCount
    setTimeout(() => {
      this.nameInput.selectionStart = start
      this.nameInput.selectionEnd = start
    }, 1)
  }

  stateUpdated () {
    this.props.onChange({
      total: this.getCurrencyValue(this.state.total)
    })
  }

  addCommas (intNum) {
    let num = intNum.toString().replace(/\b0+/g, '')
    return (num + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }

  getCurrencyValue (str) {
    let ret = ''
    for (let i = 0; i < str.length; i++) {
      if (str[i] >= '0' && str[i] <= '9') ret += str[i]
    }
    return ret
  }

  formatCurrency (input) {
    let data = input
    let value = this.getCurrencyValue(data.toString())
    let match = value.toString().matchAll(/\d+/g)
    value = match ? match.join('') : ''
    tempCount = 0
    if (this.state) {
      let offset = data.toString().length - this.state.total.toString().length
      let oldValue = this.getCurrencyValue(this.state.total.toString())
      if (value.toString() === oldValue.toString() && this.nameInput) {
        if (offset > 0) {
          this.nameInput.selectionStart -= offset
          this.nameInput.selectionEnd = this.nameInput.selectionStart
        } else {
          let start = this.nameInput.selectionStart - (offset === -1 ? -1 : offset)
          if (this.state.total.toString()[start - 1] === ',') {
            start -= 2
            data = data.substr(0, start) + data.substr(start + 1)
            value = this.getCurrencyValue(data.toString())
            this.nameInput.selectionStart -= 1
          }
        }
      }
    }
    tempCount += Math.ceil(value.toString().length / 3)
    if (Number(value) === 0) {
      value = '£0'
      tempCount = -100
    } else {
      value = '£' + this.addCommas(value)
      let off = 0
      if (this.state) {
        let tt = this.getCurrencyValue(this.state.total.toString())
        off = Math.ceil(tt.toString().length / 3)
      }
      tempCount -= off
    }
    return value
  }

  handleFormat = (event) => {
    if (!event.target) return
    let id = event.target.id
    let state = Object.assign({}, this.state)
    state[id] = this.formatCurrency(event.target.value)
    this.updateState(state)
  }

  onStep = (id) => {
    let state = this.state
    state.total = Number(this.getCurrencyValue(state.total)) + (id === 'total-down' ? -1000 : 1000)
    state.total = this.formatCurrency(state.total)
    this.updateState(state)
  }

  handleTouchTriangle = (event) => {
    this.onStep(event.target.id.slice(0, -11)) // remove suffix "-touch-area"
  }

  render () {
    return (
      <div className='Currency'>
        <input
          id={this.props.type || `total`}
          value={this.state.total}
          onChange={this.handleFormat}
          ref={(input) => { this.nameInput = input }}
          style={{ color: this.props.color || '#2E3138', WebkitTextFillColor: this.props.color || '#2E3138' }}
          disabled={this.props.disabled}
        />
        {
          !this.props.disabled &&
          <div className='triangles-wrapper'>
            <TriangleUpper targetId='total-up' onHandle={this.onStep} />
            <MediaQuery maxWidth={768}>
              <div id='total-up-touch-area' onClick={this.handleTouchTriangle} />
            </MediaQuery>
            <TriangleLower targetId='total-down' onHandle={this.onStep} />
            <MediaQuery maxWidth={768}>
              <div id='total-down-touch-area' onClick={this.handleTouchTriangle} />
            </MediaQuery>
          </div>
        }

      </div>
    )
  }
}

export default CurrencyInput
