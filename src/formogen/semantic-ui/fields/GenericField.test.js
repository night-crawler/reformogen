import { GenericField } from './GenericField';


it('<GenericField />', () => {
  const wrapper = shallow(
    <GenericField
      type='GenericField'
      name='GenericField: name'
      verbose_name='GenericField: verbose_name'
      help_text='GenericField: help_text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
