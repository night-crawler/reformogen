import React from 'react';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';
import _ from 'lodash';
import Label from './Label';

import propTypes from '../fieldPropTypes';


const makeReactSelectOptions = (choices) => {
    return choices.map( ([ key, val ]) => {
        return {
            value: key,
            label: val,
        };
    });
};


AutocompleteChoiceField.propTypes = propTypes;
export default function AutocompleteChoiceField(props) {
    /*
        "name": "state",
        "verbose_name": "state",
        "help_text": "",
        "blank": false,
        "null": false,
        "editable": true,
        "type": "PositiveSmallIntegerField",
        "required": true,
        "default": 255,
        "choices": [
            [0, "dead"],
            [255, "alive"],
            [30, "dried"]
        ]
     */

    const handleChange = (newVal) => {
        props.onChange(
            null,
            {name: props.name, value: newVal ? newVal.value : null }
        );
    };

    let _props = {
        clearable: !props.required,
        name: props.name,
        value: props.value,
        options: makeReactSelectOptions(props.choices),
        onChange: handleChange,
        inputProps: {type: 'react-type'},  // fixing breaking semantic markup
    };

    if (_.isFunction(props.updateProps)) {
        _props = props.updateProps(_props, props);
    }

    return (
        <Form.Field required={ props.required } disabled={ !props.editable } width={ props.width }>
            <Label { ...props } />
            <Select { ..._props } />

            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
