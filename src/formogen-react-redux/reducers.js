import _ from 'lodash';

import {
    METADATA_REQUEST_SUCCESS,
    FORMDATA_REQUEST_SUCCESS,
    FORMDATA_SEND_FAIL, FORMDATA_SEND_SUCCESS,
    SINGLE_FILE_UPLOAD_FAIL, SINGLE_FILE_UPLOAD_SUCCESS,
    FIELD_CHANGED,
} from './actions';


export const formogen = (state = {}, action) => {
    switch (action.type) {

        case METADATA_REQUEST_SUCCESS:
            return {
                ...state,
                isMetaDataReady: true,
                receivedMetaData: action.payload
            };

        case FORMDATA_REQUEST_SUCCESS:
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

        case FORMDATA_SEND_SUCCESS:
            // TODO: case with result == pending
            return {
                ...state,
                receivedFormData: action.payload,
                errors: {},
            };

        case FORMDATA_SEND_FAIL:
            // TODO: what's about 401? The 401 status is correct in this context.
            if (+action.payload.status === 400) {
                return {
                    ...state,
                    errors: action.payload.data
                };
            }
            return { ...state, errors: {} };

        case SINGLE_FILE_UPLOAD_FAIL:
            return {
                ...state,
                formFilesUploadProgress: {
                    ...state.formFilesUploadProgress,
                    [action.payload.fieldName]: {
                        ..._.get(state.formFilesUploadProgress, action.payload.fieldName, {}),
                        [action.payload.fileName]: {
                            percent: 0,
                            status: 'fail'
                        }
                    }
                }
            };


        /**
         * {
         *     formFilesUploadProgress: {
         *         <fieldName>: {
         *              <fileName>: {percent: 100, status: 'ok|fail'}
         *         }
         *     }
         * }
         */
        case SINGLE_FILE_UPLOAD_SUCCESS:
            return {
                ...state,
                formFilesUploadProgress: {
                    ...state.formFilesUploadProgress,
                    [action.payload.fieldName]: {
                        ..._.get(state.formFilesUploadProgress, action.payload.fieldName, {}),
                        [action.payload.fileName]: {
                            percent: 100,
                            status: 'ok'
                        }
                    }
                }
            };
            

        default:
            return state;
    }
};

export default formogen;
