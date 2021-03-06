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
        info: state.rootReducer.getInfo.info,
    };
}, {
    push,
    ...actions,
})
class Home extends React.Component {

    componentDidMount() {
        console.log("this.props.receiveAllarticle.toString()",this.props.receiveAllarticle.toString())
        // this.props.receiveAllarticle();
        console.log(this.props,"this.props")
    }


    handleNavigate() {
        this.props.push(`/detail/`);
        console.log("to detail",this.props.push);
    }

    render() {
        const { info, push } = this.props;

        return (
            <div>
                <h1>info:{this.props.info}</h1>
                <p onClick={this.handleNavigate.bind(this)}>Go to the detail page</p>
            </div>
        );
    }
}

export default Home;
