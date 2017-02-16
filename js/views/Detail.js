/**
 * Created by Xiaotao.Nie on 2017/2/16.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */
import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../redux/actions';
import { push } from 'react-router-redux';

@connect(state => {
    return {
        info: state.info,
    };
}, {
    push,
    ...actions,
})
class Detail extends React.Component {

    handleNavigate() {
        this.props.push(`/`);
    }

    render() {
        const { info, push } = this.props;

        return (
            <div>
                <h1>{this.props.info}</h1>
                <p onClick={this.handleNavigate.bind(this)}>Go to the Home page</p>
            </div>
        );
    }
}

export default Detail;
