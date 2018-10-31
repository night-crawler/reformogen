import React from 'react';
import PropTypes from 'prop-types';


CaptionTruncatorComponent.displayName = 'CaptionTruncator';
CaptionTruncatorComponent.propTypes = {
  caption: PropTypes.string,
  width: PropTypes.number,
};
export function CaptionTruncatorComponent({ caption, width = 0 }) {
  const inlineStyles = {
    display: 'inline-block',
    maxWidth: width,
    textShadow: '0 0 1px white',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  };

  return <span style={ inlineStyles }>{ caption }</span>;
}
