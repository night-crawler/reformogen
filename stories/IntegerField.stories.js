import React from 'react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { IntegerField } from '~/formogen/semantic-ui/fields/IntegerField';

import { FormDecorator } from './FormDecorator';
import { errorArray } from './ErrorMessages.sample';


const stories = storiesOf('Fields|IntegerField', module).addDecorator(FormDecorator);


stories.add('default', () => {
  return (
    <IntegerField 
      type='IntegerField'
      placeholder={ text('placeholder', 'some placeholder') }
      editable={ boolean('editable', true) }
      help_text={ text('help_text', 'some help text') }
      name={ text('name', 'integer') }
      verbose_name={ text('verbose_name', 'verbose name of the field') }
      layoutOpts={ { width: number('layoutOpts.width', 4, { range: true, min: 1, max: 16 }) } }
      onChange={ action('onChange') }
      value={ number('value', 11) }
      errors={ errorArray }
    />
  );
});

