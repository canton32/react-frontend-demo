import React, { Component } from 'react'
import Spinner from 'react-spinkit'
import './ButtonLoader.scss'

class ButtonLoader extends Component {
  render () {
    const { className, text, onClick, isLoading } = this.props

    return (
      <button className={`ButtonLoader Button ${className}`} onClick={onClick} disabled={isLoading}>
        <div className='dummySpinner' />
        { text }
        <div className='dummySpinner'>
          { isLoading && <Spinner className='Spinner' name='circle' color='white' /> }
        </div>
      </button>
    )
  }
}

export default ButtonLoader
