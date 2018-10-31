import React from 'react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { AutocompleteChoiceField } from '~/formogen/semantic-ui/fields/AutocompleteChoiceField';

import { FormDecorator } from './FormDecorator';
import { errorArray } from './ErrorMessages.sample';

const stories = storiesOf('Fields|AutocompleteChoiceField', module).addDecorator(FormDecorator);

const sampleChoices = [
  [ 0, 'dead' ],
  [ 255, 'alive' ],
  [ 30, 'dried' ]
];


stories.add('default', () => {
  return (
    <AutocompleteChoiceField 
      type='AutocompleteChoiceField'
      placeholder={ text('placeholder', 'some placeholder') }
      editable={ boolean('editable', true) }
      help_text={ text('help_text', 'some help text') }
      name={ text('name', 'autocompleteChoiceField') }
      verbose_name={ text('verbose_name', 'verbose name of the field') }
      layoutOpts={ { width: number('layoutOpts.width', 4, { range: true, min: 1, max: 16 }) } }
      onChange={ action('onChange') }
      choices={ sampleChoices }
      errors={ errorArray }
    />
  );
});
