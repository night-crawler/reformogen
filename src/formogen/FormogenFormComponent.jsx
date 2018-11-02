import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as suiFields from './semantic-ui/fields';


const defaultFieldComponentMap = {
  CharField: suiFields.CharField,
  TextField: suiFields.TextField,

  DateTimeField: suiFields.DateTimeField,
  DateField: suiFields.DateField,
  TimeField: suiFields.TimeField,

  PositiveSmallIntegerField: suiFields.IntegerField,
  SmallIntegerField: suiFields.IntegerField,
  IntegerField: suiFields.IntegerField,
  PositiveIntegerField: suiFields.IntegerField,
  DecimalField: suiFields.IntegerField,
  FloatField: suiFields.IntegerField,

  // FileField: suiFields.DropzoneField,
  BooleanField: suiFields.BooleanField,

  ChoiceField: suiFields.AutocompleteChoiceField,

  GenericField: suiFields.GenericField,
};

export class FormogenFormComponent extends Component {
  static propTypes = {
    formId: PropTypes.string.isRequired,

    loading: PropTypes.bool,
    locale: PropTypes.string,
    showHeader: PropTypes.bool,
    upperFirstLabels: PropTypes.bool,
    helpTextOnHover: PropTypes.bool,

    onFieldChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onNetworkError: PropTypes.func,
  };

  render() {
    return (
      <div>
        
      </div>
    );
  }
}
