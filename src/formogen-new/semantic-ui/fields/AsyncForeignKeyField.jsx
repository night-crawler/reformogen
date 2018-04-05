import React from 'react';

import _ from 'lodash';

import { Form } from 'semantic-ui-react';

import Select from 'react-select';

import propTypes from '../../fieldPropTypes';
import Label from './Label';
import { MessageList } from './MiscComponents';


AsyncForeignKeyField.propTypes = propTypes;
export default function AsyncForeignKeyField(props) {
    const fieldProps = _.pickBy(props, (value, key) => key !== 'selectProps');

    return (
        <Form.Field
            required={ props.required }
            disabled={ !props.editable }
            width={ props.layoutOpts.width }
            error={ !_.isEmpty(props.errors) }
        >
            <Label { ...fieldProps } />
            <Select { ...props.selectProps } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : '' }
            <MessageList messages={ props.errors } />
        </Form.Field>
    );
}
