import React, { Component } from 'react';

import fetch from 'isomorphic-fetch';

import _ from 'lodash';

import FormogenForm from './FormogenForm';


export default class Formogen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...this.props
        };
    }
    componentWillMount() {
        this.getMetadata();
    }

    handleSubmit(data) {
        console.log(this);
        console.log(data);
    }

    receiveMetaData(data) {
        console.log(data);
        this.setState({
            recievedMetaData: Object.assign({}, data)
        })
    }

    static _getFieldByName(fields, field_name) {
        // for (let f of fields) {
        //     if (f.name == field_name) {
        //         return f
        //     }
        // }
        // return null
    }

    _mergeFields(fields, update_fields) {
        /*
        [ {a}, {b} ]
        [ {c}, {a} ]

        = [ {a}, {b}, {c}, {a} ]

         */

        // for (let f in fields) {
        //     Object.assing({}, )
        //     if (var _f = this._getFieldByName(update_fields, f.name)) {
        //         // f =
        //     }
        // }
    }

    getMetadata() {
        fetch(this.props.metaDataUrl)
            .then(response => response.json())
            .then(json => this.receiveMetaData(json))
    }

    render() {
        if (_.isEmpty(this.state.metaData)) {
            return <div/>
        }

        const data = {};
        const { metaData } = this.state;

        return <FormogenForm
            metaData={ metaData }
            data={ data }
            onSubmit={ (validatedData) => this.handleSubmit(validatedData) }
        />;
    }
}
