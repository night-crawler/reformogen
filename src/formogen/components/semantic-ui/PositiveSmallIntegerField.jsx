import React from 'react';
import { Form } from 'semantic-ui-react';
import Label from './Label';

import propTypes from '../fieldPropTypes';


PositiveSmallIntegerField.propTypes = propTypes;
export default function PositiveSmallIntegerField(props) {
    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            <Label { ...props } />
            <Form.Input
                name={ props.name }
                value={ props.value }
                onChange={ props.onChange }
                type='number'
            />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
