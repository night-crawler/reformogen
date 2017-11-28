import React, { Component } from 'react';
import PropTypes from 'prop-types';

import fetch from 'isomorphic-fetch';

import loglevel from 'loglevel';

import _ from 'lodash';

import { Button, Form, Header } from 'semantic-ui-react';

import FormogenFormFieldsComponent from './components/semantic-ui';


// TODO: take it away from here
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};
function resolveResponse(response) {
    if (response.ok) {
        return response.json();
    }

    return response.json().then(data => {
        const error = new Error();
        error.statusCode = response.status;
        error.data = data;

        throw error;
    });
}


export default class FormogenComponent extends Component {
    static defaultProps = {
        // data
        title: 'formogen form',
        upperFirstLabels: false,
        helpTextOnHover: false,
        showHeader: false,

        // urls
        metaDataUrl: null,
        submitUrl: null,
        locale: 'en',

        // callbacks
        onSubmit: data => data,
        onSuccess: data => data,
        onFail: data => data,

        fieldUpdatePropsMap: {},

        mainFormComponent: Form,
        buttonSubmitComponent: Button,
    };
    static propTypes = {
        metaData: PropTypes.object,
        title: PropTypes.string,
        metaDataUrl: PropTypes.string,
        submitUrl: PropTypes.string,
        onSubmit: PropTypes.func,
        onSuccess: PropTypes.func,
        onFail: PropTypes.func,
        upperFirstLabels: PropTypes.bool,
        locale: PropTypes.string,
        helpTextOnHover: PropTypes.bool,
        showHeader: PropTypes.bool,

        fieldUpdatePropsMap: PropTypes.object,
    };

    constructor(props) {
        super(props);

        const id = new Date().getTime();

        this.log = loglevel.getLogger(`FormogenComponent id=${ id }`);
        this.log.debug('Initialized');

        this.state = {
            id,

            title: props.title,

            // metaData
            metaDataReady: false,

            assignedMetaData: props.metaData,
            receivedMetaData: null,

            errorsFieldMap: {},
            nonFieldErrorsMap: {},

            // urls
            metaDataUrl: props.metaDataUrl,
            submitUrl: props.submitUrl,

            // callbacks
            onSubmit: props.onSubmit,
            onSuccess: props.onSuccess,
            onFail: props.onFail,
        };

        /* ref */
        this.fieldsComponent = null;
    }

    // --------------- React.js standard ---------------
    componentWillMount() {
        this.log.debug('componentWillMount()');

        const { metaDataUrl, assignedMetaData } = this.state;

        if (_.isNull(metaDataUrl)) {
            // TODO: DRY
            const totalFields = assignedMetaData ? FormogenComponent.concatFields(assignedMetaData.fields) : [];
            const totalFieldNames =  _(totalFields).map('name').flatten().value();

            this.setState({
                metaDataReady: true,
                totalFields,
                totalFieldNames
            });
        } else {
            const totalFields = assignedMetaData ? FormogenComponent.concatFields(assignedMetaData.fields) : [];
            this.fetchMetaData(metaDataUrl);
            this.setState({
                totalFields
            });
        }
    }

    // --------------- handle callbacks ---------------
    handleOnSubmit(data) {
        const { onSubmit } = this.state;
        if (_.isFunction(onSubmit)) onSubmit(data);
    }
    handleOnSuccess(data) {
        const { onSuccess } = this.state;
        if (_.isFunction(onSuccess)) onSuccess(data);
    }
    handleOnFail(data) {
        const { onFail } = this.state;
        if (_.isFunction(onFail)) onFail(data);
    }

    // --------------- miscellaneous handlers ---------------
    handleSubmit() {
        this.log.debug('handleSubmit()');

        const { submitUrl } = this.state;
        const { data } = this.fieldsComponent.getFormData();

        /* clear field errors before submit */
        this.setState({ errorsFieldMap: {} });

        this.submitForm(submitUrl, data);
        this.handleOnSubmit(data);
    }
    handleSuccess(data) {
        this.log.debug('handleSuccess()');
        this.log.warn(`Processing submitted form's successful result: ${ JSON.stringify(data, null, 4) }`);

        this.handleOnSuccess(data);
    }
    handleFail(error) {
        this.log.debug(`handleFail(): ${ error.statusCode }`);

        // if http status is 400 (Bad Request) it should show form errors
        if (+error.statusCode === 400) this.handleValidationErrors(error.data);
        else this.handelOtherErrors(error.data);

        this.handleOnFail(error.data);
    }
    handelOtherErrors(errors) {
        this.log.debug('handelOtherErrors()');
        this.log.warn('Processing errors', errors);
    }
    handleValidationErrors(errors) {
        this.log.debug('handleValidationErrors()');
        this.log.warn('Processing form\'s validation errors', errors);

        const receivedFieldNames = _.keys(errors);
        const nonFieldErrorKeys = _(receivedFieldNames).difference(this.state.totalFieldNames).value();
        const nonFieldErrorsMap = _(errors).pick(nonFieldErrorKeys).value();

        this.setState({
            errorsFieldMap: errors,
            nonFieldErrorsMap
        });
    }

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
        this.log.debug('receiveMetaData()');
        this.log.warn('Received data', data);

        const { assignedMetaData } = this.state;

        const assignedFields = assignedMetaData ? assignedMetaData.fields : [];
        const { fields } = data;

        // TODO: DRY
        const totalFields = FormogenComponent.concatFields(assignedFields, fields);
        const totalFieldNames =  _(totalFields).map('name').flatten().value();

        this.setState({
            metaDataReady: true,
            receivedMetaData: data,
            totalFields,
            totalFieldNames
        });
    }
    submitForm(url, data) {
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        };

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
        const { title, assignedMetaData, receivedMetaData } = this.state;

        if (assignedMetaData) {
            return _.upperFirst(assignedMetaData.title.substr(0));
        }
        if (receivedMetaData) {
            return _.upperFirst(receivedMetaData.title.substr(0));
        }
        return title.substr(0);
    }
    /**
     * Returns an array of all (assigned and received) metadata fields.
     * @returns {Array} The array of Objects (e.g [{name: '...', ...}, ...])
     */
    getFields() {  // TODO: feel free to delete this
        const { assignedMetaData, receivedMetaData } = this.state;

        const fields = [
            ...assignedMetaData ? assignedMetaData.fields.slice() : [],
            ...receivedMetaData ? receivedMetaData.fields.slice() : [],
        ];
        return _.differenceBy(fields, 'name');
    }
    static concatFields(fieldSet, anotherFieldSet) {
        const fields = [
            ...fieldSet ? fieldSet.slice() : [],
            ...anotherFieldSet ? anotherFieldSet.slice() : [],
        ];
        return _.differenceBy(fields, 'name');
    }

    // --------------- React.js render ---------------
    render() {
        this.log.debug('render()');

        const { metaDataReady, totalFields, errorsFieldMap, nonFieldErrorsMap } = this.state;

        return (
            <Form loading={ !metaDataReady }>
                { this.props.showHeader ? <Header as='h2' dividing={ true }>{ this.getTitle() }</Header> : '' }

                <FormogenFormFieldsComponent
                    ref={ comp => { this.fieldsComponent = comp; } }

                    fields={ totalFields }

                    locale={ this.props.locale }
                    onSubmit={ validatedData => this.handleSubmit(validatedData) }

                    upperFirstLabels={ this.props.upperFirstLabels }
                    helpTextOnHover={ this.props.helpTextOnHover }
                    layout={ this.props.layout }

                    fieldUpdatePropsMap={ this.props.fieldUpdatePropsMap }

                    errorsFieldMap={ errorsFieldMap }
                    nonFieldErrorsMap={ nonFieldErrorsMap }
                />
                <Button
                    content={ 'Submit' }
                    onClick={ () => this.handleSubmit() }
                    onKeyPress={ () => this.handleSubmit() }

                    fluid={ true }
                    type='submit'
                />
            </Form>
        );
    }
}

