import CharField from 'formogen/components/semantic-ui-fields/CharField';


it('should render CharField', () => {
    const wrapper = shallow(
        <CharField
            type='CharField'
            name='char_field_name'
            verbose_name="I've corkscrewed her twice for the last night!"
            help_text='Really?'
            layoutOpts={ { width: 1 } }
        />
    );
    expect(wrapper).toMatchSnapshot();
});
