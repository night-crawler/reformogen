import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Form } from 'semantic-ui-react';
import TimePicker from 'react-times';

import { errorsType, displayOptionsType } from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';

export class TimeField extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    max_length: PropTypes.number,
    help_text: PropTypes.string,
    errors: errorsType,
  
    required: PropTypes.bool,
    editable: PropTypes.bool,
  
    helpTextOnHover: PropTypes.bool,
    displayOptions: displayOptionsType,
  
    updateProps: PropTypes.func,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    let [ hour, minute ] = [ null, null ];
    if (props.value) {
      [ hour, minute ] = moment(this.props.value, 'HH:mm:ss').format('HH:mm').split(':');
    }

    this.state = {
      hour, minute,
      meridiem: props.meridiem || null,
    };
  }
  render() {
    return (
      <Form.Field
        required={ this.props.required }
        disabled={ !this.props.editable }
        width={ this.props.displayOptions.width }
        error={ !_.isEmpty(this.props.errors) }
      >
        <FieldLabel { ...this.props } />
        <TimePicker 
          autoMode={ true }
          timeMode='24'
          focused={ false }
          withoutIcon={ false }
          showTimezone={ true }
          onTimeChange={ this.handleTimeChange }
          onFocusChange={ this.handleFocusChange }
          theme='material'
          timezone={ this.props.timezone }

          time={ this.state.hour && this.state.minute 
            ? `${this.state.hour}:${this.state.minute}` 
            : null 
          }
          meridiem={ this.state.meridiem }
        />
        { !this.props.helpTextOnHover
          ? <span className='help-text'>{ this.props.help_text }</span>
          : '' 
        }
        <ErrorsList messages={ this.props.errors } />
      </Form.Field>
    );
  }

  handleTimeChange = options => {
    // eslint-disable-next-line
    this.setState(options);
  };

  handleFocusChange = focus => {
    // eslint-disable-next-line
    this.setState(
      { focus },
      () => !focus && this.props.onChange(null, { 
        name: this.props.name, 
        value: `${this.state.hour}:${this.state.minute}` 
      })
    );
  };
}
