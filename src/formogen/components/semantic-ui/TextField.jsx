import React from 'react';
import { Form } from 'semantic-ui-react';
import _ from 'lodash';
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

    let _props = {
        name: props.name,
        value: props.value,
        onChange: props.onChange,
    };

    if (_.isFunction(props.updateProps)) {
        _props = props.updateProps(_props, props);
    }

    return (
        <Form.Field required={ props.required } disabled={ !props.editable } width={ props.width }>
            <Label { ...props } />
            <Form.TextArea { ..._props } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
