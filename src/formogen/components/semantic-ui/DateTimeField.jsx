import React from 'react';
import { Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

import Label from './Label';

import propTypes from '../fieldPropTypes';


/**
 * Component should receive a value in ISO format
 * @param {Object[]} props {
 *      "name": "dt_death",
        "verbose_name": "death date time",
        "help_text": "",
        "blank": true,
        "null": true,
        "editable": true,
        "type": "DateTimeField",
        "required": false
 * }
 * @param {string} props[].value - well ISO-formatted value to pass moment()
 * @returns {XML}
 * @constructor
 */
DateTimeField.propTypes = propTypes;
export default function DateTimeField(props) {
    const handleChange = (momentTimeObject, e) => {
        // proxy event with SUI-React compliant style
        props.onChange(e, {
            name: props.name,
            value: momentTimeObject ? momentTimeObject.toISOString() : null
        });
    };

    // null == no selected value
    const preSelectedValue = props.value ? moment(props.value) : null;
    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            <Label { ...props } />
            <DatePicker
                name={ props.name }
                selected={ preSelectedValue }
                onChange={ handleChange }
                showTimeSelect={ true }
                timeFormat="HH:mm"
                timeIntervals={ 60 }
                locale={ props.locale }
                placeholderText={ props.placeholder || props.help_text }
                todayButton={ 'Now' }
                dateFormat="YYYY.MM.DD HH:mm"
                showYearDropdown={ true }
                showMonthDropdown={ true }
                dropdownMode="select"
            />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
