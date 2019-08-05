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
      value: 300,
      isScrolling: true
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
  scrollStyle() {
    return {
      padding: `2rem`,
      background: `#ffffff`,
      boxShadow: this.state.isScrolling ? `0 1px 2px rgba(0,0,0,0.1)` : `none`
    }
  }
  render() {
    const { children } = this.props;
    return (
      <div style={ this.scrollStyle() }>
        {children}
        <div style={{ position: 'fixed', bottom: 40, right: 100, width: 60, height: 200 }} onClick={ this.hanldeSroll.bind(this) }>
          <Slider 
            vertical 
            min={200}
            max={500}
            trackStyle={{ background: '#ccc' }} 
            railStyle={{ background: '#000' }} 
            handleStyle={{ borderColor: '#000' }} 
            activeDotStyle={{ borderColor: '#000', boxShadow: `0 0 0 5px #96dbfa` }} 
            defaultValue={300}
            onChange={ v => this.hanldeChange(v) } 
            handle={handle} 
          />
        </div>
      </div>
    )
  }
}

export default PlayBar
