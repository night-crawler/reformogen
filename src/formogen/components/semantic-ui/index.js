import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import loglevel from 'loglevel';

import CharField from './CharField';
import AutocompleteChoiceField from './AutocompleteChoiceField';
import TextField from './TextField';
import GenericField from './GenericField';
import PositiveSmallIntegerField from './PositiveSmallIntegerField';
import ManyToManyField from './ManyToManyField';

import DateTimeField from './DateTimeField';
import DateField from './DateField';
import TimeField from './TimeField';

import 'react-select/dist/react-select.css';
import './custom.css';
import 'react-datepicker/dist/react-datepicker.css';

export {
    CharField,
    AutocompleteChoiceField,
    TextField,
    GenericField,
    PositiveSmallIntegerField,
    DateTimeField,
    ManyToManyField,

};

export default class FormFieldsComponent extends React.Component {
    static defaultProps = {
        fields: [],
        upperFirstLabels: false,
        formData: {},
        locale: 'en',
        helpTextOnHover: false,
        fieldUpdatePropsMap: {},
    };

    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.object).isRequired,
        upperFirstLabels: PropTypes.bool,
        helpTextOnHover: PropTypes.bool,
        formData: PropTypes.object,
        locale: PropTypes.string,
        fieldUpdatePropsMap: PropTypes.object,
    };

    static djangoFieldMap = {
        CharField: CharField,
        TextField: TextField,

        PositiveSmallIntegerField: PositiveSmallIntegerField,

        DateField: DateField,
        DateTimeField: DateTimeField,
        TimeField: TimeField,
    };

    constructor(props) {
        super(props);
        this.log = loglevel.getLogger('FormFieldsComponent.jsx');
        this.log.debug('Initialized');

        const formData = Object.assign({}, props.formData);

        this.state = {
            fields: props.fields,
            formData: FormFieldsComponent.updateFormDataWithDefaults(props.fields, formData),
            origFormData: Object.assign({}, props.formData),
        };

    }

    static updateFormDataWithDefaults(fields, formData) {
        let data = Object.assign({}, formData);
        for (let field of fields) {
            if (field.name in data) {
                continue;
            }
            // should undefined for uncontrolled components, not null
            data[field.name] = field.default || '';
        }
        // console.log(data);
        // log.setLevel(log.levels.DEBUG);
        // console.log(log.getLevel());
        return data;
    }

    handleFieldChange = (e, { name, value }) => {
        this.log.debug(`Setting formData field "${name}" to ${typeof value} ${JSON.stringify(value)}`);
        this.setState({
            formData: Object.assign({}, this.state.formData, {[name]: value})
        });
    };

    static pickFieldComponent(opts) {
        if (_.has(opts, 'choices')) {
            if (_.get(opts, 'autocomplete', false)) {
                return AutocompleteChoiceField;
            } else {
                return AutocompleteChoiceField;
            }
        }

        if (opts.type === 'ManyToManyField') {
            return typeof opts.data === 'string' ? GenericField : ManyToManyField;
        }

        return FormFieldsComponent.djangoFieldMap[opts.type] || GenericField;
    }

    renderField(i, opts) {
        const Field = FormFieldsComponent.pickFieldComponent(opts);
        return (
            <Field
                key={ i }
                value={ this.state.formData[opts.name] }
                onChange={ this.handleFieldChange }
                updateProps={ this.props.fieldUpdatePropsMap[opts.name] }
                upperFirstLabel={ this.props.upperFirstLabels }
                helpTextOnHover={ this.props.helpTextOnHover }
                locale={ this.props.locale }
                { ...opts }
            />
        );
    }

    render() {
        const { fields } = this.state;

        const formFields = fields.map( (field, i) => this.renderField(i, field) );

        return <div>{ formFields }</div>;
    }
}
