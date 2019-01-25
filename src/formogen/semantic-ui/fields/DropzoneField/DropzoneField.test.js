import { DropzoneField } from './DropzoneField';


it('<DropzoneField />', () => {
  const onChangeFn = jest.fn();
  const wrapper = shallow(
    <DropzoneField
      type='DropzoneField'
      name='DropzoneField: name'
      verbose_name='DropzoneField: verbose_name'
      help_text='DropzoneField: help_text'
      displayOptions={ { width: 1 } }
      onChange={ onChangeFn }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
