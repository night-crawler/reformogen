import { AsyncManyToManyField } from './AsyncManyToManyField';


it('<AsyncManyToManyField />', () => {
  const wrapper = shallow(
    <AsyncManyToManyField
      type='AsyncManyToManyField'
      name='AsyncManyToManyField: name'
      verbose_name='AsyncManyToManyField: verbose_name'
      help_text='AsyncManyToManyField: help_text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
