import React from 'react';
import './InfoBubble.less';

export default class InfoBubble extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <span className={'fa InfoBubble ' + (this.props.symbol ? this.props.symbol : 'fa-info-circle')}>
        <span className="InfoBubbleContent" style={this.props.style}>
          {this.props.children ? this.props.children : null}
        </span>
        <span className={'InfoBubbleTriangle ' + this.props.arrow}></span>
      </span>
    );
  }
}
