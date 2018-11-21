import { AsyncRelatedField } from './AsyncRelatedField';


it('<AsyncRelatedField />', () => {
  const wrapper = shallow(
    <AsyncRelatedField
      type='AsyncRelatedField'
      name='AsyncRelatedField: name'
      verbose_name='AsyncRelatedField: verbose_name'
      help_text='AsyncRelatedField: help_text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
