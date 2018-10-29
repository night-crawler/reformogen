import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popup } from 'semantic-ui-react';


LabelComponent.displayName = 'Label';
LabelComponent.propTypes = {
  upperFirstLabel: PropTypes.bool,
  verbose_name: PropTypes.string.isRequired,
  help_text: PropTypes.string,
  /** show help text on hover label (?) sign, or put in the bottom */
  helpTextOnHover: PropTypes.bool,
};
function LabelComponent(props) {
  const labelText = props.upperFirstLabel ? _.upperFirst(props.verbose_name) : props.verbose_name;
  if (!props.help_text || !props.helpTextOnHover) {
    return <label>{ labelText }</label>;
  }
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

export default LabelComponent;
