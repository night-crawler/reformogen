import { FormComponent } from './FormComponent';


it('<FormComponent />', () => {
  const wrapper = shallow(
    <FormComponent
      loading={ true }
      title={ 'sample' }
      isTitleVisible={ true }
      fieldsets={ [] }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
