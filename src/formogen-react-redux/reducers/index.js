import { RECEIVE_METADATA, RECEIVE_FORMDATA, RECEIVE_SUBMIT } from '../actions';


export const formogen = (state = {}, action) => {
    switch (action.type) {

        case RECEIVE_METADATA:
            return { ...state, isMetaDataReady: true, receivedMetaData: action.payload };

        case RECEIVE_FORMDATA:
            return {
                ...state,
                isFormDataReady: true,
                receivedFormData: action.payload,
                pristineFormData: { ...action.payload }
            };

        // case RECEIVE_SUBMIT:
        //     return {
        //         ...state,
        //         pristineFormData: { ...action.payload }
        //     };

        default:
            return state;
    }
};

export default formogen;
