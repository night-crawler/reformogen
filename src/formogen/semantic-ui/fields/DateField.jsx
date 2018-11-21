import './ReactDatepicker.fix.css';

import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

import { errorsType, displayOptionsType } from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';


DateField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  max_length: PropTypes.number,
  help_text: PropTypes.string,
  placeholder: PropTypes.string,
  errors: errorsType,

  required: PropTypes.bool,
  editable: PropTypes.bool,

  helpTextOnHover: PropTypes.bool,
  displayOptions: displayOptionsType,
  locale: PropTypes.string,

  showTimeSelect: PropTypes.bool,
  todayButton: PropTypes.string,
  dateFormat: PropTypes.string,
  showYearDropdown: PropTypes.bool,
  showMonthDropdown: PropTypes.bool,
  dropdownMode: PropTypes.string,

  onChange: PropTypes.func,
};
DateField.defaultProps = {
  showTimeSelect: false,
  todayButton: 'Now',
  dateFormat: 'YYYY.MM.DD',
  showYearDropdown: true,
  showMonthDropdown: true,
  dropdownMode: 'select',
};
export function DateField(props) {
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
      error={ !isEmpty(props.errors) }
    >
      <FieldLabel { ...props } />
      <DatePicker 
        style={ { width: '100%' } }
        name={ props.name }
        selected={ props.value ? moment(props.value) : null }
        onChange={ handleChange }
        showTimeSelect={ props.showTimeSelect }
        locale={ props.locale }
        placeholderText={ props.placeholder }
        todayButton={ props.todayButton }
        dateFormat={ props.dateFormat }
        showYearDropdown={ props.showYearDropdown }
        showMonthDropdown={ props.showMonthDropdown }
        dropdownMode={ props.dropdownMode }
      />
      { !props.helpTextOnHover
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
