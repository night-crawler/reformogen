import React from 'react';
import { Form } from 'semantic-ui-react';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import _ from 'lodash';

import 'rc-time-picker/assets/index.css';

import Label from './Label';

import propTypes from '../fieldPropTypes';


DateField.propTypes = propTypes;
export default function DateField(props) {
    const handleChange = (momentTimeObject) => {
        // proxy event with SUI-React compliant style
        props.onChange(null, {
            name: props.name,
            value: momentTimeObject ? momentTimeObject.format('HH:mm:ss') : null
        });
    };

    // proxyConsole.js:56 Warning: Failed form propType: You provided a `value` prop to a form field without an `onChange` handler
    let _props = {
        name: props.name,
        // locale: props.locale,
        value: props.value ? moment(props.value, 'HH:mm:ss') : null,
        onChange: handleChange,
        // showSecond: false,
    };

    if (_.isFunction(props.updateProps)) {
        _props = props.updateProps(_props, props);
    }
    console.log(_props);

    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            <Label { ...props } />
            <TimePicker { ..._props } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
