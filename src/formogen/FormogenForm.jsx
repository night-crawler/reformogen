import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { keyBy } from 'lodash';

import { unfoldWildcardFieldsets } from './utils';

export class FormogenForm extends Component {
  static propTypes = {
    formId: PropTypes.string.isRequired,

    loading: PropTypes.bool,
    locale: PropTypes.string,
    showHeader: PropTypes.bool,
    upperFirstLabels: PropTypes.bool,
    helpTextOnHover: PropTypes.bool,

    /** form description */
    metaData: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      fields: PropTypes.arrayOf(PropTypes.object),
    }),

    fieldsets: PropTypes.arrayOf(PropTypes.shape({
      header: PropTypes.string,
      fields: PropTypes.arrayOf(PropTypes.string),
      getDisplayOptions: PropTypes.func,
    })),

    /* formdata */
    formData: PropTypes.object,
    errorsFieldMap: PropTypes.object,

    actions: PropTypes.shape({
      bootstrap: PropTypes.func,
    }),

    getFieldComponent: PropTypes.func.isRequired,
    getFormComponent: PropTypes.func.isRequired,
  };
  static defaultProps = {
    errorsFieldMap: {},
    formId: 'formogen-form-1',

    fieldsets: [
      {
        header: null,
        fields: ['*'],
        getDisplayOptions: () => ({ width: 16 })
      }
    ],
    metaData: {
      title: null,
      description: null,
      fields: [],
    }
  };

  render() {
    const FormComponent = this.props.getFormComponent();

    return (
      <FormComponent 
        formId={ this.formId } 
        loading={ this.props.loading } 
        title={ this.props.title }
        isTitleVisible={ this.props.isTitleVisible }
        submitComponent={ this.props.submitComponent }
        key={ `FormComponent-${this.props.formId}` }  
        formLayout={ this.renderFieldsets() }
      />
    );
  }

  renderFieldsets() {
    const fieldsets = unfoldWildcardFieldsets(
      this.props.metaData.fields, 
      this.props.fieldsets
    );
    const fieldOptsByNameMap = keyBy(this.props.metaData.fields, 'name');

    return fieldsets.map(({ header, fields, getDisplayOptions }) => {
      const renderedFields = fields.map(fieldName => this.renderField(
        this.props.getFieldComponent(fieldOptsByNameMap[fieldName]), 
        fieldOptsByNameMap[fieldName],
        getDisplayOptions(fieldName)
      ));
      
      return { header, fields: renderedFields };
    });
  }

  renderField(FieldComponent, opts, displayOptions) {
    const mergedOpts = {
      key: `Form:${this.props.formId}-${opts.type}-${opts.name}`,
      formId: this.props.formId,
      locale: this.props.locale,
      upperFirstLabel: this.props.upperFirstLabels,
      helpTextOnHover: this.props.helpTextOnHover,

      // TODO: get rid of `layout` name
      layoutOpts: displayOptions,
      errors: this.props.errorsFieldMap[opts.name],
      ...opts,
    };

    return <FieldComponent { ...mergedOpts } />;
  }

  componentDidMount = () => {
    this.props.actions.bootstrap();
  }
}
