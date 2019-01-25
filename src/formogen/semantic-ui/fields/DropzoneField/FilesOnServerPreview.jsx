import React from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';
import { List, Segment } from 'semantic-ui-react';

import { FileOnServerItem } from './FileOnServerItem';


FilesOnServerPreview.propTypes = {
  isRemovable: PropTypes.bool,
  files: PropTypes.any,
  onDeleteFile: PropTypes.func,
};
FilesOnServerPreview.defaultProps = {
  isRemovable: false,
  files: [],
  onDeleteFile: (fileUrl) => // eslint-disable-next-line
    console.warn('FilesOnServerPreview.onDeleteFile', fileUrl),
};
export function FilesOnServerPreview(props) {
  // TODO: it looks like a pipe dream, there's no way for multiple files to be stored in one field
  const files = isArray(props.files) 
    ? props.files 
    : [ props.files ];

  return (
    <Segment as={ List } attached='bottom' divided={ true } relaxed={ true }>
      { files.map((fileUrl, i) => 
        <FileOnServerItem 
          key={ i } 
          fileUrl={ fileUrl } 
          isRemovable={ props.isRemovable }
          onDelete={ props.onDeleteFile }  
        />
      ) }
    </Segment>
  );
}
