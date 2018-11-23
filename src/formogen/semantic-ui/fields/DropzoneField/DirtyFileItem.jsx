import React from 'react';
import PropTypes from 'prop-types';
import { List, Image, Button } from 'semantic-ui-react';

import { splitExt, bytesToSize } from '../../../utils';
import { fileTypeImageMapping, UNKNOWN_FILE_TYPE } from '../../../fileTypeImageMapping';
import { CaptionTruncator } from '../../CaptionTruncator';

import { fileType } from './propTypes';


DirtyFileItem.propTypes = {
  file: fileType,
  getPreviewImage: PropTypes.func,
  onDelete: PropTypes.func,
};
DirtyFileItem.defaultProps = {
  getPreviewImage: file => 
    fileTypeImageMapping[ splitExt(file.name)[1] ] || UNKNOWN_FILE_TYPE,
  onDelete: () => // eslint-disable-next-line
    console.warn('DirtyFileItem.onDelete'),
};
export function DirtyFileItem(props) {
  const [ fileName, fileExt ] = splitExt(props.file.name);
  const sizeRepr = `[${bytesToSize(props.file.size)}]`;

  // TODO: watermelon come here, motherfucker!
  return (
    <List.Item>
      <Image 
        src={ props.getPreviewImage(props.file) } 
        verticalAlign='middle' size='mini'
      />

      <List.Content style={ { width: '100%' } }>
        <strong>{ sizeRepr }&nbsp;</strong>
        <CaptionTruncator caption={ fileName } width='50%' />
        <span>.{ fileExt }</span>
      </List.Content>

      <Button 
        as='a'
        icon='remove' size='mini' attached='right' floated='right' 
        onClick={ props.onDelete }
      />
    </List.Item>
  );
}
