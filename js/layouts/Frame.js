/**
 * Created by Xiaotao.Nie on 2017/2/16.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */
import React from 'react';
import Nav from './Nav';

const Frame = (props) =>
       <div className="frame">
           <div className="header">
               <Nav />
           </div>
           <div className="container">
               {props.children}
           </div>
       </div>;

export default Frame;