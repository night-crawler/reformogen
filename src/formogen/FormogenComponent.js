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

            // metaData
            metaDataReady: false,
            receivedMetaData: null,

            errorsFieldMap: {},
            nonFieldErrorsMap: {},

            // urls
            metaDataUrl: props.metaDataUrl,
            objectUrl: props.objectUrl,
            objectCreateUrl: props.objectCreateUrl,
            objectUpdateUrl: props.objectUpdateUrl,

            // formData
            formData: props.formData,
            initialFormData: {},
            defaultFormData: null,  // ?
        };
    }

    // --------------- React.js standard ---------------
    componentWillMount() {
        this.log.debug('componentWillMount()');
        Promise
            .all([this.fetchMetaData(), this.fetchFormData()])
            .then(([newMetaData, newFormData]) => {
                this.props.onFetchComplete(newMetaData, newFormData);
                return [newMetaData, newFormData];
            })
            .then(([newMetaData, newFormData]) => {
                this.setState({
                    metaDataReady: true,
                    fields: newMetaData.fields,
                    fieldNames: _(newMetaData.fields).map('name').flatten().value(),

                    title: this.props.title || newMetaData.title,
                    formData: FormogenComponent.updateFormDataWithDefaults(newMetaData.fields, newFormData),
                    initialFormData: _.cloneDeep(newFormData),
                });
            })
            .catch((error) => this.dispatchNetworkError({ type: 'load', error }));
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

        return {data, files, changedFields};
    }

    // --------------- handle submit  ---------------
    submitForm(data) {
        this.log.debug('submitForm()', data);
        const { objectCreateUrl, objectUpdateUrl } = this.props;
        const { initialFormData } = this.state;

        let options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        };
        let url = objectCreateUrl;

        if (+( _.get(initialFormData, 'id', 0) || 0 )) {
            url = objectUpdateUrl || _.get(initialFormData, 'urls.update') || _.get(initialFormData, 'urls.edit');
            options.method = 'PATCH';
        }

        if (!url)
            throw new Error('URL is empty!');

        return fetch(url, options)
            .then(resolveResponse)
            .then(data => this.handleSubmitSuccess(data))
            .catch(error => this.dispatchNetworkError({ type: 'submit', error }));
    }

    handleSubmit = () => {
        this.log.debug('handleSubmit()');
        const { data, files, changedFields } = this.getFieldData();

        // clear field errors before submit
        this.setState({ errorsFieldMap: {}, nonFieldErrorsMap: {} });

        let promise = this.submitForm(this.pipePreSubmit(data));
        promise.then((data) => {
            console.log('azaza?', data);
        });
    };

    handleSubmitSuccess(data) {
        this.log.debug('handleSubmitSuccess()', data);

        // update formData with received data
        // TODO: update initialFormData ?
        this.setState({ formData: this.pipePreSuccess(data) });
        return data;
    }

    handleValidationErrors(errors) {
        this.log.debug('handleValidationErrors()', errors);
        const { fieldNames } = this.state;

        const receivedFieldNames = _.keys(errors);
        const nonFieldErrorKeys = _(receivedFieldNames).difference(fieldNames).value();
        const nonFieldErrorsMap = _(errors).pick(nonFieldErrorKeys).value();

        this.setState({
            errorsFieldMap: errors,
            nonFieldErrorsMap
        });
    }

    handleFieldChange = (event, { name, value }) => {
        this.log.debug(`handleFieldChange(): setting formData field "${ name }" to ${ typeof value }`, value);
        this.setState(currentState => {
            return { formData: Object.assign({}, currentState.formData, {[name]: value}) };
        });
    };

    // --------------- fetch-receive submit-receive methods (return promises) ---------------
    fetchFormData() {
        const { formData } = this.state;
        const { objectUrl } = this.props;

        return new Promise((resolve, reject) => {
            if (!objectUrl)
                return resolve(formData);

            fetch(objectUrl, { method: 'GET', headers: headers })
                .then(resolveResponse)
                .then(data => {
                    resolve(Object.assign({}, formData, data));
                })
                .catch(error => reject(error));
        });
    }

    fetchMetaData() {
        /*
        1. form metadata key in cache: return resolved promise
        2. metadata is only in metadataUrl: return Promise
        3. metadataUrl + metaData = return Promise
         */
        const { metaData: initialMetaData, metaDataUrl } = this.props;

        return new Promise((resolve, reject) => {
            if (_.isEmpty(initialMetaData) && !metaDataUrl)
                return reject(new Error('Formogen must be initialized with either metaData or metaDataUrl!'));

            if (!metaDataUrl)
                return resolve(initialMetaData);

            fetch(metaDataUrl, { method: 'GET', headers: headers })
                .then(resolveResponse)
                .then(data => {
                    if (!data.fields) {
                        return reject(new Error(`Not found "fields" key in dataset from "${metaDataUrl}"`));
                    }

                    const initialFields = this.props.metaData ? this.props.metaData.fields : [];
                    const receivedFields = data.fields.slice();
                    // TODO: cache initialFields before resolve!
                    const fields = FormogenComponent.concatFields(initialFields, receivedFields);
                    resolve({
                        title: _.get(initialMetaData, 'title', null) || data.title,
                        description: _.get(initialMetaData, 'description', null) || data.description,
                        fields
                    });
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
        let data = {...formData};
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

        const { metaDataReady, title, formData, fields, errorsFieldMap, nonFieldErrorsMap } = this.state;

        return (
            <FormogenFormComponent
                locale={ this.props.locale }
                loading={ !metaDataReady }
                showHeader={ this.props.showHeader }
                title={ title }
                upperFirstLabels={ this.props.upperFirstLabels }
                helpTextOnHover={ this.props.helpTextOnHover }

                fields={ fields }
                formData={ formData }
                layoutTemplate={ this.props.layoutTemplate }

                errorsFieldMap={ errorsFieldMap }
                nonFieldErrorsMap={ nonFieldErrorsMap }

                fieldUpdatePropsMap={ this.props.fieldUpdatePropsMap }

                // callbacks
                onFieldChange={ this.handleFieldChange }
                onSubmit={ this.handleSubmit }
                onNetworkError={ this.dispatchNetworkError }
            />
        );
    }
}
