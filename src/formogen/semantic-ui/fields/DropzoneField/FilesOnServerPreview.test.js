import { FilesOnServerPreview } from './FilesOnServerPreview';

it('<FilesOnServerPreview />', () => {
  const wrapper = shallow(
    <FilesOnServerPreview
      files={ [ 'https://domain.tld/1.png' ] }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
