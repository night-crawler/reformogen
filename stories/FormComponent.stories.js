import React from 'react';
import { text, boolean, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { withContainerSegment } from './storyDecorators';

import { CharField } from '~/formogen/semantic-ui/fields/CharField';

import { TextField } from '~/formogen/semantic-ui/fields/TextField';

import { IntegerField } from '~/formogen/semantic-ui/fields/IntegerField';

import { BooleanField } from '~/formogen/semantic-ui/fields/BooleanField';

import { DateTimeField } from '~/formogen/semantic-ui/fields/DateTimeField';

import { DateField } from '~/formogen/semantic-ui/fields/DateField';

import { TimeField } from '~/formogen/semantic-ui/fields/TimeField';

import { GenericField } from '~/formogen/semantic-ui/fields/GenericField';

import { InlineForeignKeyField } from '~/formogen/semantic-ui/fields/InlineForeignKeyField';

import { InlineManyToManyField } from '~/formogen/semantic-ui/fields/InlineManyToManyField';

import { AutocompleteChoiceField } from '~/formogen/semantic-ui/fields/AutocompleteChoiceField';

import { FormComponent } from '~/formogen/semantic-ui/FormComponent';

import { inlineFieldData, choiceFieldChoices } from './sampleData';


const stories = storiesOf('Formogen|FormComponent', module).addDecorator(withContainerSegment);

const fieldsets = [
  { 
    header: 'Generic stuff', 
    fields: [
      <CharField 
        key='1' type='CharField' name='CharField' verbose_name='CharField' editable={ true } 
        displayOptions={ { width: 4 } } 
      />,
      <IntegerField 
        key='2' type='IntegerField' name='IntegerField' verbose_name='IntegerField' editable={ true } 
        displayOptions={ { width: 4 } } 
      />,
      <BooleanField 
        key='3' type='BooleanField' name='bool-2' verbose_name='BooleanField' help_text='with toggle' editable={ true } 
        displayOptions={ { width: 4 } } widget='toggle' 
      />,
      <TextField
        key='4' type='TextField' name='TextField' verbose_name='TextField' help_text='TextField' editable={ true } 
        displayOptions={ { width: 4 } } 
      />
    ]
  },
  {
    header: 'Date & time stuff', 
    fields: [
      <DateTimeField 
        key='1' type='DateTimeField' name='DateTimeField' verbose_name='DateTimeField' help_text='DateTimeField' editable={ true } 
        displayOptions={ { width: 4 } } 
      />,
      <DateField 
        key='2' type='DateField' name='DateField' verbose_name='DateField' help_text='DateField' editable={ true } 
        displayOptions={ { width: 4 } } 
      />,
      <TimeField 
        key='3' type='TimeField' name='TimeField' verbose_name='TimeField' help_text='TimeField' editable={ true } 
        displayOptions={ { width: 4 } } 
      />,
    ]
  },
  {
    header: 'Inline stuff',
    fields: [
      <InlineForeignKeyField 
        key='1' type='InlineForeignKeyField' name='InlineForeignKeyField' verbose_name='InlineForeignKeyField' 
        help_text='InlineForeignKeyField' editable={ true }
        data={ inlineFieldData }
        displayOptions={ { width: 4 } } 
      />,
      <InlineManyToManyField 
        key='2' type='InlineManyToManyField' name='InlineManyToManyField' verbose_name='InlineManyToManyField' 
        help_text='InlineManyToManyField' editable={ true }
        data={ inlineFieldData }
        displayOptions={ { width: 4 } } 
      />,
      <AutocompleteChoiceField 
        key='3' type='AutocompleteChoiceField' name='AutocompleteChoiceField' verbose_name='AutocompleteChoiceField' 
        help_text='AutocompleteChoiceField' editable={ true }
        choices={ choiceFieldChoices }
        displayOptions={ { width: 4 } } 
      />,
    ],
  },
];


stories.add('default', () => {
  return (
    <FormComponent 
      fieldsets={ fieldsets }
      loading={ boolean('loading', false) }
    />
  );
});
