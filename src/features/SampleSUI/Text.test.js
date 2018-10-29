/* eslint-disable react/react-in-jsx-scope,no-undef */
import { Text } from './Text';

describe('<Text />', () => {
  it('should render Text component', () => {
    const wrapper = shallow(
      <Text data='test' uuid='uuid' />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
