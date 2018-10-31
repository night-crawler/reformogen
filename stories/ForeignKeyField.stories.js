import React from 'react';
import { text, boolean, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { InlineForeignKeyField } from '~/formogen/semantic-ui/fields/InlineForeignKeyField';

import { FormDecorator } from './FormDecorator';
import { errorArray } from './ErrorMessages.sample';

const stories = storiesOf('Fields|ForeignKeyField', module).addDecorator(FormDecorator);


const inlineForeignKeyFieldData = [
  { id: 1, name: 'sample1' },
  { id: 2, name: 'sample2' },
  { id: 3, name: 'sample3' },
  { id: 4, name: 'sample4' },
];

stories.add('InlineForeignKeyField', () => {
  return (
    <InlineForeignKeyField 
      type='InlineForeignKeyField'
      placeholder={ text('placeholder', 'some placeholder') }
      editable={ boolean('editable', true) }
      help_text={ text('help_text', 'some help text') }
      name={ text('name', 'inlineForeignKeyField') }
      verbose_name={ text('verbose_name', 'verbose name of the field') }
      layoutOpts={ { width: number('layoutOpts.width', 4, { range: true, min: 1, max: 16 }) } }
      onChange={ action('onChange') }
      errors={ errorArray }
      data={ inlineForeignKeyFieldData }
    />
  );
});
