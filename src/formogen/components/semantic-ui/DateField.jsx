import React from 'react';
import { Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import { MessageList } from './MiscComponents';
import _ from 'lodash';

import Label from './Label';

import propTypes from '../fieldPropTypes';


DateField.propTypes = propTypes;
export default function DateField(props) {
    const handleChange = (momentTimeObject, e) => {
        // proxy event with SUI-React compliant style
        props.onChange(e, {
            name: props.name,
            value: momentTimeObject ? momentTimeObject.toISOString() : null
        });
    };

    let _props = {
        name: props.name,
        selected: props.value ? moment(props.value) : null,  // null == no selected value
        onChange: handleChange,
        showTimeSelect: false,
        locale: props.locale,
        placeholderText: props.placeholder,
        todayButton: 'Now',
        dateFormat: 'YYYY.MM.DD',
        showYearDropdown: true,
        showMonthDropdown: true,
        dropdownMode: 'select',
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
            <DatePicker { ..._props } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
            <MessageList messages={ props.errors } />
        </Form.Field>
    );
}
