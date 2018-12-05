import { DirtyFilesPreview } from './DirtyFilesPreview';

it('<DirtyFilesPreview />', () => {
  const wrapper = shallow(
    <DirtyFilesPreview
    />
  );
  expect(wrapper).toMatchSnapshot();
});
