import PropTypes from 'prop-types';


const defaultFieldPropTypes = {
    /* common */
    type: PropTypes.string.isRequired,

    name: PropTypes.string.isRequired,
    verbose_name: PropTypes.string.isRequired,
    help_text: PropTypes.string.isRequired,
    max_length: PropTypes.number,  /* for CharField && TextField */

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

    /* method to provide additional/redefine some opts in child component */
    updateProps: PropTypes.func,

    onChange: PropTypes.func,

    layoutOpts: PropTypes.object,
};

export default defaultFieldPropTypes;
