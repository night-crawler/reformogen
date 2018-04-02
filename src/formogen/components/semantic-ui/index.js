import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import loglevel from 'loglevel';

import { Button, Form, Grid, Header } from 'semantic-ui-react';

// Field imports
import GenericField from './GenericField';

import BooleanField from './BooleanField';

import CharField from './CharField';
import TextField from './TextField';

import AutocompleteChoiceField from './AutocompleteChoiceField';

import EmbeddedManyToManyField from './InlineManyToManyField';
import EmbeddedForeignKeyField from './InlineForeignKeyField';

import AsyncForeignKeyField from './AsyncForeignKeyField';
import AsyncManyToManyField from './AsyncManyToManyField';

import IntegerField from './IntegerField';

import DateTimeField from './DateTimeField';
import DateField from './DateField';
import TimeField from './TimeField';

import DropzoneField from './DropzoneField';

// Misc helper components
import Modal from './Modal';
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
    BooleanField,
};

export default class FormogenFormComponent extends React.Component {
    static defaultProps = {
        /* misc */
        locale: 'en',
        upperFirstLabels: false,
        helpTextOnHover: false,

        /* field map redefinition */
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
            BooleanField,
        },

        /* metadata */
        fields: [],

        /* formdata */
        formData: {},

        /* modal opts */
        showAsModal: false,
        modalComponent: Modal,

        /* view redefinition opts */
        formComponent: Form,
        submitComponent: Button,

        layoutTemplate: [{  /* declare a default layout template */
            header: '',
            fields: '*',
            width: 16,
        }],
        fieldUpdatePropsMap: {},
    };
    static propTypes = {
        formId: PropTypes.string.isRequired,

        /* misc */
        loading: PropTypes.bool,

        locale: PropTypes.string,
        showHeader: PropTypes.bool,
        upperFirstLabels: PropTypes.bool,
        helpTextOnHover: PropTypes.bool,

        /* field map redefinition */
        djangoFieldsMap: PropTypes.object,

        /* metadata */
        title: PropTypes.string,
        fields: PropTypes.arrayOf(PropTypes.object).isRequired,

        /* formdata */
        formData: PropTypes.object,

        /* errors */
        errorsFieldMap: PropTypes.object,
        nonFieldErrorsMap: PropTypes.object,  /* {title: [errors]} */

        /* represents file progress */
        formFilesUploadProgress: PropTypes.object,

        /* modal opts */
        showAsModal: PropTypes.bool,
        modalComponent: PropTypes.element,
        modalTriggerComponent: PropTypes.element,
        modalProps: PropTypes.object,

        /* view redefinition opts */
        formComponent: PropTypes.element,
        submitComponent: PropTypes.element,

        layoutTemplate: PropTypes.array,
        fieldUpdatePropsMap: PropTypes.object,

        /* on actions */
        onFieldChange: PropTypes.func,
        onSubmit: PropTypes.func,
        onNetworkError: PropTypes.func,
    };

    // --------------- constructor ---------------
    constructor(props) {
        super(props);

        this.log = loglevel.getLogger(`FormogenFormComponent[${props.formId}]`);
        this.log.debug('Initialized');

        this.state = {
            djangoFieldsMap: props.djangoFieldsMap,
            fields: props.fields,
        };
    }

    // --------------- React.js standard ---------------
    componentWillMount() {
        this.log.debug('componentWillMount()');

        const { fields, formData } = this.state;
        this.computeNewState(fields, formData, this.props.layoutTemplate);
    }
    componentWillReceiveProps({ fields, formData, layoutTemplate }) {
        this.log.debug('componentWillReceiveProps()');

        this.computeNewState(fields, formData, layoutTemplate);
    }

    // --------------- miscellaneous methods ---------------
    computeNewState(fields, formData, layoutTemplate) {
        this.log.debug('computeNewState()');

        const fieldPropsByNameMap = _(fields).map((fieldOpts) => [fieldOpts.name, fieldOpts]).fromPairs().value();
        const layout = FormogenFormComponent.unfoldWildcardFields(layoutTemplate, fieldPropsByNameMap);

        this.setState({ fields, fieldPropsByNameMap, layout });
    }

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

        const field = this.state.djangoFieldsMap[opts.type] || GenericField;
        return field;
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

    // --------------- render methods ---------------
    renderLayout() {
        this.log.debug('renderLayout()');

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
                if (!fieldProps) {
                    return null;
                }
                return this.renderField('field:' + j, fieldProps, layoutFieldOpts);
            });

            return (
                <Grid columns={ 16 } key={ 'grid:' + i } className='layout'>
                    { header && <div className='sixteen wide column'><Header>{ header }</Header></div> }
                    { renderedFields }
                </Grid>
            );

        }) || null;
    }
    renderField(i, opts, layoutOpts) {
        const Field = this.pickFieldComponent(opts);

        this.log.debug(`renderField(${i}, ${opts.name}, ${opts.type} as ${Field.name})`);

        return (
            <Field
                key={ i }
                locale={ this.props.locale }
                upperFirstLabel={ this.props.upperFirstLabels }
                helpTextOnHover={ this.props.helpTextOnHover }

                value={ this.props.formData[opts.name] }

                onChange={ this.props.onFieldChange }
                onNetworkError={ this.props.onNetworkError }

                errors={ this.props.errorsFieldMap[opts.name] }

                updateProps={ this.props.fieldUpdatePropsMap[opts.name] }
                layoutOpts={ layoutOpts }

                { ...opts }

                formFilesUploadProgress={ this.props.formFilesUploadProgress[opts.name] }
            />
        );
    }
    renderNonFieldErrors() {
        this.log.debug('renderNonFieldErrors()');

        if (_.isEmpty(this.props.nonFieldErrorsMap)) return null;

        const renderedMsgs = _(this.props.nonFieldErrorsMap).toPairs().value().map(([title, errors], i) =>
            <Grid.Row key={ i }>
                <div className='sixteen wide column'>
                    <MessageList header={ title } messages={ errors } />
                </div>
            </Grid.Row>
        );
        return <Grid className='non-field-errors layout' columns={ 16 }>{ renderedMsgs }</Grid>;
    }

    renderAsModal() {
        this.log.debug('renderAsModal()');

        const {
            loading,
            showHeader,
            title,

            submitComponent: SubmitComponent,
            formComponent: FormComponent,

            modalComponent: ModalComponent,
            modalTriggerComponent: ModalTriggerComponent,
            modalProps,

            onSubmit
        } = this.props;

        return (
            <ModalComponent
                trigger={ ModalTriggerComponent ? ModalTriggerComponent : <Button content='show modal' /> }
                header={ showHeader ? <Header as='h2'>{ title }</Header> : null }
                actions={
                    <SubmitComponent
                        type='submit'
                        content={ 'Submit' }

                        onClick={ onSubmit }
                        onKeyPress={ onSubmit }
                    />
                }
                modalProps={ modalProps }
            >
                <FormComponent loading={ loading }>
                    <div className='layouts'>
                        { this.renderNonFieldErrors() }
                        { this.renderLayout() }
                    </div>
                </FormComponent>
            </ModalComponent>
        );
    }
    renderAsEmbedded() {
        this.log.debug('renderAsEmbedded()');

        const {
            loading,
            showHeader,
            title,

            submitComponent: SubmitComponent,
            formComponent: FormComponent,

            onSubmit
        } = this.props;

        return (
            <FormComponent loading={ loading }>
                { showHeader ? <Header as='h2' dividing={ true }>{ title }</Header> : null }

                <div className='layouts'>
                    { this.renderNonFieldErrors() }
                    { this.renderLayout() }
                </div>

                <SubmitComponent
                    type='submit'
                    content={ 'Submit' }
                    fluid={ true }

                    onClick={ onSubmit }
                    onKeyPress={ onSubmit }
                />
            </FormComponent>
        );
    }

    // --------------- React.js render ---------------
    render() {
        this.log.debug('render()');

        const { showAsModal } = this.props;

        if (showAsModal)
            return this.renderAsModal();

        return this.renderAsEmbedded();
    }
}
