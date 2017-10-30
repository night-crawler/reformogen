import React from 'react';

import _ from 'lodash';

import 'semantic-ui-css/semantic.css';  // TODO: сoncretize it

import { ChoiceFieldComponent, CharFieldComponent,
         TextFieldComponent, PositiveSmallIntegerFieldComponent } from './FieldComponents';


export default class FormFieldsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fields: props.fields,
        };
    }

    static renderField(i, opts) {
        if (_.has(opts, 'choices')) {
            return <ChoiceFieldComponent key={ i } { ...opts } />;
        }

        switch (opts.type) {
            case 'CharField':
                return <CharFieldComponent key={ i } { ...opts } />;

            case 'TextField':
                return <TextFieldComponent key={ i } { ...opts } />;

            case 'PositiveSmallIntegerField':
                return <PositiveSmallIntegerFieldComponent key={ i } { ...opts } />;

            default:
                return <div key={ i }>{ opts.type }</div>;
        }
    }

    render() {
        const { fields } = this.state;

        const formFields = fields.map( (field, i) => FormFieldsComponent.renderField(i, field) );

        return <div>{ formFields }</div>;
    }
}

FormFieldsComponent.defaultProps = {
    fields: [],
};
