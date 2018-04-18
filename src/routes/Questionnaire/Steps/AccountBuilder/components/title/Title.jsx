import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import { Info } from '../../../../../../components/common'
import './Title.css'

export class TitleComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='Title'>
        {this.props.title} {!this.props.noTooltip && <Info tooltip={this.props.tooltip} />}
        {!this.props.noTooltip && <ReactTooltip class='customeTheme' delayHide={1000} html effect='solid' />}
      </div >
    )
  }
}

export default TitleComponent
