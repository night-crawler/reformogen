import React, { Component } from 'react';
import PropTypes from 'prop-types';

import fetch from 'isomorphic-fetch';

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
            objectCreateUrl: props.objectCreateUrl,
            objectUpdateUrl: props.objectUpdateUrl,

            // formData
            formData: props.formData,
            defaultFormData: null,  // ?
        };

        /* ref */
        this.fieldsComponent = null;
    }

    // --------------- React.js standard ---------------
    componentWillMount() {
        this.log.debug('componentWillMount()');

        const { metaDataUrl } = this.state;
        const initialFields = this.props.metaData ? this.props.metaData.fields.slice() : [];
        let metaDataReady,
            fields,
            fieldNames;

        if (_.isNull(metaDataUrl)) {
            metaDataReady = true;
            fields = FormogenComponent.concatFields(initialFields);
            fieldNames =  _(fields).map('name').flatten().value();
        } else {
            this.fetchMetaData(metaDataUrl);

            metaDataReady = false;
            fields = FormogenComponent.concatFields(initialFields);
            fieldNames =  _(fields).map('name').flatten().value();
        }

        this.setState({ metaDataReady, fields, fieldNames });
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
    handleSubmit = () => {
        this.log.debug('handleSubmit()');

        const { data } = this.fieldsComponent.getFormData();

        /* clear field errors before submit */
        this.setState({ errorsFieldMap: {}, nonFieldErrorsMap: {} });

        this.submitForm(this.pipePreSubmit(data));
    };
    handleSuccess(data) {
        this.log.debug('handleSuccess()', data);

        // update formData with received data
        this.setState({ formData: this.pipePreSuccess(data) });
    }
    handleFail(error) {
        this.log.debug(`handleFail(), with the status of response = ${ error.statusCode }`);

        // if http status is 400 (Bad Request) it should show form errors
        const data = this.pipePreError(error.data);
        if (+error.statusCode === 400)
            this.handleValidationErrors(data);
        else
            this.handelOtherErrors(data);
    }
    handelOtherErrors(errors) {
        this.log.debug('handelOtherErrors()', errors);
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

    // --------------- fetch-receive submit-receive methods ---------------
    fetchMetaData(url) {
        const options = {
            method: 'GET',
            headers: headers,
        };

        // TODO: process fail
        fetch(url, options)
            .then(resolveResponse)
            .then(data => this.receiveMetaData(data));
    }
    receiveMetaData(data) {
        this.log.debug('receiveMetaData()', data);

        const { formData } = this.state;

        const initialFields = this.props.metaData ? this.props.metaData.fields.slice() : [];
        const receivedFields = data.fields.slice();

        // TODO: DRY
        const fields = FormogenComponent.concatFields(initialFields, receivedFields);
        const fieldNames =  _(fields).map('name').flatten().value();

        this.setState({
            metaDataReady: true,
            receivedMetaData: data,
            fields,
            fieldNames,

            formData: FormogenComponent.updateFormDataWithDefaults(fields, formData)
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

        fetch(url, options)
            .then(resolveResponse)
            .then(data => this.handleSuccess(data))
            .catch(error => this.handleFail(error));
    }

    // --------------- get methods ---------------
    /**
     * Returns the title of the Formogen Component.
     * @returns {string} e.g 'The Main Form'
     */
    getTitle() {
        const { title, receivedMetaData } = this.state;

        if (this.props.metaData) {
            return _.upperFirst(this.props.metaData.title.substr(0));
        }
        if (receivedMetaData) {
            return _.upperFirst(receivedMetaData.title.substr(0));
        }
        return title.substr(0);
    }
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

        const { metaDataReady, formData, fields, errorsFieldMap, nonFieldErrorsMap } = this.state;

        return (
            <FormogenFormComponent
                ref={ comp => { this.fieldsComponent = comp; } }

                locale={ this.props.locale }
                loading={ !metaDataReady }
                showHeader={ this.props.showHeader }
                title={ this.getTitle() }
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
