import PropTypes from 'prop-types';
import React from 'react';

import _ from 'lodash';

import { Form } from 'semantic-ui-react';
import Select from 'react-select';

import { errorsType, layoutOptsType } from '../../fieldPropTypes';
import Label from '../common/Label';
import ErrorsList from '../common/ErrorsList';


const makeReactSelectOptions = (choices) => {
    return choices.map(([key, val]) => {
        return {
            value: key,
            label: val,
        };
    });
};


AutocompleteChoiceField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    choices: PropTypes.arrayOf(PropTypes.array),
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
export default function AutocompleteChoiceField(props) {
    const handleChange = (newVal) => {
        props.onChange(
            null,
            { name: props.name, value: newVal ? newVal.value : null }
        );
    };

    let _props = {
        clearable: !props.required,
        name: props.name,
        value: props.value,
        placeholder: props.placeholder,
        options: makeReactSelectOptions(props.choices),
        onChange: handleChange,
        inputProps: { type: 'react-type' },  // fixing breaking semantic markup
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
            <Select { ..._props } />
            {
                !props.helpTextOnHover
                    ? <span className='help-text'>{ props.help_text }</span>
                    : ''
            }
            <ErrorsList messages={ props.errors } />
        </Form.Field>
    );
}
