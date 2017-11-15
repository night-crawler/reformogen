import React from 'react';
import loglevel from 'loglevel';
import { Form } from 'semantic-ui-react';

import Label from './Label';

import propTypes from '../fieldPropTypes';


/**
 * Generic Field Component to use in DEBUG MODE ONLY
 * @param {Object} props
 * @returns {XML}
 * @constructor
 */
GenericField.propTypes = propTypes;
export default function GenericField(props) {
    loglevel
        .getLogger('Formogen/components/semantic-ui/GenericField.jsx')
        .warn(`Using a placeholder GenericFieldComponent to render field "${props.name}" of type "${props.type}"`);
    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            <Label { ...props } />
            <pre>
                { JSON.stringify(props, null, 4) }
            </pre>
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
