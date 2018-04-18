import React, { Component } from 'react'

import './Triangle.css'

export class TriangleUpper extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  handleClick = (event) => {
    this.props.onHandle(event.target.id)
  }

  render () {
    return (
      <svg className='Triangle Upper' width='12px' height='8px' viewBox='0 0 12 8' version='1.1' xmlns='http://www.w3.org/2000/svg'>
        <desc>Created with Sketch.</desc>
        <defs />
        <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='1'>
          <g id='final' transform='translate(-794.000000, -227.000000)' fill='black'>
            <g id='Group-12' transform='translate(477.000000, 169.000000)'>
              <g id='Group-7' transform='translate(159.000000, 0.000000)'>
                <g id='Group-13' transform='translate(2.000000, 35.000000)'>
                  <polygon id={this.props.targetId} onClick={this.handleClick} points='162 23 168 31 156 31' />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    )
  }
}

export class TriangleLower extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  handleClick = (event) => {
    this.props.onHandle(event.target.id)
  }

  render () {
    return (
      <svg className='Triangle Lower' width='12px' height='8px' viewBox='0 0 12 8' version='1.1' xmlns='http://www.w3.org/2000/svg'>
        <desc>Created with Sketch.</desc>
        <defs />
        <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' opacity='1'>
          <g id='final' transform='translate(-794.000000, -241.000000)' fill='black'>
            <g id='Group-12' transform='translate(477.000000, 169.000000)'>
              <g id='Group-7' transform='translate(159.000000, 0.000000)'>
                <g id='Group-13' transform='translate(2.000000, 35.000000)'>
                  <polygon id={this.props.targetId} onClick={this.handleClick} transform='translate(162.000000, 41.000000) scale(1, -1) translate(-162.000000, -41.000000) ' points='162 37 168 45 156 45' />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    )
  }
}

export default TriangleUpper
