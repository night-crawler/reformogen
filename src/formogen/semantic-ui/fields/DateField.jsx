import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

import { errorsType, layoutOptsType } from '../../fieldPropTypes';
import Label from '../common/Label';
import ErrorsList from '../common/ErrorsList';


DateField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
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
export default function DateField(props) {
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
    showTimeSelect: false,
    locale: props.locale,
    placeholderText: props.placeholder,
    todayButton: 'Now',
    dateFormat: 'YYYY.MM.DD',
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
      {
        !props.helpTextOnHover
          ? <span className='help-text'>{ props.help_text }</span>
          : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
