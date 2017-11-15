import React from 'react';
import { Form } from 'semantic-ui-react';
import Label from './Label';
import _ from 'lodash';
import propTypes from '../fieldPropTypes';


PositiveSmallIntegerField.propTypes = propTypes;
export default function PositiveSmallIntegerField(props) {
    let _props = {
        name: props.name,
        value: props.value,
        onChange: props.onChange,
        type:  'number',
        min: props.min_value || 0,
        max: props.max_value || undefined,
    };

    if (_.isFunction(props.updateProps)) {
        _props = props.updateProps(_props, props);
    }

    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            <Label { ...props } />
            <Form.Input { ..._props } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
