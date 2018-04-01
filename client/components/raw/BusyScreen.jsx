import React from 'react';
import './BusyScreen.less';

export default class DefaultPage extends React.Component {
    render() {
        return (
            this.props.show
            ? <div className="busyBackground">
              <div className="loadingCircle">
              </div>
              <div className="loadingCircleContent">
                <span className="fa fa-2x fa-cutlery"></span>
              </div>
            </div>
            : null
        );
    }
}

