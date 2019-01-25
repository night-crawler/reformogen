import { AsyncRelatedField } from './AsyncRelatedField';


describe('<AsyncRelatedField />', () => {
  const loadOptions = jest.fn();

  const wrapper = shallow(
    <AsyncRelatedField
      formId={ 'FORMID' }
      data={ 'https://its-some-url.tld/' }
      type='AsyncRelatedField'
      name='AsyncRelatedField: name'
      verbose_name='AsyncRelatedField: verbose_name'
      help_text='AsyncRelatedField: help_text'
      displayOptions={ { width: 1 } }
      loadOptions={ loadOptions }
    />
  );
  it('renders without errors', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should handleMenuClose', () => {
    wrapper.instance().handleMenuClose();
    expect(wrapper.state()).toMatchObject({
      search: '',
      menuIsOpen: false,
      isLoading: false,
    });
  });

  it('should handleMenuOpen', async () => {
    await wrapper.instance().handleMenuOpen();
    expect(wrapper.state()).toMatchObject({ menuIsOpen: true });
    expect(loadOptions).toHaveBeenCalled();
  });

  it('should handleInputChange', async () => {
    await wrapper.instance().handleInputChange('');
    await wrapper.instance().handleInputChange('');
    expect(wrapper.state()).toMatchObject({
      menuIsOpen: true,
      isLoading: true,
    });
    expect(loadOptions).toHaveBeenCalled();

    const callBundle = loadOptions.mock.calls[loadOptions.mock.calls.length - 1][0];
    await callBundle.callback();

    expect(wrapper.state()).toMatchObject({
      menuIsOpen: true,
      isLoading: false,
    });
  });
});



