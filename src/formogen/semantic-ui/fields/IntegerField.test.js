import { IntegerField } from './IntegerField';


it('<IntegerField />', () => {
  const wrapper = shallow(
    <IntegerField
      type='IntegerField'
      name='IntegerField: name'
      verbose_name='IntegerField: verbose_name'
      help_text='IntegerField: help_text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
