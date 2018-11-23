import React from 'react';
import PropTypes from 'prop-types';
import { List, Image, Button } from 'semantic-ui-react';

import { splitExt } from '../../../utils';
import { fileTypeImageMapping, UNKNOWN_FILE_TYPE } from '../../../fileTypeImageMapping';



FileOnServerItem.propTypes = {
  fileUrl: PropTypes.string,
  getPreviewImage: PropTypes.func,
  onDelete: PropTypes.func,
  isRemovable: PropTypes.bool,
};
FileOnServerItem.defaultProps = {
  getPreviewImage: fileUrl => 
    fileTypeImageMapping[ splitExt(fileUrl)[1] ] || UNKNOWN_FILE_TYPE,
  onDelete: () => // eslint-disable-next-line
    console.warn('FileOnServerItem.onDelete'),
};
export function FileOnServerItem(props) {
  const fileName = props.fileUrl.split('/').pop();

  // TODO: watermelon come here, motherfucker!
  return (
    <List.Item>
      <Image 
        src={ props.getPreviewImage(props.fileUrl) } 
        verticalAlign='middle' size='mini'
      />
      <a href={ props.fileUrl }>{ fileName }</a>
      
      { props.isRemovable && <Button 
        as='a'
        icon='remove' 
        size='mini' 
        attached='right' 
        floated='right' 
        onClick={ props.onDelete }
      /> }
    </List.Item>
  );
}
