import React from 'react';

import moment from 'moment';

import _ from 'lodash';

import { Form } from 'semantic-ui-react';

import DatePicker from 'react-datepicker';

import { MessageList } from './MiscComponents';
import Label from './Label';
import propTypes from '../fieldPropTypes';


/**
 * Component should receive a value in ISO format
 * @param {object} props
 * @param {string} props.name - internal field name
 * @param {string} props.verbose_name
 * @param {string} props.help_text -
 * @param {bool} props.blank - determines if we can leave field unfilled
 * @param {bool} props.null - determines if we can store NULL values
 * @param {bool} props.editable - can we edit the field value?
 * @param {string} props.type - Django ORM field type
 * @param {bool} props.required
 * @param {string} props.value - well ISO-formatted value to pass moment()
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

    let _props = {
        name: props.name,
        selected: props.value ? moment(props.value) : null,  // null == no selected value
        onChange: handleChange,
        showTimeSelect: true,
        timeFormat: 'HH:mm',
        timeIntervals: 60,
        locale: props.locale,
        placeholderText: props.placeholder,
        todayButton: 'Now',
        dateFormat: 'YYYY.MM.DD HH:mm',
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
