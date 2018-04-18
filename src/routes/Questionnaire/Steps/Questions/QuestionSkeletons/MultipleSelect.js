import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import CheckSVG from '../../../../../images/check.svg'
import { ButtonLoader } from '../../../../../components/common'

import './ToolTip.scss'

class MultipleSelect extends Component {
  constructor (props) {
    super(props)

    let selected = []
    for (let i = 0; i < props.data.choices.length; i++) {
      selected.push({
        isChecked: false
      })
    }
    this.state = {
      data: props.data,
      selected,
      status: {
        next: 'Next',
        prev: true
      }
    }
    this.handleNext = this.handleNext.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
  }

  handleSelect = (index) => {
    let state = this.state
    state.selected[index].isChecked = !state.selected[index].isChecked
    this.props.onUpdate({
      type: 'button',
      value: this.checkValidate()
    })
    this.setState(state)
  }

  checkValidate = () => {
    let count = 0
    let state = this.state
    for (let i = 0; i < state.data.choices.length; i++) {
      state.selected[i].isChecked ? count++ : null
    }
    return !(count > 0)
  }

  componentDidMount () {
    this.props.onUpdate({
      type: 'button',
      value: this.checkValidate()
    })
    const status = this.props.onButton(this.state.data)
    this.setState({
      status
    })
  }

  getAnswers = () => {
    let answers = []
    const state = this.state
    for (let i = 0; i < state.data.choices.length; i++) {
      state.selected[i].isChecked ? answers.push(state.data.choices[i][0]) : null
    }
    return answers
  }

  handleNext () {
    this.props.onButtons(this.props.jumpToStep, this.state.status.next, this.state.data, this.getAnswers())
  }

  handlePrev () {
    this.props.onButtons(this.props.jumpToStep, 'Prev')
  }

  render () {
    const { isBuildingAccount } = this.props
    const { data, selected } = this.state

    return (
      <div>
        <div className='MultipleSelectWrapper'>
          <div className='Title'>{this.props.breakLine(data.title)}</div>
          {
            data.description
              ? <div className='Description'>{this.props.breakLine(data.description)}</div>
              : null
          }
          <div className='Items'>
            {<ReactTooltip class='customeTheme' delayHide={1000} html effect='solid' />}
            {
              data.choices.map((item, index) => {
                return (
                  <div
                    data-tip={item[2]}
                    key={index}
                    className={`Item ${selected[index].isChecked ? 'Checked' : ''}`}
                    onClick={() => { this.handleSelect(index) }}>
                    {
                      selected[index].isChecked
                        ? <img src={CheckSVG} />
                        : null
                    }
                    {
                      Number(item[0]) < 8
                        ? <div className='Image'>
                          <img src={require(`../Images/type${item[0]}.svg`)} />
                        </div>
                        : <div className='Text'>
                          ?
                        </div>
                    }
                    {/* {
                    item.image ?
                      <div className="Image">
                        <img src={require(`../Images/${item.image}`)} />
                      </div>
                      : null
                  }
                  {
                    item.text ?
                      <div className="Text">
                        {item.text}
                      </div>
                      : null
                  } */}
                    <div className='ItemTitle'>{item[1]}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className='footer-buttons'>
          { this.state.status.prev && <button className='Button Prev' onClick={this.handlePrev}>Back</button> }
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

export default connect(mapStateToProps)(MultipleSelect)
