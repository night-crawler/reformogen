import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

import { errorsType, displayOptionsType } from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';


DateTimeField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  max_length: PropTypes.number,
  help_text: PropTypes.string,
  placeholder: PropTypes.string,
  errors: errorsType,

  required: PropTypes.bool,
  editable: PropTypes.bool,

  helpTextOnHover: PropTypes.bool,
  displayOptions: displayOptionsType,
  locale: PropTypes.string,

  
  timeFormat: PropTypes.string,
  timeIntervals: PropTypes.number,
  todayButton: PropTypes.string,
  dateFormat: PropTypes.string,
  dropdownMode: PropTypes.string,

  onChange: PropTypes.func,
};
DateTimeField.defaultProps = {
  timeFormat: 'HH:mm',
  timeIntervals: 30,
  todayButton: 'Now',
  dateFormat: 'YYYY.MM.DD HH:mm',
  dropdownMode: 'select',
};
export function DateTimeField(props) {
  const handleChange = (momentTimeObject, e) => {
    props.onChange(e, {
      name: props.name,
      value: momentTimeObject ? momentTimeObject.toISOString() : null
    });
  };

  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.displayOptions.width }
      error={ !_.isEmpty(props.errors) }
    >
      <FieldLabel { ...props } />
      <DatePicker 
        name={ props.name }
        selected={ props.value ? moment(props.value) : null }  // null == no selected value
        onChange={ handleChange }
        showTimeSelect={ true }
        
        locale={ props.locale }
        placeholderText={ props.placeholder }
        timeFormat={ props.timeFormat }
        timeIntervals={ props.timeIntervals }
        todayButton={ props.todayButton }
        // TODO: get from moment
        dateFormat={ props.dateFormat }
        dropdownMode={ props.dropdownMode }
        
        showYearDropdown={ true }
        showMonthDropdown={ true }
      />
      { !props.helpTextOnHover
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
