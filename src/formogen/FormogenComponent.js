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
        locale: 'en',

        // misc properties
        title: 'formogen form',
        upperFirstLabels: false,
        helpTextOnHover: false,
        showHeader: false,

        // urls
        metaDataUrl: null,
        objectCreateUrl: null,
        objectUpdateUrl: null,

        fieldUpdatePropsMap: {},
    };
    static propTypes = {
        metaData: PropTypes.object,

        locale: PropTypes.string,

        title: PropTypes.string,
        upperFirstLabels: PropTypes.bool,
        helpTextOnHover: PropTypes.bool,
        showHeader: PropTypes.bool,

        metaDataUrl: PropTypes.string,
        objectCreateUrl: PropTypes.string,
        objectUpdateUrl: PropTypes.string,

        fieldUpdatePropsMap: PropTypes.object,

        // [pre] => send => [pre] receive [post]
        /* patch data before send */
        pipePreSubmit: PropTypes.func,
        pipePreError: PropTypes.func,
        pipePreSuccess: PropTypes.func,

        layout: PropTypes.array
    };

    constructor(props) {
        super(props);

        const id = new Date().getTime();

        this.log = loglevel.getLogger(`FormogenComponent id=${ id }`);
        this.log.debug('Initialized');

        // all pipe* callbacks are stored in props
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
            objectCreateUrl: props.objectCreateUrl,
            objectUpdateUrl: props.objectUpdateUrl,
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

    // --------------- pipeline callbacks ---------------
    pipePreSubmit(data) {
        const { pipePreSubmit } = this.props;
        if (_.isFunction(pipePreSubmit)) {
            this.log.warn('Using custom pipeline processing for pipePreSubmit()');
            return pipePreSubmit(data, this);
        }
        return data;
    }
    pipePreError(data) {
        const { pipePostError } = this.props;
        if (_.isFunction(pipePostError)) {
            this.log.warn('Using custom pipeline processing for pipePreError()');
            return pipePostError(data, this);
        }
        return data;
    }
    pipePreSuccess(data) {
        const { pipePostSuccess } = this.props;
        if (_.isFunction(pipePostSuccess)) {
            this.log.warn('Using custom pipeline processing for pipePreSuccess()');
            return pipePostSuccess(data, this);
        }
        return data;
    }

    // --------------- miscellaneous handlers ---------------
    handleSubmit() {
        this.log.debug('handleSubmit()');

        // const { submitUrl } = this.state;
        const { data } = this.fieldsComponent.getFormData();

        /* clear field errors before submit */
        this.setState({
            errorsFieldMap: {},
            nonFieldErrorsMap: {}
        });
        this.submitForm(this.pipePreSubmit(data));
    }
    handleSuccess(data) {
        this.log.debug('handleSuccess()');
        this.log.warn('Processing submitted form\'s successful result', data);

        // update formData with received data
        this.setState({ formData: this.pipePreSuccess(data) });
    }
    handleFail(error) {
        this.log.debug(`handleFail(): ${ error.statusCode }`);

        // if http status is 400 (Bad Request) it should show form errors
        const data = this.pipePreError(error.data);
        if (+error.statusCode === 400)
            this.handleValidationErrors(data);
        else
            this.handelOtherErrors(data);
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

        const { metaDataReady, formData, totalFields, errorsFieldMap, nonFieldErrorsMap } = this.state;

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
                    formData={ formData }

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

