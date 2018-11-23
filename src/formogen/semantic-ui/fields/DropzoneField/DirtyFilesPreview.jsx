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
  if (!props.files?.length)
    return null;

  return (
    <Segment as={ List } attached='bottom' divided={ true } relaxed={ true } style={ { marginBottom: 0 } }>
      { props.files.map((file, i) => 
        <DirtyFileItem 
          key={ i } 
          file={ file } 
          onDelete={ () => props.onDeleteFile(file, i) } 
        />
      ) }

      { props.files.length >= 2 && <Button 
        // WARNING: using a regular button here (without as) makes this button 
        // clicked each time before the submit action
        as='a'
        tabIndex='-1'
        size='mini' fluid={ true } icon='remove' 
        onClick={ props.onClear }
      /> }
    </Segment>
  );
}
