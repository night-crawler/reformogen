import { AsyncForeignKeyField } from './AsyncForeignKeyField';


it('<AsyncForeignKeyField />', () => {
  const wrapper = shallow(
    <AsyncForeignKeyField
      type='AsyncForeignKeyField'
      name='AsyncForeignKeyField: name'
      verbose_name='AsyncForeignKeyField: verbose_name'
      help_text='AsyncForeignKeyField: help_text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
