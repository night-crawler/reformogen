import IntegerField from 'formogen/components/semantic-ui/IntegerField';


it('should render IntegerField', () => {
    const wrapper = shallow(
        <IntegerField
            type='IntegerField'
            name='integer_field_name'
            verbose_name='Check out that fantastically horny slut!'
            help_text='You pop instanlty?! Huh?'
            layoutOpts={ { width: 1 } }
        />
    );
    expect(wrapper).toMatchSnapshot();
});
