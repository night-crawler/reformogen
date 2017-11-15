import React from 'react';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';
import _ from 'lodash';

import 'react-select/dist/react-select.css';

import Label from './Label';

import propTypes from '../fieldPropTypes';


ManyToManyField.propTypes = propTypes;
export default function ManyToManyField(props) {
    /*
        "name": "inspire_source",
        "verbose_name": "inspire source",
        "help_text": "",
        "blank": true,
        "null": false,
        "editable": true,
        "type": "ManyToManyField",
        "required": false,
        "data": []
    */
    const handleChange = (val) => {
        console.log(val);
    };

    let _props = {
        closeOnSelect: false,
        disabled: !props.editable,
        multi: true,
        onChange: handleChange,
        options: [],
        placeholder: props.placeholder,
        simpleValue: true,
        value: props.value,
        inputProps: {type: 'react-type'},  // fixing breaking semantic markup
        // removeSelected: this.state.removeSelected,
        // rtl: this.state.rtl,
    };

    if (_.isFunction(props.updateProps)) {
        _props = props.updateProps(_props, props);
    }

    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            <Label { ...props } />
            <Select { ..._props } />

            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
