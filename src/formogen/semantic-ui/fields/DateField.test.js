import { DateField } from './DateField';


it('<DateField />', () => {
  const wrapper = shallow(
    <DateField
      type='DateField'
      name='DateField: name'
      verbose_name='DateField: verbose_name'
      help_text='DateField: help_text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
