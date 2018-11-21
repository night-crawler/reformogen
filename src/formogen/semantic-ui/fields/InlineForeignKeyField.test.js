import { InlineForeignKeyField } from './InlineForeignKeyField';


it('<InlineForeignKeyField />', () => {
  const wrapper = shallow(
    <InlineForeignKeyField
      type='InlineForeignKeyField'
      name='InlineForeignKeyField: name'
      verbose_name='InlineForeignKeyField: verbose_name'
      help_text='InlineForeignKeyField: help_text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
