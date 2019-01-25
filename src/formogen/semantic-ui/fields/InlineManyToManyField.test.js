import { InlineManyToManyField } from './InlineManyToManyField';


it('<InlineManyToManyField />', () => {
  const wrapper = shallow(
    <InlineManyToManyField
      type='InlineManyToManyField'
      name='InlineManyToManyField: name'
      verbose_name='InlineManyToManyField: verbose_name'
      help_text='InlineManyToManyField: help_text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
