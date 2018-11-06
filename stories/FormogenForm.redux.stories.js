import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { FormogenForm } from '~/formogen-redux/FormogenForm';

import { FormComponent } from '~/formogen/semantic-ui/FormComponent';

import { withContainerSegment, withStore, dispatch } from './storyDecorators';
// import { fullPossibleMetadata } from './sampleData';

import { getFieldComponentForType } from '~/formogen-redux/semantic-ui';

import { storeFormData, storeFormMetaData } from '~/formogen-redux/actions';

const stories = storiesOf('redux|FormogenForm', module)
  .addDecorator(withStore)
  .addDecorator(withContainerSegment);


const metaData = {
  'title': 'Create AllModelFields',
  'description': 'bla',
  'fields': [
    {
      'name': 'field1',
      'verbose_name': 'char field',
      'help_text': 'charfield',
      'blank': false,
      'null': false,
      'editable': true,
      'max_length': 255,
      'type': 'CharField',
      'required': true
    },
    {
      'name': 'field2',
      'verbose_name': 'char field',
      'help_text': 'charfield',
      'blank': false,
      'null': false,
      'editable': true,
      'max_length': 255,
      'type': 'CharField',
      'required': true
    },
  ]
};

dispatch(storeFormMetaData('bla', metaData));


stories.add('default', () => {
  return (
    <FormogenForm 
      formId='bla'
      getFormComponent={ () => FormComponent }
      getFieldComponent={ getFieldComponentForType }
    />
  );
});
