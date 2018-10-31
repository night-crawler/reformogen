import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import { upperFirst } from 'lodash';

FieldLabel.displayName = 'FieldLabel';
FieldLabel.propTypes = {
  upperFirstLabel: PropTypes.bool,
  verbose_name: PropTypes.string.isRequired,
  help_text: PropTypes.string,
  /** show help text on hover label (?) sign, or put in the bottom */
  helpTextOnHover: PropTypes.bool,
};
export function FieldLabel(props) {
  const labelText = props.upperFirstLabel 
    ? upperFirst(props.verbose_name) 
    : props.verbose_name;

  if (!props.help_text || !props.helpTextOnHover)
    return <label>{ labelText }</label>;

  /* replaced trigger's <Icon name="help" /> with <i> to prevent react warning:
     * Warning: Stateless function components cannot be given refs. Attempts to access this ref will fail.
  */
  return (
    <label>
      <Popup
        trigger={ <i className='icon help' /> }
        content={ props.help_text }
        wide={ true }
        position='bottom left'
      />
      { labelText }
    </label>
  );
}
