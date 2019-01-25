import PropTypes from 'prop-types';


export const fileShape = {
  lastModified: PropTypes.number,
  lastModifiedDate: PropTypes.object,
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  type: PropTypes.string,
};

export const fileType = PropTypes.shape(fileShape);
