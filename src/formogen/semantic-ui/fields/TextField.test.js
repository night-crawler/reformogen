import TextField from './TextField';


it('should render TextField', () => {
  const wrapper = shallow(
    <TextField
      type='TextField'
      name='text_field_name'
      verbose_name='verbose name'
      help_text='help text'
      layoutOpts={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
