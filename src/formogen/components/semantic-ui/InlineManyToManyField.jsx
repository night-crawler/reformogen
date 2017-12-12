import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import { Form } from 'semantic-ui-react';
import { extractIdentity } from '../../utils';

import { errorsType, layoutOptsType } from '../fieldPropTypes';

import Label from './Label';
import { MessageList } from './MiscComponents';


makeOptions.propTypes = PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
}));

function makeOptions(fieldData) {
    return fieldData.map(({ id, name }) => ( { label: name, value: id } ));
}


InlineManyToManyField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.any),
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })),
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
export default function InlineManyToManyField(props) {
    const handleChange = (val) => {
        const plainIds = val.map(({ value }) => ( value * 1 ));
        props.onChange(null, { name: props.name, value: plainIds });
    };

    let _props = {
        closeOnSelect: false,
        disabled: !props.editable,
        multi: true,
        onChange: handleChange,
        options: makeOptions(props.data),
        placeholder: props.placeholder,
        // simpleValue: true,
        value: extractIdentity(props.value),
        inputProps: { type: 'react-type' },  // fixes broken semantic markup
        removeSelected: true,
        // rtl: this.state.rtl,
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

            { !props.helpTextOnHover ? <span className='help-text'>{ props.help_text }</span> : '' }
            <MessageList messages={ props.errors } />
        </Form.Field>
    );
}
