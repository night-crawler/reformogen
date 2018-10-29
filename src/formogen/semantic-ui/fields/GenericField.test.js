import GenericField from './GenericField';


it('should render GenericField', () => {
  const wrapper = shallow(
    <GenericField
      type='GenericField'
      name='GenericField: name'
      verbose_name='GenericField: verbose_name'
      help_text='GenericField: help_text'
      layoutOpts={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
