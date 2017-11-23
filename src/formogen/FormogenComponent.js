import React, { Component } from 'react';

import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import 'moment/locale/ru';
import loglevel from 'loglevel';
import _ from 'lodash';

import { Button, Form, Header } from 'semantic-ui-react';

import FormogenFormFieldsComponent from './components/semantic-ui';
// import { LoaderComponent } from './MiscComponents';



function resolveResponse(response) {
    if (response.ok) {
        return response.json();
    }

    return response.json().then(err => {
        const error = new Error();
        error.data = err;

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
        locale: 'en',

        // callbacks
        onSubmit: data => this.log.debug(`onSubmit() - ${ data }`),
        onSuccess: data => this.log.debug(`onSuccess() - ${ data }`),
        onFail: data => this.log.debug(`onFail() - ${ data }`),

        fieldUpdatePropsMap: {},
    };
    static propTypes = {
        metaData: PropTypes.object,
        title: PropTypes.string,
        metaDataUrl: PropTypes.string,
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

        this.log = loglevel.getLogger('FormogenComponent.js');
        this.log.debug('Initialized');

        this.state = {
            title: props.title,

            // metaData
            metaDataReady: false,

            assignedMetaData: props.metaData,
            receivedMetaData: null,

            metaDataUrl: props.metaDataUrl,

            // callbacks
            onSubmit: props.onSubmit,
            onSuccess: props.onSuccess,
            onFail: props.onFail,

            errorsFieldMap: {},
        };

        /* ref */
        this.fieldsComponent = null;
    }

    // --------------- React.js standard ---------------
    componentWillMount() {
        this.log.debug('componentWillMount()');

        const { metaDataUrl } = this.state;

        if (_.isNull(metaDataUrl)) {
            this.setState({ metaDataReady: true });
        } else {
            this.fetchMetaData(metaDataUrl);
        }
    }

    // --------------- handle callbacks ---------------
    handleOnSubmit(data) {
        const { onSubmit } = this.state;
        if (_.isFunction(onSubmit)) onSubmit(data);
    }
    handleOnSuccess() {
        const { onSuccess } = this.state;
        if (_.isFunction(onSuccess)) onSuccess();
    }
    handleOnFail() {
        const { onFail } = this.state;
        if (_.isFunction(onFail)) onFail();
    }

    // --------------- standard handlers ---------------
    handleSubmit() {
        const {data, files} = this.fieldsComponent.getFormData();

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        };
        console.log(options);

        fetch('http://localhost:8000/api/v1/sample/authors/', options)
            .then(resolveResponse)
            .then(data => this.receiveResult(data))
            .catch(error => this.handleFail(error));

        this.log.debug('handleSubmit()');
        this.handleOnSubmit({test: 1});
    }
    handleSuccess() {
        this.log.debug('handleSuccess()');
        this.handleOnSuccess();
    }


    handleFormErrors(errors) {
        this.log.debug('handleFormErrors()');
        this.log.warn(`Processing form errors: ${ JSON.stringify(Object.assign({}, errors), null, 4) }`);

        this.setState(Object.assign({}, this.state, {errorsFieldMap: errors}))
    }

    handleFail(error) {
        // if http status is 400 (Bad Request) it should show form errors
        // this.log.debug(`handleFail(): ${ JSON.stringify(error, null, 4) }`);


        this.handleFormErrors(error.data);
    }

    // --------------- fetch-receive MetaData ---------------
    fetchMetaData(url) {
        fetch(url)
            .then(resolveResponse)
            .then(data => this.receiveMetaData(data));
    }
    receiveMetaData(data) {
        this.log.debug('receiveMetaData()');

        this.setState({
            metaDataReady: true,
            receivedMetaData: Object.assign({}, data),
        });
    }


    receiveResult(data) {
        console.log(data);
    }

    // --------------- get methods ---------------
    /**
     * Returns the title of the Formogen Component.
     * @returns {string} e.g 'The Main Form'
     */
    getTitle() {
        const { title, assignedMetaData, receivedMetaData } = this.state;

        if (assignedMetaData) {
            return _.upperFirst(assignedMetaData.title.substr());
        }
        if (receivedMetaData) {
            return _.upperFirst(receivedMetaData.title.substr());
        }
        return title.substr(0);
    }
    /**
     * Returns an array of all (assigned and received) metadata fields.
     * @returns {Array} The array of Objects (e.g [{name: '...', ...}, ...])
     */
    getFields() {
        const { assignedMetaData, receivedMetaData } = this.state;

        const fields = [
            ...assignedMetaData ? assignedMetaData.fields.slice() : [],
            ...receivedMetaData ? receivedMetaData.fields.slice() : [],
        ];
        return _.differenceBy(fields, 'name');
    }

    // --------------- React.js render ---------------
    render() {
        /* TODO: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
            OR
            key={ new Date().getTime() }
         */
        return (
            <Form loading={ !this.state.metaDataReady }>
                { this.props.showHeader ? <Header as='h2' dividing={ true }>{ this.getTitle() }</Header> : '' }

                <FormogenFormFieldsComponent
                    key={ this.getFields() }
                    fields={ this.getFields() }
                    locale={ this.props.locale }
                    // formData={ {name: 'lol'} }
                    onSubmit={ (validatedData) => this.handleSubmit(validatedData) }
                    upperFirstLabels={ this.props.upperFirstLabels }
                    helpTextOnHover={ this.props.helpTextOnHover }
                    fieldUpdatePropsMap={ this.props.fieldUpdatePropsMap }
                    layout={ this.props.layout }

                    ref={ (comp) => { this.fieldsComponent = comp; } }
                    errorsFieldMap={ this.state.errorsFieldMap }
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

