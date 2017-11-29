import React, { Component } from 'react';
import PropTypes from 'prop-types';

import loglevel from 'loglevel';

import _ from 'lodash';

import { headers, resolveResponse } from './utils';
import FormogenFormComponent from './components/semantic-ui';


export default class FormogenComponent extends Component {
    static defaultProps = {
        locale: 'en',
        showHeader: false,
        title: 'formogen form',
        upperFirstLabels: false,
        helpTextOnHover: false,

        formData: {},

        fieldUpdatePropsMap: {},
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
        pipePreError: PropTypes.func,
        pipePreSuccess: PropTypes.func,

        onNetworkError: PropTypes.func,
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
            defaultFormData: null,  // ?
        };
    }

    // --------------- React.js standard ---------------
    componentWillMount() {
        this.log.debug('componentWillMount()');
        Promise
            .all([this.getMetaData(), this.getFormData()])
            .then(([newMetaData, newFormData]) => {
                this.setState({
                    metaDataReady: true,
                    fields: newMetaData.fields,
                    fieldNames: _(newMetaData.fields).map('name').flatten().value(),

                    title: this.props.title || newMetaData.title,
                    formData: FormogenComponent.updateFormDataWithDefaults(newMetaData.fields, newFormData)
                });
            })
            .catch(this.onNetworkError);
    }

    // --------------- pipeline data callbacks ---------------
    pipePreSubmit(data) {
        const { pipePreSubmit } = this.props;

        if (_.isFunction(pipePreSubmit)) {
            this.log.warn('Using custom pipeline processing for pipePreSubmit()');
            return pipePreSubmit(data, this);
        }
        return data;
    }
    pipePreError(data) {
        const { pipePreError } = this.props;

        if (_.isFunction(pipePreError)) {
            this.log.warn('Using custom pipeline processing for pipePreError()');
            return pipePreError(data, this);
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

    // --------------- miscellaneous handlers ---------------
    onNetworkError = (error) => {
        /* fetch can produce exceptions on OPTIONS preflight requests we can't catch, so isHandled shows
        * enduser we could not handle it proper way and could not put additional information into exception bundle
        * since it's not present in original Fetch exception */

        const isHandled = error.name === 'FormogenError';
        if (_.isFunction(this.props.onNetworkError)) {
            return this.props.onNetworkError(error, isHandled);
        }

        this.log.error(
            `[${ isHandled ? 'HANDLED' : 'UNHANDLED' }]: Cannot fetch ${ error.url }, details`,
            JSON.stringify(error, null, 4)
        );
    };

    handleSubmit = () => {
        this.log.debug('handleSubmit()');

        const { formData } = this.state;

        /* clear field errors before submit */
        this.setState({ errorsFieldMap: {}, nonFieldErrorsMap: {} });

        this.submitForm(this.pipePreSubmit(formData));
    };
    handleSubmitSuccess(data) {
        this.log.debug('handleSubmitSuccess()', data);

        // update formData with received data
        this.setState({ formData: this.pipePreSuccess(data) });
    }
    handleSubmitFail(error) {
        this.log.debug(`handleFail(), with the status of response = ${ error.statusCode }`);

        // if http status is 400 (Bad Request) it should show form errors
        const data = this.pipePreError(error.data);
        console.log('????', data, error.status, error);
        if (+error.status === 400)
            this.handleValidationErrors(data);
        else
            this.handleClientErrors(data);
    }
    handleClientErrors(errors) {
        this.log.debug('handleClientErrors()', errors);
    }
    handleValidationErrors(errors) {
        this.log.debug('handleValidationErrors()', errors);

        const receivedFieldNames = _.keys(errors);
        const nonFieldErrorKeys = _(receivedFieldNames).difference(this.state.fieldNames).value();
        const nonFieldErrorsMap = _(errors).pick(nonFieldErrorKeys).value();

        this.setState({
            errorsFieldMap: errors,
            nonFieldErrorsMap
        });
    }

    handleFieldChange = (event, { name, value }) => {
        this.log.debug(`handleFieldChange(): setting formData field "${ name }" to ${ typeof value }`, value);

        this.setState({ formData: Object.assign({}, this.state.formData, {[name]: value}) });
    };

    // --------------- fetch-receive submit-receive methods (return promises) ---------------
    getFormData() {
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
    getMetaData() {
        /*
        1. form metadata key in cache: return resolved promise
        2. metadata is only in metadataUrl: return Promise
        3. metadataUrl + metaData = return Promise
         */
        const { metaData: initialMetaData, metaDataUrl } = this.props;

        return new Promise((resolve, reject) => {
            if (_.isEmpty(initialMetaData) && !metaDataUrl)
                return reject(new Error('Formogen must be initialized either metaData or metaDataUrl!'));

            if (!metaDataUrl)
                return resolve(initialMetaData);

            fetch(metaDataUrl, { method: 'GET', headers: headers })
                .then(resolveResponse)
                .then(data => {
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
    submitForm(data) {
        this.log.debug('submitForm()', data);

        let options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        };
        let url = this.props.objectCreateUrl;

        if (+(_.get(data, 'id', 0) || 0)) {
            url = this.props.objectUpdateUrl || data.urls.update;
            options.method = 'PATCH';
        }

        return fetch(url, options)
            .then(resolveResponse)
            .then(data => this.handleSubmitSuccess(data))
            .catch(error => this.handleSubmitFail(error));
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
        let data = Object.assign({}, formData);
        for (let field of fields) {
            if (field.name in data) {
                continue;
            }
            // should be undefined for uncontrolled components, not null
            data[field.name] = field.default || '';

            // DRF expects M2M values as an list (empty or not), so empty string is not acceptable here
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
            />
        );
    }
}
