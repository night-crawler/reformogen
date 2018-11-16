import React from 'react';
import PropTypes from 'prop-types';


CaptionTruncator.displayName = 'CaptionTruncator';
CaptionTruncator.propTypes = {
  caption: PropTypes.any,
  width: PropTypes.any,
};
export function CaptionTruncator({ caption, width = 0 }) {
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
