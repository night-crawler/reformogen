import { InlineForeignKeyField } from './InlineForeignKeyField';


it('<InlineForeignKeyField />', () => {
  const wrapper = shallow(
    <InlineForeignKeyField
      type='InlineForeignKeyField'
      name='InlineForeignKeyField: name'
      verbose_name='InlineForeignKeyField: verbose_name'
      help_text='InlineForeignKeyField: help_text'
      layoutOpts={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
