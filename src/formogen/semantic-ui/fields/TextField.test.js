import { TextField } from './TextField';


it('<TextField />', () => {
  const wrapper = shallow(
    <TextField
      type='TextField'
      name='text_field_name'
      verbose_name='verbose name'
      help_text='help text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
