import Label from 'formogen/semantic-ui/common/Label';


it('should render Label', () => {
    const wrapper = shallow(
        <Label
            type='Label'
            name='Label: name'
            verbose_name='Label: verbose_name'
            help_text='Label: help_text'
            layoutOpts={ { width: 1 } }
        />
    );
    expect(wrapper).toMatchSnapshot();
});
