import { RECEIVE_METADATA, RECEIVE_FORMDATA, FIELD_CHANGED, REQUEST_SUBMIT_FAIL, RECEIVE_SUBMIT } from './actions';


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
                receivedFormData: action.payload,
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

        case RECEIVE_SUBMIT:
            return {
                ...state,
                errors: {},
            };

        case REQUEST_SUBMIT_FAIL:
            if (+action.payload.status === 400) {
                return {
                    ...state,
                    errors: action.payload.response
                };
            }
            return { ...state, errors: {} };

        default:
            return state;
    }
};

export default formogen;
