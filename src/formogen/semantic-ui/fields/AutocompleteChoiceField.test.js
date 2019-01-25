import { AutocompleteChoiceField } from './AutocompleteChoiceField';


it('<AutocompleteChoiceField />', () => {
  const wrapper = shallow(
    <AutocompleteChoiceField
      type='AutocompleteChoiceField'
      name='AutocompleteChoiceField: name'
      verbose_name='AutocompleteChoiceField: verbose_name'
      help_text='AutocompleteChoiceField: help_text'
      displayOptions={ { width: 1 } }
      choices={ [ [1, 'sample'] ] }
      value={ 1 }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
