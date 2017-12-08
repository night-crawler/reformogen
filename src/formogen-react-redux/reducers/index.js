
import { RECEIVE_METADATA, RECEIVE_FORMDATA } from '../actions';


export const formogen = (state = {}, action) => {
    switch (action.type) {

        case RECEIVE_METADATA:
            return { ...state, isMetaDataReady: true, receivedMetaData: action.payload };

        case RECEIVE_FORMDATA:
            return { ...state, isFormDataReady: true, receivedFormData: action.payload };

        default:
            return state;
    }
};

export default formogen;
