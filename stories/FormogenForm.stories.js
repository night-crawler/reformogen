import React from 'react';
import { storiesOf } from '@storybook/react';

import { FormogenForm } from '~/formogen/FormogenForm';

import * as sui from '~/formogen/semantic-ui';

import { withContainerSegment, withStore } from './storyDecorators';
import { fullPossibleMetadata } from './sampleData';

const stories = storiesOf('Formogen|FormogenForm', module)
  .addDecorator(withStore)
  .addDecorator(withContainerSegment);

stories.add('all metaData', () => {
  return (
    <FormogenForm 
      formId='bla'
      metaData={ fullPossibleMetadata }  
      getFieldComponent={ sui.getFieldComponentForType }
      getFormComponent={ () => sui.FormComponent }

      actions={ {
        bootstrap: () => {}
      } }
    />
  );
});
