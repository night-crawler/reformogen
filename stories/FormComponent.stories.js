import React from 'react';
import { text, boolean, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ContainerSegmentDecorator } from './storyDecorators';

import { CharField } from '~/formogen/semantic-ui/fields/CharField';

import { IntegerField } from '~/formogen/semantic-ui/fields/IntegerField';

import { BooleanField } from '~/formogen/semantic-ui/fields/BooleanField';

import { DateTimeField } from '~/formogen/semantic-ui/fields/DateTimeField';

import { GenericField } from '~/formogen/semantic-ui/fields/GenericField';

import { InlineForeignKeyField } from '~/formogen/semantic-ui/fields/InlineForeignKeyField';

import { InlineManyToManyField } from '~/formogen/semantic-ui/fields/InlineManyToManyField';

import { FormComponent } from '~/formogen/semantic-ui/FormComponent';


const stories = storiesOf('Form|FormComponent', module).addDecorator(ContainerSegmentDecorator);

const formLayout = [
  { 
    header: 'Generic stuff', 
    fields: [
      <CharField key='1' name='charField' verbose_name='CharField' editable={ true } type='CharField' layoutOpts={ { width: 4 } } />,
      <IntegerField key='2' name='integerField' verbose_name='IntegerField' editable={ true } type='IntegerField' layoutOpts={ { width: 4 } } />,
      <BooleanField key='3' name='bool-1' verbose_name='BooleanField' editable={ true } type='BooleanField' layoutOpts={ { width: 4 } } />,
      <BooleanField key='4' name='bool-2' help_text='with toggle' widget='toggle' verbose_name='BooleanField' editable={ true } type='BooleanField' layoutOpts={ { width: 4 } } />,
      <GenericField key='4' name='generic-1'  widget='toggle' verbose_name='BooleanField' editable={ true } type='BooleanField' layoutOpts={ { width: 4 } } />,
    ]
  },
  {
    header: 'Date & time stuff', 
    fields: [
      <DateTimeField key='1' name='DateTimeField' verbose_name='DateTimeField' editable={ true } type='DateTimeField' layoutOpts={ { width: 4 } } />,
    ]
  }
];


stories.add('default', () => {
  return (
    <FormComponent 
      formLayout={ formLayout }
    />
  );
});
