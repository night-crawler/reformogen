import { FormComponent } from './FormComponent';


it('<FormComponent />', () => {
  const wrapper = shallow(
    <FormComponent
      loading={ true }
      title={ 'sample' }
      isTitleVisible={ true }
      formLayout={ [] }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
