import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import TimePicker from 'react-times';
import { Form } from 'semantic-ui-react';
import { errorsType, layoutOptsType } from '../fieldPropTypes';
import Label from './Label';
import { MessageList } from './MiscComponents';


DateField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    max_length: PropTypes.number,
    help_text: PropTypes.string.isRequired,
    errors: errorsType,

    required: PropTypes.bool,
    editable: PropTypes.bool,

    helpTextOnHover: PropTypes.bool,
    layoutOpts: layoutOptsType,

    updateProps: PropTypes.func,
    onChange: PropTypes.func,
};
export default function DateField(props) {
    let hour = null, minutes = null;

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
        onMinuteChange: (_minutes) => ( minutes = _minutes ),
        onHourChange: (_hour) => ( hour = _hour ),
        onTimeChange: handleChange,
        // timezone: 'America/New_York',
        theme: 'material',
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
            <TimePicker { ..._props } />
            { !props.helpTextOnHover ? <span className='help-text'>{ props.help_text }</span> : '' }
            <MessageList messages={ props.errors } />
        </Form.Field>
    );
}
