import { RECEIVE_METADATA, RECEIVE_FORMDATA, FIELD_CHANGED } from './actions';


export const formogen = (state = {}, action) => {
    switch (action.type) {

        case RECEIVE_METADATA:
            return {
                ...state,
                isMetaDataReady: true,
                receivedMetaData: action.payload
            };

        case RECEIVE_FORMDATA:
            return {
                ...state,
                isFormDataReady: true,
                receivedFormData: action.payload,
            };

        case FIELD_CHANGED:
            return {
                ...state,
                dirtyFormData: Object.assign({}, state.dirtyFormData,
                    { [action.payload.fieldName]: action.payload.fieldValue })
            };

        default:
            return state;
    }
};

export default formogen;
