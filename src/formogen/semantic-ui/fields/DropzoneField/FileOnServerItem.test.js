import { FileOnServerItem } from './FileOnServerItem';

it('<FileOnServerItem />', () => {
  const wrapper = shallow(
    <FileOnServerItem
      fileUrl='http://sample.tld/1/2/3'
      isRemovable={ true }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
