import React, { Component } from 'react'

import './Info.css'

export class Info extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tooltip: props.tooltip
    }
  }

  render () {
    return (
      <svg className='Info' width='13px' data-tip={this.state.tooltip} height='13px' viewBox='0 0 13 13' version='1.1' xmlns='http://www.w3.org/2000/svg'>
        <desc>Created with Sketch.</desc>
        <defs />
        <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
          <g id='final' transform='translate(-607.000000, -337.000000)' fill='#3BB4DC'>
            <g id='Group-12' transform='translate(477.000000, 169.000000)'>
              <g id='Group-2' transform='translate(0.000000, 140.000000)'>
                <g id='slider'>
                  <g id='Group-8'>
                    <g id='info-copy-2' transform='translate(130.000000, 28.000000)'>
                      <path d='M6.5,13 C10.0874317,13 13,10.0874317 13,6.5 C13,2.91256831 10.0874317,0 6.5,0 C2.91256831,0 0,2.91256831 0,6.5 C0,10.0874317 2.91256831,13 6.5,13 Z M6.5,1.06557377 C9.50136612,1.06557377 11.9344262,3.49863388 11.9344262,6.5 C11.9344262,9.50136612 9.50136612,11.9344262 6.5,11.9344262 C3.49863388,11.9344262 1.06557377,9.50136612 1.06557377,6.5 C1.06557377,3.49863388 3.49863388,1.06557377 6.5,1.06557377 Z' id='Shape' fillRule='nonzero' />
                      <path d='M6.5,10 C6.78333333,10 7,9.792 7,9.52 L7,6.48 C7,6.208 6.78333333,6 6.5,6 C6.21666667,6 6,6.208 6,6.48 L6,9.52 C6,9.792 6.23333333,10 6.5,10 Z' id='Shape' fillRule='nonzero' />
                      <circle id='Oval-2' cx='6.5' cy='4.5' r='1' />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    )
  }
}

export default Info
