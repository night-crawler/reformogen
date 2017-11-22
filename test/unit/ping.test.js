

it('should render ping-pong', () => {
    const wrapper = shallow(
        <label>Ping? Pong!</label>
    );
    expect(wrapper).toMatchSnapshot();
});
