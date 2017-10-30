import React, { Component } from 'react';

import fetch from 'isomorphic-fetch';

import _ from 'lodash';

import { Button, Form, Header, Segment } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.css';  // TODO: сoncretize it

import FormogenFormFieldsComponent from './FormFieldComponent';
import { LoaderComponent } from './MiscComponents'


export default class FormogenComponent extends Component {
    constructor(props) {
        super(props);

        let state = Object.assign({}, props);

        state.metaData = null;  // accumulates all metaData
        state.assignedMetaData = props.metaData;
        state.receivedMetaData = null;

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
        };
    }

    // --------------- React.js standard ---------------
    componentWillMount() {
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
        console.log('<FormogenComponent/>, handleSubmit()');
        this.handleOnSubmit({test: 1});
    }
    handleSuccess() {
        console.log('<FormogenComponent/>, handleSuccess()');
        this.handleOnSuccess();
    }
    handleFail() {
        // if http status is 400 (Bad Request) it should show form errors
        console.log('<FormogenComponent/>, handleFail()');
        this.handleOnSubmit();
    }

    // --------------- fetch-receive MetaData (use redux) ---------------
    fetchMetaData(url) {
        fetch(url)
            .then(response => response.json())
            .then(json => this.receiveMetaData(json));
    }
    receiveMetaData(data) {
        this.setState({
            metaDataReady: true,
            receivedMetaData: Object.assign({}, data),
        });
    }

    // --------------- get methods ---------------
    getTitle() {
        const { title, assignedMetaData, receivedMetaData } = this.state;

        if (assignedMetaData) {
            return assignedMetaData.title.substr();
        }
        if (receivedMetaData) {
            return receivedMetaData.title.substr();
        }
        return title.substr();
    }
    getLayout() {
        const { assignedMetaData, receivedMetaData } = this.state;

        if (assignedMetaData) {
            return Object.assign({}, assignedMetaData.layout);
        }
        if (receivedMetaData) {
            return Object.assign({}, receivedMetaData.layout);
        }
        return {};
    }
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
        const { metaDataReady } = this.state;
        if (!metaDataReady) return <LoaderComponent/>;

        return <Segment>
            <Header as='h2'>{ this.getTitle() }</Header>
            <Form>
                <FormogenFormFieldsComponent
                    fields={ this.getFields() }
                    onSubmit={ (validatedData) => this.handleSubmit(validatedData) }
                />
                <Button
                    content={ 'Submit' }
                    onClick={ () => this.handleSubmit() }
                    onKeyPress={ () => this.handleSubmit() }

                    fluid
                    type="submit"
                />
            </Form>
        </Segment>;
    }
}

FormogenComponent.defaultProps = {
    // data
    title: 'formogen form',

    // urls
    metaDataUrl: null,

    // callbacks
    onSubmit: data => console.log(`<FormogenComponent/>, onSubmit() - ${ data }`),
    onSuccess: data => console.log(`<FormogenComponent/>, onSuccess() - ${ data }`),
    onFail: data => console.log(`<FormogenComponent/>, onFail() - ${ data }`),
};
