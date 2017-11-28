import React from 'react';

import PropTypes from 'prop-types';
import _ from 'lodash';
import loglevel from 'loglevel';

import { Header, Grid } from 'semantic-ui-react';

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
import 'react-times/css/material/default.css';
import { MessageList } from './MiscComponents';


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

        /* declare a default layout */
        layout: [{
            header: '',
            fields: '*',
            width: 16,
        }],

        djangoFieldsMap: {
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
        },
        nonFieldErrorsMap: {},
    };
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.object).isRequired,
        upperFirstLabels: PropTypes.bool,
        helpTextOnHover: PropTypes.bool,
        formData: PropTypes.object,
        locale: PropTypes.string,
        fieldUpdatePropsMap: PropTypes.object,
        layout: PropTypes.array,
        djangoFieldsMap: PropTypes.object,
        errorsFieldMap: PropTypes.object,
        nonFieldErrorsMap: PropTypes.object,  /* {title: [errors]} */
    };

    constructor(props) {
        super(props);

        this.log = loglevel.getLogger('FormFieldsComponent.jsx');
        this.log.debug('Initialized');

        this.state = {
            fieldPropsByNameMap: {},

            formData: props.formData,
            djangoFieldsMap: props.djangoFieldsMap,

            fields: props.fields,
            layoutTemplate: props.layout,
            layout: [],

            nonFieldErrorsMap: props.nonFieldErrorsMap,
        };
    }

    // --------------- React.js standard ---------------
    componentWillMount() {
        this.log.warn('componentWillMount()');

        this.setState(FormFieldsComponent.computeRuntimeState(this.state));
    }
    componentWillReceiveProps({ fields, formData, nonFieldErrorsMap }) {
        this.log.warn('componentWillReceiveProps()');

        const { layoutTemplate } = this.state;
        const state = Object.assign(
            {},
            FormFieldsComponent.computeRuntimeState({ layoutTemplate, formData, fields }),
            { nonFieldErrorsMap }
        );
        this.setState(state);
    }

    static updateFormDataWithDefaults(fields, formData) {
        let data = Object.assign({}, formData);
        for (let field of fields) {
            if (field.name in data) {
                continue;
            }
            // should be undefined for uncontrolled components, not null
            data[field.name] = field.default || '';

            // DRF expects M2M values as an list (empty or not), so empty string is not acceptable here
            if (!data[field.name] && field.type === 'ManyToManyField')
                data[field.name] = [];
        }
        return data;
    }
    /**
     * Pure static method to compute a new layout
     * @param {Array} layoutTemplate - raw layout with wildcard catch-all pattern
     * @param fieldPropsByNameMap - {field: field properties} mapping
     * @returns {object} new layout
     */
    static unfoldWildcardFields(layoutTemplate, fieldPropsByNameMap) {
        let _ldLayout = _(_(layoutTemplate).cloneDeep());

        let usedFields = _ldLayout.map('fields')
            .flatten()
            .map((fieldObj) => {  /* object first key is field name or object itself */
                return _.isString(fieldObj) ? fieldObj : _.keys(fieldObj)[0];
            })
            .without('*');  /* we don't take wildcard as a field */

        let allFieldNames = _(fieldPropsByNameMap).keys();

        _ldLayout.find({'fields': '*'})['fields'] = allFieldNames.difference(usedFields.value()).value();
        return _ldLayout.value();
    }
    /**
     * @param {Object[]} initialState
     * @param {Array} initialState.layoutTemplate -
     * @param {Array} initialState.fields -
     * @param {Object} initialState.formData -
     * @returns {{fieldPropsByNameMap: Object, formData: Object, layout: Object}}
     */
    static computeRuntimeState(initialState) {
        const { fields, formData, layoutTemplate } = initialState;

        const fieldPropsByNameMap = _(fields).map((fieldData) => {
            return [fieldData.name, fieldData];
        }).fromPairs().value();

        return {
            fieldPropsByNameMap,
            formData: FormFieldsComponent.updateFormDataWithDefaults(fields, formData),
            layout: FormFieldsComponent.unfoldWildcardFields(layoutTemplate, fieldPropsByNameMap),
            fields,
        };
    }

    // --------------- miscellaneous methods ---------------
    getFormData() {
        const { fieldPropsByNameMap } = this.state;

        // split data and file fields
        let dataFields = {}, fileFields = {};
        for (let [fieldName, fieldValue] of Object.entries(this.state.formData)) {
            // user can pass into formData a key (fieldName) that is not present in metaData (props.fields)
            let fieldProps = fieldPropsByNameMap[fieldName];
            if (!fieldProps) {
                const warnPresentKeys = JSON.stringify(_.keys(fieldPropsByNameMap), null, 4);
                this.log.warn(`Field "${ fieldName }": "${ fieldValue }" is present in formData,` +
                                   `but is not present in metaData fields: ${ warnPresentKeys }`);
                dataFields[fieldName] = fieldValue;
                continue;
            }
            if (fieldProps.type === 'FileField') {
                fileFields[fieldName] = fieldValue;
            } else {
                dataFields[fieldName] = fieldValue;
            }
        }
        return {
            data: dataFields,
            files: fileFields
        };
    }
    handleFieldChange = (e, { name, value }) => {
        this.log.debug(`Setting formData field "${ name }" to ${ typeof value } ${ JSON.stringify(value) }`);

        this.setState({
            formData: Object.assign({}, this.state.formData, {[name]: value})
        });
    };
    pickFieldComponent(opts) {
        // opts.autocomplete points to autocomplete request but we don't care
        if (_.has(opts, 'choices')) {
            return AutocompleteChoiceField;
        }

        if (opts.type === 'ManyToManyField') {
            // opts.data can be a string or a list; string treats as a url to DataSet
            return _.isString(opts.data) ? AsyncManyToManyField : EmbeddedManyToManyField;
        }

        if (opts.type === 'ForeignKey') {
            // opts.data can be a string or a list; string treats as a url to DataSet
            return _.isString(opts.data) ? AsyncForeignKeyField : EmbeddedForeignKeyField;
        }

        return this.state.djangoFieldsMap[opts.type] || GenericField;
    }

    // --------------- render methods ---------------
    renderLayouts() {
        const { layout, fieldPropsByNameMap } = this.state;

        return layout.map(({ header, fields, width }, i) => {
            /* fields: ['field1', 'field2'] || [{field1: {...opts}}, 'field42'] */

            // render all fields in layout section
            const renderedFields = fields.map((fieldObj, j) => {
                /* fieldObj may be a string representing field name or object with first key as a field name,
                 * if we need to provide more options */
                /* layoutFieldOpts take a default width from layout section */
                let fieldName, layoutFieldOpts = { width };
                if (_.isString(fieldObj)) {
                    fieldName = fieldObj;
                } else {
                    fieldName = _.keys(fieldObj).pop();
                    layoutFieldOpts = Object.assign(layoutFieldOpts, fieldObj[fieldName]);
                }

                let fieldProps = fieldPropsByNameMap[fieldName];
                if (!fieldProps){
                    return null;
                }
                return this.renderField(j, fieldProps, layoutFieldOpts);
            });

            return (
                <Grid columns={ 16 } key={ i } className='layout'>
                    { header && <div className='sixteen wide column'><Header>{ header }</Header></div> }
                    { renderedFields }
                </Grid>
            );

        }) || null;
    }
    renderField(i, opts, layoutOpts) {
        const Field = this.pickFieldComponent(opts);

        return (
            <Field
                key={ i }
                value={ this.state.formData[opts.name] }
                onChange={ this.handleFieldChange }
                errors={ this.props.errorsFieldMap[opts.name] }
                updateProps={ this.props.fieldUpdatePropsMap[opts.name] }
                upperFirstLabel={ this.props.upperFirstLabels }
                helpTextOnHover={ this.props.helpTextOnHover }
                locale={ this.props.locale }

                layoutOpts={ layoutOpts }

                { ...opts }
            />
        );
    }
    renderNonFieldErrors() {
        if (_.isEmpty(this.state.nonFieldErrorsMap)) return null;

        const renderedMsgs = _(this.state.nonFieldErrorsMap).toPairs().value().map(([title, errors], i) =>
            <Grid.Row  key={ i }>
                <div className='sixteen wide column'>
                    <MessageList header={ title } messages={ errors } />
                </div>
            </Grid.Row>
        );
        return <Grid className='non-field-errors layout' columns={ 16 }>{ renderedMsgs }</Grid>;
    }

    // --------------- React.js render ---------------
    render() {
        return (
            <div className='layouts'>
                { this.renderNonFieldErrors() }
                { this.renderLayouts() }
            </div>
        );
    }
}
