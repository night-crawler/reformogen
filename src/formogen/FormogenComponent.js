import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

import _ from 'lodash';

import { Button, Form, Header, Segment } from 'semantic-ui-react';

import FormogenFormFieldsComponent from './FormFieldsComponent';
// import { LoaderComponent } from './MiscComponents';


export default class FormogenComponent extends Component {
    static propTypes = {
        metaData: PropTypes.object,
        title: PropTypes.string,
        metaDataUrl: PropTypes.string,
        onSubmit: PropTypes.func,
        onSuccess: PropTypes.func,
        onFail: PropTypes.func,
        upperFirstLabels: PropTypes.bool,
    };
    static defaultProps = {
        // data
        title: 'formogen form',
        upperFirstLabels: false,

        // urls
        metaDataUrl: null,

        // callbacks
        onSubmit: data => console.log(`<FormogenComponent />, onSubmit() - ${ data }`),
        onSuccess: data => console.log(`<FormogenComponent />, onSuccess() - ${ data }`),
        onFail: data => console.log(`<FormogenComponent />, onFail() - ${ data }`),
    };


    constructor(props) {
        super(props);
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
        console.log('<FormogenComponent />, handleSubmit()');
        this.handleOnSubmit({test: 1});
    }
    handleSuccess() {
        console.log('<FormogenComponent />, handleSuccess()');
        this.handleOnSuccess();
    }
    handleFail() {
        // if http status is 400 (Bad Request) it should show form errors
        console.log('<FormogenComponent />, handleFail()');
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
            return _.upperFirst(assignedMetaData.title.substr());
        }
        if (receivedMetaData) {
            return _.upperFirst(receivedMetaData.title.substr());
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

        return (
            <Segment>
                <Form loading={ !this.state.metaDataReady }>
                    <Header as='h2' dividing={ true }>{ this.getTitle() }</Header>
                    <FormogenFormFieldsComponent
                        key={ this.getFields() }
                        fields={ this.getFields() }
                        onSubmit={ (validatedData) => this.handleSubmit(validatedData) }
                        upperFirstLabels={ this.props.upperFirstLabels }
                    />
                    <Button
                        content={ 'Submit' }
                        onClick={ () => this.handleSubmit() }
                        onKeyPress={ () => this.handleSubmit() }

                        fluid={ true }
                        type="submit"
                    />
                </Form>
            </Segment>
        );
    }
}

