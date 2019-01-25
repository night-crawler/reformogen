import { Button } from 'semantic-ui-react';

import { DirtyFileItem } from './DirtyFileItem';

const file = {
  lastModified: 1,
  lastModifiedDate: {},
  name: 'sample.png',
  size: 1000,
  type: 'application/trash-x',
};


it('<DirtyFileItem />', () => {
  const onDeleteFn = jest.fn();
  const wrapper = shallow(
    <DirtyFileItem
      file={ file }
      onDelete={ onDeleteFn }
    />
  );
  expect(wrapper).toMatchSnapshot();
  
  wrapper.find(Button).simulate('click');
  expect(onDeleteFn).toHaveBeenCalled();
});
