import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Form, Checkbox } from 'semantic-ui-react';

import { errorsType, layoutOptsType } from '../fieldPropTypes';
import Label from './Label';

import { MessageList } from './MiscComponents';


BooleanField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.bool,
    help_text: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    widget: PropTypes.string,
    errors: errorsType,

    required: PropTypes.bool,
    editable: PropTypes.bool,

    helpTextOnHover: PropTypes.bool,
    layoutOpts: layoutOptsType,

    updateProps: PropTypes.func,
    onChange: PropTypes.func,
};
export default function BooleanField(props) {
    const handleChange = (e, newValue) => {
        props.onChange(e, { name: props.name, value: newValue.checked });
    };

    const { widget = '' } = props;

    let _props = {
        name: props.name,
        checked: props.value,
        placeholder: props.placeholder,
        onChange: handleChange,
        toggle: widget.toLowerCase() === 'toggle' || undefined,
        slider: widget.toLowerCase() === 'slider' || undefined,
    };

    if (_.isFunction(props.updateProps)) {
        _props = props.updateProps(_props, props);
    }

    return (
        <Form.Field
            required={ props.required }
            disabled={ !props.editable }
            width={ props.layoutOpts.width }
            error={ !_.isEmpty(props.errors) }
        >
            <Label { ...props } />
            <Checkbox { ..._props } />
            { !props.helpTextOnHover ? <span className='help-text'>{ props.help_text }</span> : '' }
            <MessageList messages={ props.errors } />
        </Form.Field>
    );
}
