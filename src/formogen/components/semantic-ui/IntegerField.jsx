import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'semantic-ui-react';
import { errorsType, layoutOptsType } from '../fieldPropTypes';
import Label from './Label';
import { MessageList } from './MiscComponents';


IntegerField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    min_value: PropTypes.number,
    max_value: PropTypes.number,
    decimal_places: PropTypes.number,
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
export default function IntegerField(props) {
    let _props = {
        name: props.name,
        value: props.value,
        placeholder: props.placeholder,
        onChange: props.onChange,
    };

    let input_options = {
        type: 'number',
        min: props.min_value || undefined,
        max: props.max_value || undefined,
    };

    switch(props.type) {
        case 'PositiveSmallIntegerField':
            if (input_options.min === undefined) {input_options.min = 0;}
            if (input_options.max === undefined) {input_options.max = 32767;}
            break;

        case 'PositiveIntegerField':
            if (input_options.min === undefined) {input_options.min = 0;}
            if (input_options.max === undefined) {input_options.max = 2147483647;}
            break;

        // https://docs.djangoproject.com/en/1.11/ref/models/fields/#smallintegerfield
        case 'SmallIntegerField':
            if (input_options.min === undefined) {input_options.min = -32768;}
            if (input_options.max === undefined) {input_options.max = 32767;}
            break;

        case 'IntegerField':
            if (input_options.min === undefined) {input_options.min = -2147483648;}
            if (input_options.max === undefined) {input_options.max = 2147483647;}
            break;

        case 'FloatField':
            input_options.step = 0.1;
            break;

        case 'DecimalField':
            input_options.step = 0.1;
            if (props.decimal_places) {
                if (props.decimal_places >= 2) {
                    input_options.step = 1 / Math.pow(10, (props.decimal_places / 2));
                }
            }
            break;

        default:
            break;
    }

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
            <Form.Input { ..._props } { ...input_options } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
            <MessageList messages={ props.errors } />
        </Form.Field>
    );
}
