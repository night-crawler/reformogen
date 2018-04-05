import Label from 'formogen/components/semantic-ui-fields/Label';


it('should render Label', () => {
    const wrapper = shallow(
        <Label
            type='Label'
            name='label_name'
            verbose_name='She always begins solemnly'
            help_text='If she goes on behaving this way she ends up being a whore!'
            layoutOpts={ { width: 1 } }
        />
    );
    expect(wrapper).toMatchSnapshot();
});
