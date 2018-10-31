import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Form } from 'semantic-ui-react';

import { errorsType, layoutOptsType } from '../../fieldPropTypes';
import Label from '../common/Label';
import { ErrorsList } from '../common/ErrorsList';

TextField.propTypes = {
  type: PropTypes.string.isRequired,

  layoutOpts: layoutOptsType,

  name: PropTypes.string.isRequired,
  verbose_name: PropTypes.string.isRequired,
  help_text: PropTypes.string.isRequired,
  errors: errorsType,

  max_length: PropTypes.number,

  editable: PropTypes.bool,
  required: PropTypes.bool,

  value: PropTypes.string,

  placeholder: PropTypes.string,

  helpTextOnHover: PropTypes.bool,

  updateProps: PropTypes.func,

  onChange: PropTypes.func,
};
export function TextField(props) {
  let _props = {
    name: props.name,
    value: props.value,
    onChange: props.onChange,
    placeholder: props.placeholder,
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
      <Form.TextArea { ..._props } />
      { !props.helpTextOnHover
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
