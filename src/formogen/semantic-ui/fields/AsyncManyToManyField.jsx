import React from 'react';
import _ from 'lodash';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';

import propTypes from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';


AsyncManyToManyField.propTypes = propTypes;
export default function AsyncManyToManyField(props) {
  const fieldProps = _.pickBy(props, (value, key) => key !== 'selectProps');

  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.layoutOpts.width }
      error={ !_.isEmpty(props.errors) }
    >
      <FieldLabel { ...fieldProps } />
      <Select { ...props.selectProps } />
      { !props.helpTextOnHover
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
