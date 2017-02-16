/**
 * Created by Xiaotao.Nie on 2017/2/16.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */

const initialState = {
   info:"This is the initial infomation"
};

export default function previewList(state = initialState, action) {
    switch (action.type) {
        // case LOAD_ARTICLES: {
        //     return {
        //         ...state,
        //         loading: true,
        //         error: false,
        //     };
        // }

        default:
            return state;
    }
}
