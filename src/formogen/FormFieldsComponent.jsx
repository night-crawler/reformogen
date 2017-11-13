import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';


import {
    ChoiceFieldComponent, CharFieldComponent,
    TextFieldComponent, PositiveSmallIntegerFieldComponent,
    AutocompleteChoiceFieldComponent, DateTimeFieldComponent
} from './FieldComponents';


export default class FormFieldsComponent extends React.Component {
    static defaultProps = {
        fields: [],
        upperFirstLabels: false
    };

    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.object).isRequired,
        upperFirstLabels: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            fields: props.fields,
        };
    }

    handleFieldChange = (e, { name, value }) => {
        console.log(name, value);
        // this.setState({ [name]: value });
    };

    renderField(i, opts) {
        if (_.has(opts, 'choices')) {
            if (_.get(opts, 'autocomplete', false)) {
                return <AutocompleteChoiceFieldComponent
                    key={ i }
                    onChange={ this.handleFieldChange }
                    upperFirstLabel={ this.props.upperFirstLabels }
                    { ...opts }
                />;
            } else {
                return <ChoiceFieldComponent
                    key={ i }
                    onChange={ this.handleFieldChange }
                    upperFirstLabel={ this.props.upperFirstLabels }
                    { ...opts }
                />;
            }
        }

        switch (opts.type) {
            case 'CharField':
                return <CharFieldComponent
                    key={ i }
                    onChange={ this.handleFieldChange }
                    upperFirstLabel={ this.props.upperFirstLabels }
                    { ...opts }
                />;

            case 'TextField':
                return <TextFieldComponent
                    key={ i }
                    onChange={ this.handleFieldChange }
                    upperFirstLabel={ this.props.upperFirstLabels }
                    { ...opts }
                />;

            case 'PositiveSmallIntegerField':
                return <PositiveSmallIntegerFieldComponent
                    key={ i }
                    onChange={ this.handleFieldChange }
                    upperFirstLabel={ this.props.upperFirstLabels }
                    { ...opts }
                />;

            case 'DateTimeField':
                return <DateTimeFieldComponent
                    key={ i }
                    onChange={ this.handleFieldChange }
                    upperFirstLabel={ this.props.upperFirstLabels }
                    { ...opts }
                />;

            default:
                return <div key={ i }>{ opts.type }</div>;
        }
    }

    render() {
        const { fields } = this.state;

        const formFields = fields.map( (field, i) => this.renderField(i, field) );

        return <div>{ formFields }</div>;
    }
}
