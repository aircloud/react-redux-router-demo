/**
 * Created by Xiaotao.Nie on 2017/2/16.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */
import React from 'react';
import { Link } from 'react-router';

class Nav extends React.Component {
    render() {
        return (
            <nav>
                <Link to="/">Home</Link>
            </nav>
        );
    }
}

export default Nav;
