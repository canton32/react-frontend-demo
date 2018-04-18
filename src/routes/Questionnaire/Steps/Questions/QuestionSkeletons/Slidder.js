import React, { Component } from 'react'
import { connect } from 'react-redux'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import './QuestionSkeletes.scss'
import { ButtonLoader } from '../../../../../components/common'

class Slidder extends Component {
  constructor (props) {
    super(props)
    const min_value = props.data.validators.min_value || 0
    const max_value = !props.history.length ? props.data.validators.max_value : props.history[0].answer
    this.state = {
      data: props.data,
      value: (min_value + max_value) / 2,
      min_value,
      max_value,
      status: {
        next: 'Next',
        prev: true
      }
    }
  }

  handleChangeStart = () => {
    console.log('Change event started')
  };

  handleChange = (value) => {
    this.setState({
      value: value
    })
    // this.props.onChange(this.state)
  };

  handleChangeComplete = () => {
    // this.props.onChange(this.state)
  };

  addCommas (intNum) {
    return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }

  componentDidMount () {
    this.props.onUpdate({
      type: 'button',
      value: false
    })
    const status = this.props.onButton(this.state.data)
    this.setState({
      status
    })
  }

  handleNext = () => {
    this.props.onButtons(this.props.jumpToStep, this.state.status.next, this.state.data, this.state.value)
  }

  handlePrev = () => {
    this.props.onButtons(this.props.jumpToStep, 'Prev')
  }

  render () {
    const { history, isBuildingAccount } = this.props
    const { max_value } = this.state

    return (
      <div>
        <div className={`SlidderWrapper ${history.length == 0 ? 'Solid' : 'Couple'} ${this.state.data.side == 1 ? 'Solid' : 'Couple'}`}>
          <div className='Title'>{this.props.breakLine(this.state.data.title)}</div>
          {
            this.state.data.description
              ? <div className='Description'>{this.props.breakLine(this.state.data.description)}</div>
              : null
          }
          {
            history[1] &&
            <div className='DescriptionImages'>
              {
                history[1].answer.filter(item => {
                  return [1, 2, 3].indexOf(item) != -1
                }).map((item, index) => {
                  return (
                    <div key={index} className='ImageWrapper'>
                      <div key={index} className='Image'>
                        <img src={require(`../Images/type${history[1].question.choices[item - 1][0]}.svg`)} />
                      </div>
                      <div className='Text'>{history[1].question.choices[item - 1][1]}</div>
                    </div>
                  )
                })
              }
            </div>
          }
          {
            this.state.data.descriptionImages
              ? <div className='DescriptionImages'>
                {
                  this.state.data.descriptionImages.map((item, index) => {
                    return (
                      <div key={index} className='ImageWrapper'>
                        <div key={index} className='Image'>
                          <img src={require(`../Images/${item.image}`)} />
                        </div>
                        <div className='Text'>{item.description}</div>
                      </div>
                    )
                  })
                }
              </div>
              : null
          }
          <table className='SliderTable'><tbody>
            {
              this.state.data.items
                ? <tr>
                  <td>
                    <div className='SideTitle Left'>{this.state.data.items[0].name}</div>
                  </td>
                  <td>
                    <div className='SideTitle Right'> {this.state.data.side > 1 ? this.state.data.items[1].name : ''}</div>
                  </td>
                </tr>
                : null
            }
            {history.length == 0 &&
              <tr>
                <td>
                  <div className='SideTitle Left'>Deposit Amount</div>
                </td>
                <td />
              </tr>
            }
            {history.length != 0 &&
              <tr>
                <td>
                  <div className='SideTitle Left'>Amount Needed</div>
                </td>
                <td>
                  <div className='SideTitle Right'>Total Pot</div>
                </td>
              </tr>
            }
            <tr>
              <td colSpan='2'>
                <Slider
                  min={this.state.data.validators.min_value || 0}
                  max={max_value}
                  step={500}
                  value={this.state.value}
                  onChangeStart={this.handleChangeStart}
                  onChange={this.handleChange}
                  onChangeComplete={this.handleChangeComplete}
                  tooltip={false}
                />
              </td>
            </tr>
            {
              this.state.data.side > 1
                ? <tr>
                  <td className='TextLeft'>
                    <div className='Value'>£{this.addCommas(parseInt(this.state.value))}</div>
                  </td>
                  <td className='TextRight'>
                    <div className='Value'>£{this.addCommas(parseInt(max_value - this.state.value))}</div>
                  </td>
                </tr>
                : <tr>
                  <td colSpan='2'>
                    <div className='Value'>£{this.addCommas(parseInt(this.state.value))}</div>
                  </td>
                </tr>
            }
          </tbody></table>
        </div>
        <div className='footer-buttons'>
          { this.state.status.prev && <button className='Button Prev' onClick={this.handlePrev}>Back</button>}
          { this.state.status.next &&
            <ButtonLoader
              className='Next'
              onClick={this.handleNext}
              text={this.state.status.next}
              isLoading={isBuildingAccount} />
          }
          <div className='Info'>Questions? <span className='ChatWithUs'>Chat with us</span> or call on +44 20 3870 4200</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isBuildingAccount: state.ui.isBuildingAccount
})

export default connect(mapStateToProps)(Slidder)
