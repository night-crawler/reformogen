import React from 'react';
import { storiesOf } from '@storybook/react';
import { Grid, GridColumn } from 'semantic-ui-react';

import { FormogenForm } from '~/formogen-redux/FormogenForm';

import { FormComponent } from '~/formogen/semantic-ui/FormComponent';

import { withContainerSegment, withStore, dispatch } from './storyDecorators';

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
      'blank': false,
      'null': false,
      'editable': true,
      'max_length': 255,
      'type': 'CharField',
      'required': true
    },
  ]
};

dispatch(storeFormMetaData('form-1', metaData));
dispatch(storeFormMetaData('form-2', metaData));


stories.add('2 redux forms on page', () => 
  <Grid columns='2'>
    <GridColumn>
      <FormogenForm 
        isTitleVisible={ true }
        formId='form-1'
        getFormComponent={ () => FormComponent }
        getFieldComponent={ getFieldComponentForType }
      />
    </GridColumn>
    <GridColumn>
      <FormogenForm 
        isTitleVisible={ true }
        formId='form-2'
        getFormComponent={ () => FormComponent }
        getFieldComponent={ getFieldComponentForType }
      />
    </GridColumn>
  </Grid>
);
