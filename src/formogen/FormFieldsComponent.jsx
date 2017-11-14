import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import loglevel from 'loglevel';

import {
    GenericFieldComponent,
    ChoiceFieldComponent,
    CharFieldComponent,
    TextFieldComponent,
    PositiveSmallIntegerFieldComponent,
    AutocompleteChoiceFieldComponent,
    DateTimeFieldComponent
} from './FieldComponents';


export default class FormFieldsComponent extends React.Component {
    static defaultProps = {
        fields: [],
        upperFirstLabels: false,
        formData: {},
        locale: 'en',
        helpTextOnHover: false,
    };

    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.object).isRequired,
        upperFirstLabels: PropTypes.bool,
        helpTextOnHover: PropTypes.bool,
        formData: PropTypes.object,
        locale: PropTypes.string,
    };

    static djangoFieldMap = {
        CharField: CharFieldComponent,
        TextField: TextFieldComponent,
        DateTimeField: DateTimeFieldComponent,
        PositiveSmallIntegerField: PositiveSmallIntegerFieldComponent
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
        this.log.debug(`Setting formData field "${name}" to "${value}"`);
        this.setState({
            formData: Object.assign({}, this.state.formData, {[name]: value})
        });
    };

    static pickFieldComponent(opts) {
        if (_.has(opts, 'choices')) {
            if (_.get(opts, 'autocomplete', false)) {
                return AutocompleteChoiceFieldComponent;
            } else {
                return ChoiceFieldComponent;
            }
        }
        return FormFieldsComponent.djangoFieldMap[opts.type] || GenericFieldComponent;
    }

    renderField(i, opts) {
        const FieldComponent = FormFieldsComponent.pickFieldComponent(opts);
        return (
            <FieldComponent
                key={ i }
                value={ this.state.formData[opts.name] }
                onChange={ this.handleFieldChange }
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
