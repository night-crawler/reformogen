import PropTypes from 'prop-types';

export const locationShape = {
  hash: PropTypes.string.isRequired,
  key: PropTypes.string, // only in createBrowserHistory and createMemoryHistory
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  state: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
  ]), // only in createBrowserHistory and createMemoryHistory
};
export const locationType = PropTypes.shape(locationShape);

export const historyShape = {
  action: PropTypes.oneOf(['PUSH', 'REPLACE', 'POP']).isRequired,
  block: PropTypes.func.isRequired,
  canGo: PropTypes.func, // only in createMemoryHistory
  createHref: PropTypes.func.isRequired,
  entries: PropTypes.arrayOf(location), // only in createMemoryHistory
  go: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  index: PropTypes.number, // only in createMemoryHistory
  length: PropTypes.number,
  listen: PropTypes.func.isRequired,
  location: location.isRequired,
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
};
export const historyType = PropTypes.shape(historyShape);


export const matchShape = {
  isExact: PropTypes.bool,
  params: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};
export const matchType = PropTypes.shape(matchShape);


const routeShape = {
  path: PropTypes.string,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  sensitive: PropTypes.bool,
  component: PropTypes.func,
};
routeShape.routes = PropTypes.arrayOf(PropTypes.shape(routeShape));
export const routeType = PropTypes.shape(routeShape);
