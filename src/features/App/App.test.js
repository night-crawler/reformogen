
import { App } from './App';

it('renders without crashing', () => {
  const wrapper = shallow(<App />).dive();
  expect(wrapper).toMatchSnapshot();
});
