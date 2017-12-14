import {
    RECEIVE_METADATA,
    RECEIVE_FORMDATA,
    FIELD_CHANGED,

    FORM_DATA_SEND_FAIL, FORM_DATA_SEND_SUCCESS,
} from './actions';


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
                errors: {},
                isFormDataReady: true,
                receivedFormData: { ...action.payload },
            };

        case FIELD_CHANGED:
            return {
                ...state,
                errors: {  // TODO: animate
                    ...state.errors,
                    [action.payload.fieldName]: null,
                },
                dirtyFormData: {
                    ...state.dirtyFormData,
                    [action.payload.fieldName]: action.payload.fieldValue
                }
            };

        case FORM_DATA_SEND_SUCCESS:
            // TODO: case with result == pending
            return {
                ...state,
                receivedFormData: action.payload,
                errors: {},
            };

        case FORM_DATA_SEND_FAIL:
            if (+action.payload.status === 400) {
                return {
                    ...state,
                    errors: action.payload.data
                };
            }
            return { ...state, errors: {} };

        default:
            return state;
    }
};

export default formogen;
