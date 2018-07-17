import React from 'react';

import _ from 'lodash';
import loglevel from 'loglevel';

import { Form } from 'semantic-ui-react';

import propTypes from '../../fieldPropTypes';
import Label from '../common/Label';
import ErrorsList from '../common/ErrorsList';


/**
 * Generic Field Component to use in DEBUG MODE ONLY
 * @param {Object} props
 * @returns {XML}
 * @constructor
 */
GenericField.propTypes = propTypes;
export default function GenericField(props) {
    loglevel
        .getLogger('Formogen/components/semantic-ui-fields/GenericField.jsx')
        .warn(`Using a placeholder GenericFieldComponent to render field "${ props.name }" of type "${ props.type }"`);

    let _props = Object.assign({}, props);
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
            <pre>
                { JSON.stringify(_props, null, 4) }
            </pre>
            {
                !props.helpTextOnHover
                    ? <span className='help-text'>{ props.help_text }</span>
                    : ''
            }
            <ErrorsList messages={ props.errors } />
        </Form.Field>
    );
}