import { ErrorsList } from './ErrorsList';


it('<ErrorsList />', () => {
  const wrapper = shallow(
    <ErrorsList
      header={ 'test' }
      messages={ ['test1', 'test2'] }
      color='green'
    />
  );
  expect(wrapper).toMatchSnapshot();
});
