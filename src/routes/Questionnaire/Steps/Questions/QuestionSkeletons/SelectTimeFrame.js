import React, { Component } from 'react'
import { connect } from 'react-redux'
import CheckSVG from '../../../../../images/check.svg'
import CheckGreySVG from '../../../../../images/check_grey.svg'
import { ButtonLoader } from '../../../../../components/common'

class SelectTimeFrame extends Component {
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
    for (let i = 0; i < state.data.choices.length; i++) {
      state.selected[i].isChecked = false
    }
    state.selected[index].isChecked = true
    this.props.onUpdate({
      type: 'button',
      value: this.checkValidate()
    })
    const status = this.props.onButton(this.state.data, state.data.choices[index][0])
    state.status = status
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

  getAnswer = () => {
    let answer = ''
    const state = this.state
    for (let i = 0; i < state.data.choices.length; i++) {
      state.selected[i].isChecked ? (answer = state.data.choices[i][0]) : null
    }
    return answer
  }

  componentDidMount () {
    this.props.onUpdate({
      type: 'button',
      value: this.checkValidate()
    })
    const status = this.props.onButton(this.state.data)
    this.setState({ status })
  }

  handleNext () {
    this.props.onButtons(this.props.jumpToStep, this.state.status.next, this.state.data, this.getAnswer())
  }

  handlePrev () {
    this.props.onButtons(this.props.jumpToStep, 'Prev')
  }

  getIntersect (arr1, arr2) {
    var r = [], o = {}, l = arr2.length, i, v
    for (i = 0; i < l; i++) {
      o[arr2[i]] = true
    }
    l = arr1.length
    for (i = 0; i < l; i++) {
      v = arr1[i]
      if (v in o) {
        r.push(v)
      }
    }
    return r.length
  }

  render () {
    const { history, isBuildingAccount } = this.props

    return (
      <div>
        <div className={`SelectWrapper`}>
          <div className='Title'>{this.props.breakLine(this.state.data.title)}</div>
          {
            this.state.data.description
              ? <div className='Description'>{this.props.breakLine(this.state.data.description)}</div>
              : null
          }
          {
            history[1] && !(this.getIntersect([1, 2, 3], history[1].answer) && this.getIntersect([4, 5, 6, 7, 8], history[1].answer)) &&
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
          {
            this.state.data.choices
              ? <div className={`Answers ${this.state.data.description ? 'DescriptionOnly' : ''}`}>
                {
                  this.state.data.choices.map((item, index) => {
                    return (
                      <div key={index * 10} className={`Answer ${this.state.selected[index].isChecked ? 'Checked' : ''}`} onClick={() => { this.handleSelect(index) }}>
                        <img src={this.state.selected[index].isChecked ? CheckSVG : CheckGreySVG} />
                        <div className='Text'>{item[1]}</div>
                      </div>
                    )
                  })
                }
              </div>
              : null
          }
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

export default connect(mapStateToProps)(SelectTimeFrame)
