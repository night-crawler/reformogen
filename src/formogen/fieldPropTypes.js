import PropTypes from 'prop-types';


export const displayOptionsType = PropTypes.shape({
  width: PropTypes.number.isRequired,
}).isRequired;

export const errorsType = PropTypes.arrayOf(PropTypes.string.isRequired);


const defaultFieldPropTypes = {
  /* common */
  formId: PropTypes.string,
  type: PropTypes.string.isRequired,

  displayOptions: displayOptionsType,

  name: PropTypes.string.isRequired,
  verbose_name: PropTypes.string.isRequired,
  help_text: PropTypes.string,
  errors: PropTypes.array,

  max_length: PropTypes.number, /* for CharField && TextField */

  blank: PropTypes.bool,
  null: PropTypes.bool,
  editable: PropTypes.bool,
  required: PropTypes.bool,

  default: PropTypes.any,
  value: PropTypes.any,

  /* integers */
  min_value: PropTypes.number,
  max_value: PropTypes.number,
  decimal_places: PropTypes.number,
  max_digits: PropTypes.number,

  /* multiple select M2M or FK */
  multi: PropTypes.bool,

  /* Django choices */
  choices: PropTypes.arrayOf(PropTypes.array),

  /* optional placeholder support (not bundled in default field data in drf-metadata) */
  placeholder: PropTypes.string,

  /* lowercase labels to Uppercase */
  upperFirstLabel: PropTypes.bool,

  /* show help text on hover label (?) sign, or put in the bottom */
  helpTextOnHover: PropTypes.bool,

  /* pass optional locale to child, it can be useful in some cases */
  locale: PropTypes.string,

  onChange: PropTypes.func,
};

export default defaultFieldPropTypes;
