/**
 * Created by Xiaotao.Nie on 2017/2/16.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */
import React from 'react';
import { Link } from 'react-router';

const  Nav = (props) =>
        <nav>
            <h3>欢迎浏览我的demo</h3>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/detail">detail</Link></li>
            </ul>
        </nav>;

export default Nav;