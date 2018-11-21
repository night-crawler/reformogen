import React from 'react';
import PropTypes from 'prop-types';
import { List, Segment, Button } from 'semantic-ui-react';

import { fileType } from './propTypes';
import { DirtyFileItem } from './DirtyFileItem';

DirtyFilesPreview.propTypes = {
  files: PropTypes.arrayOf(fileType),
  onClear: PropTypes.func,
  onDeleteFile: PropTypes.func,
};
DirtyFilesPreview.defaultProps = {
  files: [],
  onClear: () => // eslint-disable-next-line
    console.warn('DirtyFilesPreview.onClear'),
  onDeleteFile: (file, i) => // eslint-disable-next-line
    console.warn('DirtyFilesPreview.onDeleteFile', file, i),
};
export function DirtyFilesPreview(props) {
  return (
    <Segment as={ List } attached='bottom' divided={ true } relaxed={ true }>
      { props.files.map((file, i) => 
        <DirtyFileItem 
          key={ i } 
          file={ file } 
          onDelete={ () => props.onDeleteFile(file, i) } 
        />
      ) }
      <Button 
        size='mini' fluid={ true } icon='remove' 
        onClick={ props.onClear }
      />
    </Segment>
  );
}
