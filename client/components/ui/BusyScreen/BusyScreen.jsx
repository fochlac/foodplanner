import React from 'react';
import './BusyScreen.less';

export default class DefaultPage extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            this.props.show
            ? <div className="busyBackground">
                  <div className="spinner sphere busyCenter" id="sphere">
                    <div className="inner">
                      <div className="disc">laden</div>
                      <div className="disc">laden</div>
                      <div className="disc">laden</div>
                    </div>
                  </div>
            </div>
            : null
        );
    }
}