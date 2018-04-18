export const Util = {
  numberWithCommas: (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  prettifyAddress: (address) => {
    let res = address.replace(/(, )+/g, ', ').trim() // remove multiple commas
    res = res.replace(/,\s*$/, '').trim() // remove last comma
    return res
  },

  showBlurOverlay: (visible) => {
    const rootDiv = document.getElementById('root')
    if (visible) {
      rootDiv.classList.add('filter-blur')
    } else {
      rootDiv.classList.remove('filter-blur')
    }
  },

  buildPP: (products, selection) => {
    const product1 = products[selection[0]]
    const product2 = products[selection[1]]

    let pp = {}
    if (product1.type !== product2.type) {
      pp[product1.type] = product1
      pp[product2.type] = product2
    } else if (product1.term_years !== product2.term_years) {
      if (product1.term_years > product2.term_years) {
        pp[22] = product1
        pp[11] = product2
      } else {
        pp[22] = product2
        pp[11] = product1
      }
    } else if (product1.option_is_access_prior !== product2.option_is_access_prior) {
      if (!product1.option_is_access_prior) {
        pp[22] = product1
        pp[11] = product2
      } else {
        pp[22] = product2
        pp[11] = product1
      }
    } else if (product1.option_is_notice_period !== product2.option_is_notice_period) {
      if (product1.option_is_notice_period) {
        pp[22] = product1
        pp[11] = product2
      } else {
        pp[22] = product2
        pp[11] = product1
      }
    } else {
      pp[22] = product1
      pp[11] = product2
    }

    return pp
  }
}
