import React from 'react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { TextField } from '~/formogen/semantic-ui/fields/TextField';

import { FormDecorator } from './FormDecorator';
import { errorArray } from './ErrorMessages.sample';

const stories = storiesOf('Fields|TextField', module).addDecorator(FormDecorator);


stories.add('default', () => {
  return (
    <TextField 
      type='TextField'
      placeholder={ text('placeholder', 'some placeholder') }
      editable={ boolean('editable', true) }
      help_text={ text('help_text', 'some help text') }
      name={ text('name', 'text') }
      verbose_name={ text('verbose_name', 'verbose name of the field') }
      layoutOpts={ { width: number('layoutOpts.width', 4, { range: true, min: 1, max: 16 }) } }
      onChange={ action('onChange') }
      value={ text('value', 'some text') }
      errors={ errorArray }
    />
  );
});

