import PropTypes from 'prop-types';


const defaultFieldPropTypes = {
    upperFirstLabel: PropTypes.bool,
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
    verbose_name: PropTypes.string.isRequired,
    help_text: PropTypes.string.isRequired,
    blank: PropTypes.bool,
    null: PropTypes.bool,
    editable: PropTypes.bool,
    type: PropTypes.string.isRequired,
    required: PropTypes.bool,
    default: PropTypes.any,
    choices: PropTypes.arrayOf(PropTypes.array),
    placeholder: PropTypes.string,
    max_length: PropTypes.number,
    min_value: PropTypes.number,
    max_value: PropTypes.number,
    helpTextOnHover: PropTypes.bool,

    locale: PropTypes.string,
    onChange: PropTypes.func,
    updateProps: PropTypes.func,
};

export default defaultFieldPropTypes;
