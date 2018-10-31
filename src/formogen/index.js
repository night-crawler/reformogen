import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import loglevel from 'loglevel';

import {
  fields as semanticUIFields,
  common as semanticUICommon
} from './semantic-ui';
import WithSelectState from './higherOrderComponents';

const defaultFieldComponentMap = {
  // Django's
  CharField: semanticUIFields.CharField,
  TextField: semanticUIFields.TextField,

  DateTimeField: semanticUIFields.DateTimeField,
  DateField: semanticUIFields.DateField,
  TimeField: semanticUIFields.TimeField,

  PositiveSmallIntegerField: semanticUIFields.IntegerField,
  SmallIntegerField: semanticUIFields.IntegerField,
  IntegerField: semanticUIFields.IntegerField,
  PositiveIntegerField: semanticUIFields.IntegerField,
  DecimalField: semanticUIFields.IntegerField,
  FloatField: semanticUIFields.IntegerField,

  FileField: semanticUIFields.DropzoneField,
  BooleanField: semanticUIFields.BooleanField,

  ChoiceField: semanticUIFields.AutocompleteChoiceField,

  ForeignKey: semanticUIFields.ForeignKeyField,  // TODO: WTF? Why without *Field
  ManyToManyField: semanticUIFields.ManyToManyField,

  // special
  AsyncForeignKey: WithSelectState({ WrappedComponent: semanticUIFields.AsyncForeignKeyField, multi: false }),
  AsyncManyToManyField: WithSelectState({ WrappedComponent: semanticUIFields.AsyncManyToManyField, multi: true }),

  GenericField: semanticUIFields.GenericField,
};


export default class FormogenFormComponent extends React.Component {
  static propTypes = {
    formId: PropTypes.string.isRequired,

    /* misc */
    loading: PropTypes.bool,

    locale: PropTypes.string,
    showHeader: PropTypes.bool,
    upperFirstLabels: PropTypes.bool,
    helpTextOnHover: PropTypes.bool,

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
    modalProps: PropTypes.object,

    /* view redefinition opts */
    layoutTemplate: PropTypes.array,
    fieldUpdatePropsMap: PropTypes.object,

    /* on actions */
    onFieldChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onNetworkError: PropTypes.func,

    /* components */
    fieldComponentMap: PropTypes.object,

    formComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
      PropTypes.instanceOf(React.Component)
    ]),
    submitComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
      PropTypes.instanceOf(React.Component)
    ]),

    modalFormComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
      PropTypes.instanceOf(React.Component)
    ]),
    modalFormTriggerComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
      PropTypes.instanceOf(React.Component)
    ]),
  };
  static defaultProps = {
    /* misc */
    locale: 'en',
    upperFirstLabels: false,
    helpTextOnHover: false,

    /* metadata */
    fields: [],

    /* formdata */
    formData: {},

    /* modal opts */
    showAsModal: false,

    /* view redefinition opts */
    layoutTemplate: [{  /* declare a default layout template */
      title: '',
      fields: '*',
      width: 16,
    }],
    fieldUpdatePropsMap: {},

    /* components */
    fieldComponentMap: defaultFieldComponentMap,

    formComponent: semanticUICommon.Form,

    modalFormComponent: semanticUICommon.ModalForm,
  };

  // --------------- constructor ---------------
  constructor(props) {
    super(props);

    this.log = loglevel.getLogger(`FormogenFormComponent[${props.formId}]`);
    this.log.debug('Initialized');

    this.state = {
      fields: props.fields,
    };
  }

  // --------------- React.js standard ---------------
  componentWillMount() {
    this.log.debug('componentWillMount()');
    this.computeNewState(this.state.fields, this.state.formData, this.props.layoutTemplate);
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

  static pickFieldComponent(fieldsMap, { type, choices = null, data }) {
    let fieldName = type;

    // opts.autocomplete points to autocomplete request but we don't care
    if (!_.isNull(choices))
      fieldName = 'ChoiceField';

    // opts.data can be a string or a list; string treats as a url to DataSet
    if (['ForeignKey', 'ManyToManyField'].includes(type))
      fieldName = _.isString(data) ? `Async${type}` : type;

    if(!fieldsMap[fieldName])
      fieldName = 'GenericField';

    return fieldsMap[fieldName];
  }

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
  buildLayout() {
    this.log.debug('renderLayout()');

    return this.state.layout.map(({ header, fields, width }) => {
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

        let fieldProps = this.state.fieldPropsByNameMap[fieldName];
        if (!fieldProps)
          return null;

        return this.renderField(j, fieldProps, layoutFieldOpts);
      });

      return { header, fields: renderedFields };
    }) || null;
  }
  renderField(i, opts, layoutOpts) {
    const FieldComponent = FormogenFormComponent.pickFieldComponent(this.props.fieldComponentMap, opts);

    this.log.debug(`renderField(${i}, ${opts.name}, ${opts.type} as ${FieldComponent.name})`);

    return (
      <FieldComponent
        key={ `field:${i}` }

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

  // --------------- React.js render ---------------
  render() {
    this.log.debug(`render(), render as ${ this.props.showAsModal ? 'modal' : 'embedded' }`);

    const {
      formComponent: FormComponent,

      modalFormComponent: ModalFormComponent,
      submitComponent: SubmitComponent,

      modalFormTriggerComponent: ModalFormTriggerComponent,
    } = this.props;

    if (this.props.showAsModal)
      return (
        <ModalFormComponent
          loading={ this.props.loading }

          title={ this.props.title }
          showTitle={ this.props.showHeader }

          formLayout={ this.buildLayout() }
          nonFieldErrorsMap={ this.props.nonFieldErrorsMap }
          onSubmit={ this.props.onSubmit }

          triggerComponent={ ModalFormTriggerComponent }
          formComponent={ FormComponent }
        />
      );

    return (
      <FormComponent
        loading={ this.props.loading }

        title={ this.props.title }
        showTitle={ this.props.showHeader }

        formLayout={ this.buildLayout() }
        nonFieldErrorsMap={ this.props.nonFieldErrorsMap }

        submitComponent={ SubmitComponent }
        onSubmit={ this.props.onSubmit }
      />
    );
  }
}

export const __version__ = '0.1.2';
