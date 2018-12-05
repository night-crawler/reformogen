import { CaptionTruncator } from './CaptionTruncator';


it('<TextField />', () => {
  const wrapper = shallow(
    <CaptionTruncator
      caption='1'
      width={ 2 }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
