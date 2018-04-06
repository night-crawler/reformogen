import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { Form } from 'semantic-ui-react';
import Select from 'react-select';

import { extractIdentity } from '../../../formogen-redux/utils';  // TODO: this is not THIS place for it
import { errorsType, layoutOptsType } from '../../fieldPropTypes';
import Label from '../common/Label';
import ErrorsList from '../common/ErrorsList';


makeOptions.propTypes = PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
}));

/**
 *
 * @param fieldData
 */
function makeOptions(fieldData) {
    return fieldData.map(({ id, name }) => ( { label: name, value: id } ));
}


InlineForeignKeyField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
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
export default function InlineForeignKeyField(props) {
    const handleChange = (val) => {
        props.onChange(null, { name: props.name, value: val ? val * 1 : null });
    };

    let _props = {
        clearable: !props.required,
        closeOnSelect: true,
        disabled: !props.editable,
        multi: false,
        onChange: handleChange,
        options: makeOptions(props.data),
        placeholder: props.placeholder,
        simpleValue: true,
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
            {
                !props.helpTextOnHover
                    ? <span className='help-text'>{ props.help_text }</span>
                    : ''
            }
            <ErrorsList messages={ props.errors } />
        </Form.Field>
    );
}
