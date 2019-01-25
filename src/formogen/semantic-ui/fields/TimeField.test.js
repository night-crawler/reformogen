import { TimeField } from './TimeField';


it('<TimeField />', () => {
  const wrapper = shallow(
    <TimeField
      type='TimeField'
      name='TimeField: name'
      verbose_name='TimeField: verbose_name'
      help_text='TimeField: help_text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
