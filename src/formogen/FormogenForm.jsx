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

export class FormogenForm extends Component {
  static propTypes = {
    getFormId: PropTypes.func,

    loading: PropTypes.bool,
    locale: PropTypes.string,
    showHeader: PropTypes.bool,
    upperFirstLabels: PropTypes.bool,
    helpTextOnHover: PropTypes.bool,

    /** a mapping of FieldType to FieldComponent: { BooleanField: <BooleanFieldClass> }  */
    componentMap: PropTypes.object,

    /** form description */
    metaData: PropTypes.arrayOf(PropTypes.object).isRequired,

    /* formdata */
    formData: PropTypes.object,

    actions: PropTypes.shape({
      bootstrap: PropTypes.func,
    }),
  };
  static defaultProps = {
    componentMap: defaultFieldComponentMap,
    getFormId: props => {}
  };

  render() {
    return (
      <div>
        
      </div>
    );
  }

  componentDidMount = () => {
    this.props.actions.bootstrap();
  }
}
