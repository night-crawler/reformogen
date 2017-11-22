import GenericField from 'components/semantic-ui/GenericField';


it('should render GenericField', () => {
    const wrapper = shallow(
        <GenericField
            type='LOLField'
            name='something_cute'
            verbose_name='Die die die my darling'
            help_text="Don't utter a single word"
            layoutOpts={ {width: 1} }
        />
    );
    expect(wrapper).toMatchSnapshot();
});
