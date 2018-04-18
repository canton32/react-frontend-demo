import React, { Component } from 'react'
import './CircularSlider.scss'

class CircularSlider extends Component {
  constructor (props) {
    super(props)

    const { value } = this.props
    this.previousAngle = 360 * value / 100

    this.state = {
      isPinching: false
    }
  }

  componentDidMount () {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('touchmove', this.handleMouseMove)
    document.addEventListener('touchend', this.handleMouseUp)
    document.addEventListener('touchcancel', this.handleMouseUp)
  }

  componentWillUnmount () {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('touchmove', this.handleMouseMove)
    document.removeEventListener('touchend', this.handleMouseUp)
    document.removeEventListener('touchcancel', this.handleMouseUp)
  }

  handleMouseUp = () => {
    this.setState({ isPinching: false })
  };

  handleMouseDown = (e) => {
    e.preventDefault()

    this.setState({ isPinching: true })
  };

  handleMouseMove = (e) => {
    if (this.state.isPinching) {
      const { step } = this.props
      const { left, top, width, height } = this.potar.getBoundingClientRect()

      const clientX = e.clientX ? e.clientX : e.touches[0].clientX
      const clientY = e.clientY ? e.clientY : e.touches[0].clientY

      const x = clientX - (left + width / 2)
      const y = (top + height / 2) - clientY

      // Calculate Angle
      let angle = 90 - Math.atan2(y, x) * 180 / Math.PI
      if (angle < 0) {
        angle += 360
      }

      // Restrict Rotation at start, end angle
      if (this.previousAngle > 180) {
        if (angle >= 0 && angle <= 90) {
          angle = 360
        }
      } else {
        if (angle >= 270 && angle < 360) {
          angle = 0
        }
      }

      if (this.props.onChange) {
        this.previousAngle = angle
        let res = (angle * 100 / 360)
        if (res !== 100) {
          res = res - res % step
        }
        this.props.onChange(res)
      }
    }
  }

  getHandleStyle = () => {
    const { handleRadius, border } = this.props

    return {
      width: handleRadius * 2,
      height: handleRadius * 2,
      margin: `-${handleRadius}px 0px 0px ${border / 2 - handleRadius}px`
    }
  }

  getCircleEdgeStyle = () => {
    const { border } = this.props

    return {
      width: border,
      height: border,
      margin: `-${border / 2}px 0px 0px 0px`
    }
  }

  render () {
    const { radius, border, value, handleRadius, showTitle, showHandle } = this.props

    const deg_rangeStart = 90
    const deg_rangeEnd = -90 + 360 * value / 100

    const opacityRange = deg_rangeEnd > 90 ? 1 : 0

    return (
      <div className='CircularSlider'
        style={{ width: radius * 2, height: radius * 2 }}
        ref={(potar) => { this.potar = potar }}>
        <div className='cs-inner-container'>
          <div className='cs-block cs-outer cs-border cs-split'>
            <div className='cs-path cs-transition cs-range-color' style={{ opacity: 1, transform: `rotate(${deg_rangeStart}deg)` }} />
            <div className='cs-path cs-transition cs-range-color' style={{ opacity: `${opacityRange}`, transform: `rotate(${deg_rangeEnd}deg)` }} />
            <div className='cs-path cs-transition cs-path-color' style={{ opacity: `${1 - opacityRange}`, transform: `rotate(${deg_rangeEnd + 180}deg)` }} />
            <div className='cs-path cs-transition cs-path-color' style={{ zIndex: 1, transform: `rotate(${deg_rangeStart + 180}deg)` }} />
            <span className='cs-block' style={{ padding: `${border}px` }}>
              <div className='cs-inner cs-bg-color cs-border'>
                {
                showTitle &&
                <div className='cs-title'>
                  <div>ALLOCATE</div>
                </div>
              }
              </div>
            </span>
          </div>
        </div>
        <div className='cs-bar cs-transition' style={{ zIndex: 5, transform: `rotate(${deg_rangeStart}deg)` }}>
          <div className='cs-circle-edge' style={this.getCircleEdgeStyle()} />
        </div>

        <div className='cs-bar cs-transition' style={{ zIndex: 5, transform: `rotate(${deg_rangeEnd + 180}deg)` }}>
          <div className='cs-circle-edge' style={this.getCircleEdgeStyle()} />
        </div>

        {
          showHandle &&
          <div className='cs-bar cs-transition' style={{ zIndex: 5, transform: `rotate(${deg_rangeEnd + 180}deg)` }}>
            <div className='cs-handle'
              style={this.getHandleStyle()} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown}>
              <div>
                <div className='cs-handle-line' style={{ width: handleRadius - 2 }} />
                <div className='cs-handle-line' style={{ width: handleRadius - 2 }} />
                <div className='cs-handle-line' style={{ width: handleRadius - 2 }} />
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

CircularSlider.defaultProps = {
  step: 1,
  radius: 65,
  border: 12,
  handleRadius: 13,
  showTitle: true,
  showHandle: true
}

export default CircularSlider
