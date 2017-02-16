/**
 * Created by Xiaotao.Nie on 2017/2/16.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */
import React from 'react';
import Nav from './Nav';

class Frame extends React.Component {
    render() {
        return (
            <div className="frame">
                <h3>欢迎浏览我的demo</h3>
                <div className="header">
                    <Nav />
                </div>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Frame;