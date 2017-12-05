import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'semantic-ui-react';

import { errorsType, layoutOptsType } from '../fieldPropTypes';
import Label from './Label';

import { MessageList } from './MiscComponents';


CharField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    max_length: PropTypes.number,
    help_text: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    errors: errorsType,

    required: PropTypes.bool,
    editable: PropTypes.bool,

    helpTextOnHover: PropTypes.bool,
    layoutOpts: layoutOptsType,

    updateProps: PropTypes.func,
    onChange: PropTypes.func,
};
export default function CharField(props) {
    let _props = {
        name: props.name,
        value: props.value,
        placeholder: props.placeholder,
        onChange: props.onChange,
        type: 'text',
        maxLength: props.max_length,
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
            <Form.Input { ..._props } />
            { !props.helpTextOnHover ? <span className='help-text'>{ props.help_text }</span> : '' }
            <MessageList messages={ props.errors } />
        </Form.Field>
    );
}
