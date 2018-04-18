import React, { Component } from 'react'
import StepZilla from 'react-stepzilla'
import { connect } from 'react-redux'
import $ from 'jquery'

import Select from './QuestionSkeletons/Select'
import SelectTimeFrame from './QuestionSkeletons/SelectTimeFrame'
import MultipleSelect from './QuestionSkeletons/MultipleSelect'
import Slidder from './QuestionSkeletons/Slidder'

import './Questions.scss'

import { ScoringActions, ProductActions, OfferActions, UIActions } from '../../../../store'
import { Rest } from '../../../../services'

const TypeSlidder = ['amount', 1]
const TypeMultiSelect = ['objective', 2]
const TypeObjectiveSlidder = ['objective_amount', 3]
const TypeSelect = ['objective_time', 4]
const TypeFrameSelect = ['objective_timeframe', 5]
const TypeAccessSelect = ['access', 6]

class Questions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      nextButton: false,
      history: [],
      currentLocation: 1,
      steps: []
    }
  }

  componentWillMount () {
    this.props.setIsBuildingAccount(false)
    this.getSteps()
  }

  getSteps = () => {
    const questionData = this.props.questions
    let questions = []
    const { history } = this.state
    for (let i = 0; i < questionData.length; i++) {
      let data = questionData[i]
      data.index = i + 1
      switch (questionData[i].key) {
        case TypeSlidder[0]:
        case TypeObjectiveSlidder[0]:
          data.type = questionData[i].key === TypeSlidder[0] ? TypeSlidder[1] : TypeObjectiveSlidder[1]
          questions.push({
            name: 'Question' + (i + 1),
            component: <Slidder data={data} breakLine={this.breakLine} onUpdate={this.handleUpdate} onButtons={this.handleSteps} onButton={this.checkButtons} history={history} />
          })
          break
        case TypeMultiSelect[0]:
          data.type = TypeMultiSelect[1]
          questions.push({
            name: 'Question' + (i + 1),
            component: <MultipleSelect data={data} breakLine={this.breakLine} onUpdate={this.handleUpdate} onButtons={this.handleSteps} onButton={this.checkButtons} history={history} />
          })
          break
        case TypeSelect[0]:
        case TypeAccessSelect[0]:
          data.type = questionData[i].key === TypeSelect[0] ? TypeSelect[1] : TypeAccessSelect[1]
          questions.push({
            name: 'Question' + (i + 1),
            component: <Select data={data} breakLine={this.breakLine} onUpdate={this.handleUpdate} onButtons={this.handleSteps} onButton={this.checkButtons} history={history} />
          })
          break
        case TypeFrameSelect[0]:
          data.type = TypeFrameSelect[1]
          questions.push({
            name: 'Question' + (i + 1),
            component: <SelectTimeFrame data={data} breakLine={this.breakLine} onUpdate={this.handleUpdate} onButtons={this.handleSteps} onButton={this.checkButtons} history={history} />
          })
          break
        default:
          break
      }
    }
    this.setState({
      steps: questions,
    })
  }

  breakLine = (text) => {
    var br = React.createElement('br')
    var regex = /(<br \/>)/g
    return text.split(regex).map(function (line, index) {
      return line.match(regex) ? <br key={'key_' + index} /> : line
    })
  }

  handleUpdate = (data) => {
    if (data.type === 'button') {
      $('.Button.Next').prop('disabled', data.value)
      if (data.value) {
        $('.Button.Next').addClass('Disabled')
      } else {
        $('.Button.Next').removeClass('Disabled')
      }
    }
    this.setState({
      nextButton: data.value
    })
  }

  getIntersect (arr1, arr2) {
    let r = [], o = {}, l = arr2.length, i, v
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

  logicQ2 (data, except = -1) {
    const answer = data.answer
    const case123 = this.getIntersect(answer, [1, 2, 3])
    const case45678 = this.getIntersect(answer, [4, 5, 6, 7, 8])
    const case4567 = this.getIntersect(answer, [4, 5, 6, 7])
    const case12 = this.getIntersect(answer, [1, 2]) == 2
    const caseOnly4 = case4567 && (this.getIntersect(answer, [5, 6, 7]) == 0)
    const case456 = this.getIntersect(answer, [4, 5, 6])
    const case78 = this.getIntersect(answer, [7, 8])
    const caseNot456 = case78 && !case456
    const case4 = this.getIntersect(answer, [4])
    const case5678 = this.getIntersect(answer, [5, 6, 7, 8])
    const case4And5678 = case4 && (case5678 >= 1)
    if (case123 && case45678 && except == -1) return 3
    if ((case123 && except == -1) || except == 1) {
      if (case12) return 4
      return 5
    }
    if ((case45678 && except == -1) || except == 0) {
      if (caseOnly4) return 7
      if (caseNot456) return 8
      if (case4And5678) return 9
      return 10
    }
  }

  checkButtons (data, answer = null) {
    let ret = {
      next: 'Next',
      prev: null
    }
    if ([6, 7, 8, 9, 10].indexOf(data.index) != -1) ret.next = 'Build My Account'
    if ([4, 5].indexOf(data.index) != -1 && answer == 3) ret.next = 'Build My Account'
    // if (data.index != 1)
    //   ret.prev = true;
    ret.prev = true
    return ret
  }

  logicSteps (data) {
    const step = data.currentLocation
    const answer = data.answer
    switch (step) {
      case 1:
        return 2
      case 2:
        return this.logicQ2(data)
      case 3:
        const q1 = this.state.history[0].answer
        const q2 = this.state.history[1]
        if (answer / q1 * 100 > 30) {
          return this.logicQ2(q2, 1)
        } else {
          return this.logicQ2(q2, 0)
        }
      case 4:
      case 5:
        if (answer != 3) return 6
        break
      default:
        break
    }
    return 0
  }

  getPostData (history) {
    let ret = {}
    const amount = history[0] && history[0].answer
    history.forEach(historyItem => {
      const key = historyItem.question.key
      let answer = historyItem.answer
      if (key == TypeObjectiveSlidder[0]) {
        answer = answer * 100 / amount
      }

      ret = {
        ...ret,
        [key]: answer
      }
    })
    return ret
  }

  handleSteps = (jumpToStep, type, question = null, answer = null) => {
    const props = this.props
    const { onBackToWelcome } = props
    let { history } = this.state

    if (type == 'Next' || type == 'Build My Account') {
      let currentLocation = this.state.currentLocation
      const historyItem = {
        currentLocation,
        question,
        answer
      }
      if (type == 'Build My Account') {
        history.push(historyItem)
        const postData = this.getPostData(history)

        props.setIsBuildingAccount(true)
        Rest.postScoring(postData).then(res => {
          // props.saveAnswers(res.data)
          props.saveAnswers({
            data: postData
          })
          return Rest.getProducts()
        }).then(res => {
          props.saveProducts(res.data)
          return Rest.getCustomerOffers()
        }).then(res => {
          props.setIsBuildingAccount(false)

          props.saveOffers(res.data)
          props.jumpToStep(1)
        }).catch(error => {
          props.setIsBuildingAccount(false)

          alert(error.message || 'Something went wrong!')
          history.pop()
        })
      } else {
        currentLocation = this.logicSteps(historyItem) - 1
        history.push(historyItem)
        this.setState({ currentLocation: currentLocation + 1 })
        jumpToStep(currentLocation)
      }
    } else {
      let currentLocation = this.state.currentLocation
      if (currentLocation > 1) {
        history.pop()
        currentLocation = history.length ? this.logicSteps(history[history.length - 1]) - 1 : 0
        this.setState({ currentLocation: currentLocation + 1 })
        jumpToStep(currentLocation)
      } else {
        onBackToWelcome()
      }
    }
  }

  render () {
    return (
      <div>
        {
          !this.state.isLoading
            ? <div>
              <div className='MobileTitle'>Questions</div>
              <div className='Questions'>
                <StepZilla steps={this.state.steps}
                  showSteps={false}
                  showNavigation={false}
                />
              </div>
            </div>
            : <div className='Loading'>Loading Questions</div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  questions: state.scoring.questions
})

const mapDispatchToProps = {
  saveAnswers: ScoringActions.saveAnswers,
  saveProducts: ProductActions.saveProducts,
  saveOffers: OfferActions.saveOffers,
  setIsBuildingAccount: UIActions.setIsBuildingAccount
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
