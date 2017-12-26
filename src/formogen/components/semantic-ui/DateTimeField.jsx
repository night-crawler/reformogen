import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import moment from 'moment';

import DatePicker from 'react-datepicker';

import { Form } from 'semantic-ui-react';
import { errorsType, layoutOptsType } from '../fieldPropTypes';
import Label from './Label';
import { MessageList } from './MiscComponents';


/**
 * Component should receive a value in ISO format
 * @param {object} props
 * @param {string} props.name - internal field name
 * @param {string} props.verbose_name
 * @param {string} props.placeholder
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
DateTimeField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    max_length: PropTypes.number,
    help_text: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    errors: errorsType,

    required: PropTypes.bool,
    editable: PropTypes.bool,

    helpTextOnHover: PropTypes.bool,
    layoutOpts: layoutOptsType,
    locale: PropTypes.string,

    updateProps: PropTypes.func,
    onChange: PropTypes.func,
};
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
        // todo: get from momemt
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
            { !props.helpTextOnHover ? <span className='help-text'>{ props.help_text }</span> : '' }
            <MessageList messages={ props.errors } />
        </Form.Field>
    );
}
