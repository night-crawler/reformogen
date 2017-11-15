import React from 'react';
import { Form } from 'semantic-ui-react';

import Label from './Label';

import propTypes from '../fieldPropTypes';


TextField.propTypes = propTypes;
export default function TextField(props) {
    /*
        "name": "biography",
        "verbose_name": "biography",
        "help_text": "",
        "blank": true,
        "null": false,
        "editable": true,
        "type": "TextField",
        "required": false
     */

    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            <Label { ...props } />
            <Form.TextArea
                name={ props.name }
                value={ props.value }
                onChange={ props.onChange }
            />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
