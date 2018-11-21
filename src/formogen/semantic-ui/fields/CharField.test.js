import { CharField } from './CharField';


it('<CharField />', () => {
  const wrapper = shallow(
    <CharField
      type='CharField'
      name='CharField: name'
      verbose_name='CharField: verbose_name'
      help_text='CharField: help_text'
      displayOptions={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
