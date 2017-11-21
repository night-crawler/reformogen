import React from 'react';
import { Form } from 'semantic-ui-react';
import _ from 'lodash';
import Label from './Label';

import propTypes from '../fieldPropTypes';


CharField.propTypes = propTypes;
export default function CharField (props) {
    /*
        "name": "first_name",
        "verbose_name": "real name",
        "help_text": "some help",
        "blank": true,
        "null": false,
        "editable": true,
        "max_length": 40,
        "type": "CharField",
        "required": false
    */
    let _props = {
        name: props.name,
        value: props.value,
        onChange: props.onChange,
        type: 'text',
        maxLength: props.max_length,
    };

    if (_.isFunction(props.updateProps)) {
        _props = props.updateProps(_props, props);
    }

    return (
        <Form.Field required={ props.required } disabled={ !props.editable } width={ props.layoutOpts.width }>
            <Label { ...props } />
            <Form.Input { ..._props } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
