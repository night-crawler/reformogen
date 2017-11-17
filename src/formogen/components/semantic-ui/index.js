import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import loglevel from 'loglevel';

import GenericField from './GenericField';

import CharField from './CharField';
import TextField from './TextField';

import AutocompleteChoiceField from './AutocompleteChoiceField';

import EmbeddedManyToManyField from './InlineManyToManyField';
import EmbeddedForeignKeyField from './InlineForeignKeyField';
import AsyncManyToManyField from './AsyncManyToManyField';
import AsyncForeignKeyField from './AsyncForeignKeyField';

import IntegerField from './IntegerField';

import DateTimeField from './DateTimeField';
import DateField from './DateField';
import TimeField from './TimeField';

import DropzoneField from './DropzoneField';

import 'react-select/dist/react-select.css';
import './custom.css';
import 'react-datepicker/dist/react-datepicker.css';


export {
    CharField,
    AutocompleteChoiceField,
    TextField,
    GenericField,
    DateTimeField,

    EmbeddedForeignKeyField,
    EmbeddedManyToManyField,
    AsyncForeignKeyField,

    IntegerField,
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
        CharField,
        TextField,

        DateField,
        DateTimeField,
        TimeField,

        PositiveSmallIntegerField: IntegerField,
        SmallIntegerField: IntegerField,
        IntegerField: IntegerField,
        PositiveIntegerField: IntegerField,
        DecimalField: IntegerField,
        FloatField: IntegerField,

        FileField: DropzoneField,
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
            // should be undefined for uncontrolled components, not null
            data[field.name] = field.default || '';
        }
        return data;
    }

    handleFieldChange = (e, { name, value }) => {
        this.log.debug(`Setting formData field "${name}" to ${typeof value} ${JSON.stringify(value)}`);
        this.setState({
            formData: Object.assign({}, this.state.formData, {[name]: value})
        });
    };

    static pickFieldComponent(opts) {
        // opts.autocomplete points to autocomplete request but we don't care
        if (_.has(opts, 'choices')) {
            return AutocompleteChoiceField;
        }

        if (opts.type === 'ManyToManyField') {
            // opts.data can be a string or a list; string treats as a url to DataSet
            return typeof opts.data === 'string' ? AsyncManyToManyField : EmbeddedManyToManyField;
        }

        if (opts.type === 'ForeignKey') {
            // opts.data can be a string or a list; string treats as a url to DataSet
            return typeof opts.data === 'string' ? AsyncForeignKeyField : EmbeddedForeignKeyField;
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
