import { BooleanField } from './BooleanField';


it('<BooleanField />', () => {
  const wrapper = shallow(
    <BooleanField
      type='BooleanField'
      name='BooleanField: name'
      verbose_name='BooleanField: verbose_name'
      help_text='BooleanField: help_text'
      layoutOpts={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
