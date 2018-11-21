import { NonFieldErrorsList } from './NonFieldErrorsList';


it('<NonFieldErrorsList />', () => {
  const wrapper = shallow(
    <NonFieldErrorsList
      errors={ {
        'header': ['error1', 'error2']
      } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
