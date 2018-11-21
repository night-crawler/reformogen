import { AsyncForeignKeyField } from './AsyncForeignKeyField';


it('<AsyncForeignKeyField />', () => {
  const wrapper = shallow(
    <AsyncForeignKeyField
      type='AsyncForeignKeyField'
      name='AsyncForeignKeyField: name'
      verbose_name='AsyncForeignKeyField: verbose_name'
      help_text='AsyncForeignKeyField: help_text'
      layoutOpts={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
