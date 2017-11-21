import React from 'react';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';
import _ from 'lodash';
import PropTypes from 'prop-types';
import 'react-select/dist/react-select.css';

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


InlineForeignKeyField.propTypes = propTypes;
export default function InlineForeignKeyField(props) {
    /*
        "name": "inspire_source",
        "verbose_name": "inspire source",
        "help_text": "",
        "blank": true,
        "null": false,
        "editable": true,
        "type": "ForeignKeyField",
        "required": false,
        "data": []
    */
    const handleChange = (val) => {
        props.onChange(null, {name: props.name, value: val ? val*1 : null});
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
        value: props.value,
        inputProps: {type: 'react-type'},  // fixes broken semantic markup
        removeSelected: true,
        // rtl: this.state.rtl,
    };

    if (_.isFunction(props.updateProps)) {
        _props = props.updateProps(_props, props);
    }

    return (
        <Form.Field required={ props.required } disabled={ !props.editable } width={ props.layoutOpts.width }>
            <Label { ...props } />
            <Select { ..._props } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
