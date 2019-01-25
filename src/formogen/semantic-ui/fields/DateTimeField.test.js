import { DateTimeField } from './DateTimeField';


it('<DateTimeField />', () => {
  const wrapper = shallow(
    <DateTimeField
      type='DateTimeField'
      name='DateTimeField: name'
      verbose_name='DateTimeField: verbose_name'
      help_text='DateTimeField: help_text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
