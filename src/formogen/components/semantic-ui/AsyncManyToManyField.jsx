import React from 'react';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';
import _ from 'lodash';
import 'react-select/dist/react-select.css';
import fetch from 'isomorphic-fetch';
import Label from './Label';
import propTypes from '../fieldPropTypes';
import * as URI from 'urijs';

import ModelInstanceOption from './ReactSelectOptionComponent';
import ModelInstanceValue from './ReactSelectValueComponent';


AsyncManyToManyField.propTypes = propTypes;
export default function AsyncManyToManyField(props) {
    /*
        "name": "inspire_source",
        "verbose_name": "inspire source",
        "help_text": "",
        "blank": true,
        "null": false,
        "editable": true,
        "type": "ForeignKeyField",
        "required": false,
        "data": []
    */
    const handleChange = (val) => {
        let plainIds = val.map( ({ id }) => (id*1) );
        props.onChange(null, {name: props.name, value: plainIds});
    };

    const loadOptions = (input, callback) => {
        let uri = URI(props.data).addSearch({q: input});

        fetch(uri)
            .then(response => response.json())
            .then(json => {
                if (_.isArray(json)) {  /* without pagination */
                    callback(null, { complete: false, options: json, });
                } else {  /* with pagination */
                    callback(null, { complete: false, options: json.results, });
                }
            });
    };

    let _props = {
        clearable: !props.required,
        closeOnSelect: true,
        disabled: !props.editable,
        multi: true,
        onChange: handleChange,
        placeholder: props.placeholder,

        value: props.value,
        inputProps: {type: 'react-type'},  // fixes broken semantic markup
        removeSelected: true,

        valueKey: 'id',  /* server-side model should provide `id` for object */
        // simpleValue: true,  /* we have no need to store whole objects in parent's state */

        optionComponent: ModelInstanceOption,
        valueComponent: ModelInstanceValue,

        // https://github.com/JedWatson/react-select#advanced-filters
        // we use server-side filters, Select should not filter it again
        filterOption: () => true,
        loadOptions: loadOptions,

        // rtl: this.state.rtl,
    };

    if (_.isFunction(props.updateProps)) {
        _props = props.updateProps(_props, props);
    }

    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            <Label { ...props } />
            <Select.Async { ..._props } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
