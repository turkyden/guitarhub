import React from "react"
import Slider from "rc-slider"
import Tooltip from 'rc-tooltip';
import Scroll from "react-scroll"
import "rc-slider/assets/index.css"

const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

class PlayBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 200
    }
  }
  hanldeChange(value) {
    this.setState({ value: value });
    this.hanldeSroll();
  }
  hanldeSroll() {
    Scroll.animateScroll.scrollToBottom({
      duration: this.state.value * 1000,
      smooth: 'linear'
    })
  }
  render() {
    const { value } = this.state;
    const { children } = this.props;
    return (
      <div>
        {children}
        <div style={{ position: 'fixed', bottom: 40, right: 100, width: 60, height: 200 }} onClick={ this.hanldeSroll.bind(this) }>
          <Slider 
            vertical 
            min={100}
            max={300}
            trackStyle={{ background: '#ccc' }} 
            railStyle={{ background: '#000' }} 
            handleStyle={{ borderColor: '#000' }} 
            activeDotStyle={{ borderColor: '#000', boxShadow: `0 0 0 5px #96dbfa` }} 
            value={value} 
            onChange={ value => this.hanldeChange(value) } 
            handle={handle} 
          />
        </div>
      </div>
    )
  }
}

export default PlayBar
