import React from 'react';
import { Form } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';
import TimePicker from 'react-times';
import Label from './Label';

import propTypes from '../fieldPropTypes';


import 'react-times/css/material/default.css';


DateField.propTypes = propTypes;
export default function DateField(props) {
    let hour=null, minutes=null;

    const handleChange = (timeString) => {
        // trigger global onChange in case user've changed both minutes and hours
        // (calling onChange on every change causes redraw && closing TimePicker)
        hour && minutes && props.onChange(null, {
            name: props.name,
            // append seconds to time
            value: timeString ? moment(timeString, 'HH:mm').format('HH:mm:ss') : null
        });
    };

    let _props = {
        autoMode: true,
        name: props.name,
        time: props.value ? moment(props.value, 'HH:mm:ss').format('HH:mm') : null,
        timeMode: '24',
        focused: false,
        withoutIcon: false,
        showTimezone: true,
        onMinuteChange: (_minutes) => (minutes = _minutes),
        onHourChange: (_hour) => (hour = _hour),
        onTimeChange: handleChange,
        // timezone: 'America/New_York',
        theme: 'material',
    };

    if (_.isFunction(props.updateProps)) {
        _props = props.updateProps(_props, props);
    }

    return (
        <Form.Field required={ props.required } disabled={ !props.editable } width={ props.layoutOpts.width }>
            <Label { ...props } />
            <TimePicker { ..._props } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
