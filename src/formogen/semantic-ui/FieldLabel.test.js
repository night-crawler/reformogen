import { FieldLabel } from './FieldLabel';


it('<FieldLabel />', () => {
  const wrapper = shallow(
    <FieldLabel
      type='Label'
      name='Label: name'
      verbose_name='Label: verbose_name'
      help_text='Label: help_text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
