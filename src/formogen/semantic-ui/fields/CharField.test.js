import { CharField } from './CharField';


it('should render CharField', () => {
  const wrapper = shallow(
    <CharField
      type='CharField'
      name='CharField: name'
      verbose_name='CharField: verbose_name'
      help_text='CharField: help_text'
      layoutOpts={ { width: 1 } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
