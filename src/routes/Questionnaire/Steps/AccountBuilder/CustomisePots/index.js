import React, { Component } from 'react'
import Toggle from 'react-toggle'

import '../components/toggle/react-toggle-style.css'
import './CustomisePots.scss'

class CustomisePots extends Component {
  getSelection = () => {
    const { products, modal } = this.props
    let selection = []

    Object.keys(products).forEach((productId) => {
      if (modal['product-' + productId]) selection.push(productId)
    })

    return selection.length == 2
  }

  render () {
    const { products, modal, handleProductsChange, onProducts } = this.props
    const productIds = Object.keys(products)

    return (
      <div className='CustomisePotsModal'>
        <div className='ModalDialog'>
          <div className='Title'>Please choose two types of accounts which you would like to consider as part of your selection</div>
          <div className='Products'>
            {
              productIds.map((productId, index) => {
                return (
                  <div className='Product' key={index}>
                    <Toggle
                      id={'product-' + productId}
                      checked={modal['product-' + productId]}
                      icons={false}
                      onChange={handleProductsChange} />
                    <div className='ProductTitle'>{products[productId].description}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className='footer-buttons'>
          <div />
          <button
            className={`Button Next ${this.getSelection() ? '' : 'Disabled'}`}
            onClick={this.getSelection() ? onProducts : ''}
            style={{ width: 231, marginRight: 14 }}>
            BUILD PRODUCT
          </button>
        </div>
      </div>
    )
  }
}

export default CustomisePots
