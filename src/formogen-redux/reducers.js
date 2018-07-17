import _ from 'lodash';

import {
    METADATA_REQUEST_SUCCESS,
    FORMDATA_REQUEST_SUCCESS,
    FORMDATA_SEND_FAIL, FORMDATA_SEND_SUCCESS,
    SINGLE_FILE_UPLOAD_FAIL, SINGLE_FILE_UPLOAD_SUCCESS,
    FIELD_CHANGED,
} from './actions';

export const formogen = (state = {}, action) => {
    /* all formogen's actions have one important property - 'formId'
     * if an action doesn't have it - skip reducer execution
     */
    if (!_.get(action, 'meta.formId', false)) return state;

    const { formId } = action.meta;
    let subState = state[formId] || {};

    switch (action.type) {

        case METADATA_REQUEST_SUCCESS:
            subState = {
                ...subState,
                isMetaDataReady: true,
                receivedMetaData: action.payload
            };
            break;

        case FORMDATA_REQUEST_SUCCESS:
            subState = {
                ...subState,
                errors: {},
                isFormDataReady: true,
                receivedFormData: action.payload,
            };
            break;

        case FIELD_CHANGED:
            subState = {
                ...subState,
                errors: {  // TODO: animate
                    ...subState.errors,
                    [action.payload.fieldName]: null,
                },
                dirtyFormData: {
                    ...subState.dirtyFormData,
                    [action.payload.fieldName]: action.payload.fieldValue
                }
            };
            break;

        case FORMDATA_SEND_SUCCESS:
            // TODO: case with result == pending
            subState = {
                ...subState,
                receivedFormData: action.payload,
                errors: {},
            };
            break;

        case FORMDATA_SEND_FAIL:
            if ([400, 401].includes(+action.payload.status)) {
                subState = { ...subState, errors: action.payload.data };
                break;
            }
            subState = { ...subState, errors: {} };
            break;

        case SINGLE_FILE_UPLOAD_FAIL:
            subState = {
                ...subState,
                formFilesUploadProgress: {
                    ...subState.formFilesUploadProgress,
                    [action.payload.fieldName]: {
                        ..._.get(subState.formFilesUploadProgress, action.payload.fieldName, {}),
                        [action.payload.fileName]: {
                            percent: 0,
                            status: 'fail'
                        }
                    }
                }
            };
            break;

        case SINGLE_FILE_UPLOAD_SUCCESS:
            subState = {
                ...subState,
                formFilesUploadProgress: {
                    ...subState.formFilesUploadProgress,
                    [action.payload.fieldName]: {
                        ..._.get(subState.formFilesUploadProgress, action.payload.fieldName, {}),
                        [action.payload.fileName]: {
                            percent: 100,
                            status: 'ok'
                        }
                    }
                }
            };
            break;

        default:
            return state;
    }

    return { ...state, [formId]: subState };
};