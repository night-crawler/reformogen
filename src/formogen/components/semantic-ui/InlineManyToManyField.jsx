import React from 'react';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { MessageList } from './MiscComponents';

import Label from './Label';

import propTypes from '../fieldPropTypes';


makeOptions.propTypes = PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
}));

/**
 *
 * @param fieldData
 */
function makeOptions(fieldData) {
    return fieldData.map( ({ id, name }) => ({label: name, value: id}) );
}


InlineManyToManyField.propTypes = propTypes;
export default function InlineManyToManyField(props) {
    /*
        "name": "inspire_source",
        "verbose_name": "inspire source",
        "help_text": "",
        "blank": true,
        "null": false,
        "editable": true,
        "type": "ManyToManyField",
        "required": false,
        "data": []
    */
    const handleChange = (val) => {
        const plainIds = val.map( ({ value }) => (value*1) );
        props.onChange(null, {name: props.name, value: plainIds});
    };

    let _props = {
        closeOnSelect: false,
        disabled: !props.editable,
        multi: true,
        onChange: handleChange,
        options: makeOptions(props.data),
        placeholder: props.placeholder,
        // simpleValue: true,
        value: props.value,
        inputProps: {type: 'react-type'},  // fixes broken semantic markup
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

            { !props.helpTextOnHover ? <span className='help-text'>{ props.help_text }</span> : ''}
            <MessageList messages={ props.errors } />
        </Form.Field>
    );
}
