/**
 * Created by Xiaotao.Nie on 2017/2/16.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */
import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../redux/actions';
import { push } from 'react-router-redux';
import ContactForm from "./ContactForm";

@connect(state => {
    return {
        info: state.rootReducer.getInfo.info,
    };
}, {
    push,
    ...actions,
})
class Detail extends React.Component {

    componentWillMount() {
        this.props.receiveAllarticle();
    }

    handleNavigate() {
        this.props.push(`/`);
    }

    handleSubmit(){

    }

    render() {
        const { info, push } = this.props;

        return (
            <div>
                <h1>{this.props.info}</h1>
                <p onClick={this.handleNavigate.bind(this)}>Go to the Home page</p>
                <ContactForm />
            </div>
        );
    }
}

export default Detail;
