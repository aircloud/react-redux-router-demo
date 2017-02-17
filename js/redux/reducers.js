/**
 * Created by Xiaotao.Nie on 2017/2/16.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */
import { combineReducers } from 'redux'

const initialState = {
   info:"This is the initial infomation"
};

const getInfo = (state = initialState, action = "") => {
    switch (action.type) {
        case 'EXAMPLE':
            return{
                info:"This is the example infomation"
            };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    getInfo
});

console.log("rootReducer1",rootReducer.info,getInfo());

export default rootReducer;