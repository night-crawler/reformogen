import TextField from 'formogen/components/semantic-ui/TextField';


it('should render TextField', () => {
    const wrapper = shallow(
        <TextField
            type='TextField'
            name='text_field_name'
            verbose_name='What wanna do tonight?'
            help_text="Let's shit and run at your house, dude?"
            layoutOpts={ { width: 1 } }
        />
    );
    expect(wrapper).toMatchSnapshot();
});
