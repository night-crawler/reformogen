import _ from 'lodash';

import loglevel from 'loglevel';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FormogenFormComponent from './components/semantic-ui';

import { headers, extractIdentity, resolveResponse } from './utils';


export default class FormogenComponent extends Component {
    static defaultProps = {
        locale: 'en',
        showHeader: false,
        title: 'formogen form',
        upperFirstLabels: false,
        helpTextOnHover: false,

        formData: {},

        fieldUpdatePropsMap: {},
        // eslint-disable-next-line
        onFetchComplete: (metaData, formData) => null,
    };
    static propTypes = {
        locale: PropTypes.string,
        showHeader: PropTypes.bool,
        title: PropTypes.string,
        upperFirstLabels: PropTypes.bool,
        helpTextOnHover: PropTypes.bool,

        layoutTemplate: PropTypes.array,

        metaData: PropTypes.object,
        formData: PropTypes.object,

        /* urls */
        metaDataUrl: PropTypes.string,
        objectUrl: PropTypes.string,
        objectCreateUrl: PropTypes.string,
        objectUpdateUrl: PropTypes.string,

        fieldUpdatePropsMap: PropTypes.object,

        /*
            callbacks that's called before *[submit, error, success]
            they can patch data (must return modified data)
        */
        pipePreSubmit: PropTypes.func,
        pipePreValidationError: PropTypes.func,  // validation
        pipePreSuccess: PropTypes.func,

        onFetchComplete: PropTypes.func,

        onSubmitNetworkError: PropTypes.func,
        onFileUploadError: PropTypes.func,
        onLoadNetworkError: PropTypes.func,
    };

    // --------------- constructor ---------------
    constructor(props) {
        super(props);

        const id = new Date().getTime();

        this.log = loglevel.getLogger(`FormogenComponent id=${ id }`);
        this.log.debug('Initialized');

        // all initial states are stored in props (coz they're immutable)
        // all pipe* callbacks are stored in props (coz they're immutable)
        this.state = {
            id,

            title: props.title,

            // makeMetaDataSelector
            isMetaDataReady: false,
            isFormDataReady: false,
            isFormSubmitComplete: true,

            receivedMetaData: null,

            errorsFieldMap: {},
            nonFieldErrorsMap: {},

            // urls
            objectUrl: props.objectUrl,
            objectCreateUrl: props.objectCreateUrl,
            objectUpdateUrl: props.objectUpdateUrl,

            // totalFormData
            formData: props.formData,
            initialFormData: {},
            defaultFormData: null,  // ?
        };
    }

    // --------------- React.js standard ---------------
    componentWillMount() {
        this.log.debug('componentWillMount()');
        this.props.fetchMetaData();
        this.props.fetchFormData();
    }

    /**
     * Handles network errors ONLY.
     *
     * We have no ability to handle internal Fetch preflight (OPTIONS) request errors. The name of such errors
     * is TypeError. Internally handled errors have name `FormogenError` and populated bundle of additional args.
     * @param {string} type - load|submit|file
     * @param {object} error
     * @param {string} error.name
     * @param {object} error.data
     * @param {number} error.status
     * @param {string} error.statusText
     * @param {*} error.origResponse
     * @param {bool} error.isJson
     * @param {string} error.url
     */
    dispatchNetworkError = ({ type, error }) => {
        const { onLoadNetworkError, onSubmitNetworkError, onFileUploadError } = this.props;

        const isHandled = error.name === 'FormogenError';
        this.log.error(`[${type}:${error.name}]: Cannot fetch url "${ error.url }", details:`, error);

        switch (type) {
            case 'load':
                if (_.isFunction(onLoadNetworkError))
                    return onLoadNetworkError(error, isHandled);
                this.log.warn(`No custom handler for type error ${type}. Pass callback to prop "onLoadNetworkError"`);
                break;
            case 'submit':
                if (+error.status === 400)
                    return this.handleValidationErrors(this.pipePreValidationError(error.data));
                if (_.isFunction(onSubmitNetworkError))
                    return onSubmitNetworkError(error, isHandled);
                this.log.warn(`No custom handler for type error ${type}. Pass callback to prop "onSubmitNetworkError"`);
                break;
            case 'file':
                if (_.isFunction(onFileUploadError))
                    return onFileUploadError(error, isHandled);
                this.log.warn(`No custom handler for type error ${type}. Pass callback to prop "onFileUploadError"`);
                break;
            default:
                this.log.warn(`Unknown error type: ${type}`);

        }
        return error;
    };

    // --------------- pipeline data callbacks ---------------
    pipePreSubmit(data) {
        const { pipePreSubmit } = this.props;

        if (_.isFunction(pipePreSubmit)) {
            this.log.warn('Using custom pipeline processing for pipePreSubmit()');
            return pipePreSubmit(data, this);
        }
        return data;
    }

    pipePreValidationError(data) {
        const { pipePreValidationError } = this.props;

        if (_.isFunction(pipePreValidationError)) {
            this.log.warn('Using custom pipeline processing for pipePreValidationError()');
            return pipePreValidationError(data, this);
        }
        return data;
    }

    pipePreSuccess(data) {
        const { pipePreSuccess } = this.props;

        if (_.isFunction(pipePreSuccess)) {
            this.log.warn('Using custom pipeline processing for pipePreSuccess()');
            return pipePreSuccess(data, this);
        }
        return data;
    }

    getFieldData() {
        const { fields, formData, initialFormData } = this.state;

        let files = {}, data = {}, changedFields = [];
        fields.map(({ type, name, upload_url = null }) => {
            const
                value = formData[name],
                ptr = (upload_url || type in ['FileField', 'ImageField']) ? files : data,
                initialValue = initialFormData[name];
            let isChanged = value !== initialValue;

            // go deeper with checks only when the basic comparision returned true
            // this check applies on arrays or object
            if (isChanged && _.isObject(initialValue)) {
                const _initialValueIdentity = extractIdentity(initialValue);
                const _valueIdentity = extractIdentity(value);

                if (_.isArray(_initialValueIdentity)) {
                    isChanged = !_(_initialValueIdentity).difference(_valueIdentity).isEmpty();
                } else {
                    isChanged = _initialValueIdentity !== _valueIdentity;
                }
            }

            isChanged && changedFields.push(name);
            ptr[name] = value;

            return null;  // shut warning
        });

        return { data, files, changedFields };
    }

    // --------------- handle submit  ---------------
    submitForm(data) {
        this.log.debug('submitForm()', data);
        const { objectCreateUrl, objectUpdateUrl, initialFormData } = this.state;

        let options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        };
        let url = objectCreateUrl;

        if (+(_.get(initialFormData, 'id', 0) || 0)) {
            url = objectUpdateUrl || _.get(initialFormData, 'urls.update') || _.get(initialFormData, 'urls.edit');
            options.method = 'PATCH';
        }
        console.log('WE GOT THIS SHIT', url, _.get(initialFormData, 'id', 0));

        if (!url)
            throw new Error('URL is empty!');

        return fetch(url, options).then(resolveResponse);
    }


    /**
     * Submit order:
     *  0. Disable the form.
     *  1. Send totalFormData (payload without files).
     *  2. Handle a response. This response may not contain a new object but a bundle like:
     *     {
     *         result: 'pending' | 'success' | 'error'
     *         message: 'message'
     *     }
     *     NOTE:
     *     If we got a 'pending' result, we need to skip enabling form to prevent our logic from corruption with
     *     user's random actions on the incomplete transaction.
     *     To prevent the handle logic from spreading over branches it's easier to ignore received data and perform
     *     a new request to retrieve the whole instance.
     *  3. Retrieve a new instance of object. This instance should contain a new set of urls we need: `urls.update`,
     *     `urls.<file_field_name>_upload`
     *  4. Extract urls for file upload
     *  5. Upload files
     */
    handleSubmit = () => {
        this.props.submit();

        // this.log.debug('handleSubmit()');
        // const { data, files, changedFields } = this.getFieldData();
        //
        // // clear field errors before submit
        // this.setState({ errorsFieldMap: {}, nonFieldErrorsMap: {}, isFormSubmitComplete: false });
        //
        // this.submitForm(this.pipePreSubmit(data))
        //     .then(data => this.handleSubmitFormDataSuccess(data))
        //     .then(data => {
        //         this.setState({ initialFormData: data });
        //         return data;
        //     })
        //     .then(data => this.handleSendFiles(files, data))
        //     .then(({ objectInstance, uploadedFiles }) => {
        //         console.log('WE UPLOADED SOME SHIT', objectInstance, uploadedFiles);
        //         this.setState({ isFormSubmitComplete: true });
        //     })
        //     .catch(error => this.dispatchNetworkError({ type: 'submit', error }));
    };

    handleSubmitFormDataSuccess(data) {
        return new Promise((resolve, reject) => {
            this.log.debug('handleSubmitFormDataSuccess()', data);
            if (data.result === 'pending') {
                // handle pending
                reject(new Error('Cannot handle "pending" result'));
            }
            // first set a new url to retrieve the instance
            const objectUpdateUrl = _.get(data, 'urls.update') || _.get(data, 'urls.edit');
            this.setState({ objectUpdateUrl }, () => {
                this.fetchFormData()
                    .then(data => resolve(data))
                    .catch(error => reject(error));
            });
        });
    }

    /**
     *
     * @param {Object} filesFieldMap
     * @param {Object} objectInstance
     * @returns {Array.<Object>}
     */
    prepareFileUploadQueue(filesFieldMap, objectInstance) {
        let fileUploadQueue = [];
        for (let [fieldName, { defaultUploadUrl, files }] of Object.entries(filesFieldMap)) {
            if (_.isEmpty(files)) {
                this.log.warn(`Field "${fieldName}" contains no files - skipping`);
                continue;
            }
            const uploadUrl = _.get(objectInstance, `urls.${fieldName}_upload`) || defaultUploadUrl;
            if (!uploadUrl)
                throw new Error(`No upload url for field ${fieldName} specified in filesBundle`);

            for (let file of files) {
                let formData = new FormData();
                formData.append(file.name, file);
                fileUploadQueue.push({ uploadUrl, formData, fileName: file.name });
            }
        }
        return fileUploadQueue;
    }

    handleSendFiles(filesFieldMap, objectInstance) {
        this.log.debug(`handleSendFiles(${Object.keys(filesFieldMap)})`);

        const
            queue = this.prepareFileUploadQueue(filesFieldMap, objectInstance),
            chunks = _.chunk(queue, 5);

        let uploadedFiles = [];
        let failedFiles = [];

        if (_.isEmpty(queue))
            return { objectInstance, uploadedFiles };

        const getChunkFetchList = (chunk, reject) => {
            return chunk.map(({ uploadUrl, formData, fileName }) => {
                return fetch(uploadUrl, {
                    method: 'POST',
                    body: formData,
                })
                    .then(resolveResponse)
                    .then(data => {
                        uploadedFiles.push({ data, fileName, uploadUrl });
                        return data;
                    })
                    .catch(error => {
                        failedFiles.push({ error, fileName, uploadUrl });
                    });
            });
        };

        return new Promise((resolve, reject) => {
            const initialFetchList = getChunkFetchList(chunks[0], reject);
            let initialPromise = Promise.all(initialFetchList);

            for (let chunk of chunks.slice(1)) {
                const fetchList = getChunkFetchList(chunk, reject);
                initialPromise = initialPromise.then(() => Promise.all(fetchList));
            }

            initialPromise.then(() => {
                if (!_.isEmpty(failedFiles)) {
                    return reject(failedFiles);
                }
                resolve({ objectInstance, uploadedFiles });
            });
        });
    }


    handleValidationErrors(errors) {
        this.log.debug('handleValidationErrors()', errors);
        const { fieldNames } = this.state;

        const receivedFieldNames = _.keys(errors);
        const nonFieldErrorKeys = _(receivedFieldNames).difference(fieldNames).value();
        const nonFieldErrorsMap = _(errors).pick(nonFieldErrorKeys).value();

        this.setState({
            errorsFieldMap: errors,
            nonFieldErrorsMap,
            isFormSubmitComplete: true,
        });
    }

    handleFieldChange = (event, { name, value }) => {
        this.log.debug(`handleFieldChange(): setting formData field "${ name }" to ${ typeof value }`, value);
        this.setState(currentState => {
            return { formData: Object.assign({}, currentState.formData, { [name]: value }) };
        });
    };

    // --------------- fetch-receive submit-receive methods (return promises) ---------------
    fetchFormData() {
        return new Promise((resolve, reject) => {
            const { objectUrl } = this.props;
            const { formData, objectUpdateUrl } = this.state;
            const url = objectUpdateUrl || objectUrl;

            this.setState({ isFormDataReady: false });

            if (!url) {
                this.setState({ isFormDataReady: true });
                return resolve(formData);
            }

            fetch(url, { method: 'GET', headers: headers })
                .then(resolveResponse)
                .then(data => {
                    this.setState({ isFormDataReady: true });
                    resolve(Object.assign({}, formData, data));
                })
                .catch(error => reject(error));
        });
    }

    // --------------- get methods ---------------
    static concatFields(fieldSet, anotherFieldSet = []) {
        const fields = [
            ...fieldSet ? fieldSet.slice() : [],
            ...anotherFieldSet ? anotherFieldSet.slice() : [],
        ];
        return _.differenceBy(fields, 'name');
    }

    static updateFormDataWithDefaults(fields, formData) {
        let data = { ...formData };
        for (let field of fields) {
            if (field.name in data) {
                continue;
            }
            // should be undefined for uncontrolled components, not null
            data[field.name] = field.default || '';

            // DRF expects M2M values as a list (empty or not), so empty string is not acceptable here
            if (!data[field.name] && field.type === 'ManyToManyField')
                data[field.name] = [];
        }
        return data;
    }

    // --------------- React.js render ---------------
    render() {
        this.log.debug('render()');

        const {
            isMetaDataReady, isFormDataReady, isFormSubmitComplete,
            title, formData, fields, errorsFieldMap, nonFieldErrorsMap
        } = this.state;

        return (
            <FormogenFormComponent
                loading={ !this.props.isMetaDataReady }
                fields={ this.props.metaData.fields }
                title={ this.props.metaData.title }
                formData={ this.props.formData }



                locale={ this.props.locale }
                showHeader={ this.props.showHeader }
                upperFirstLabels={ this.props.upperFirstLabels }
                helpTextOnHover={ this.props.helpTextOnHover }

                onFieldChange={ this.handleFieldChange }

                errorsFieldMap={ errorsFieldMap }
                nonFieldErrorsMap={ nonFieldErrorsMap }


                // todo
                layoutTemplate={ this.props.layoutTemplate }
                fieldUpdatePropsMap={ this.props.fieldUpdatePropsMap }
            />
        );
    }
}
