import { isString } from 'lodash';

class Registry {
  patternToAdapterMapping = {};
  register(urlPattern, adapter) {
    isString(urlPattern) || throw new Error(`urlPattern must be a string, ${typeof urlPattern} was given`);
    urlPattern || throw new Error('urlPattern must be a non-empty string');

    this.patternToAdapterMapping[urlPattern] = adapter;
  }

}

export const responseAdapterRegistry = new Registry();

export class BaseResponseAdapter {
  constructor(responseObject) {
    this.responseObject = responseObject;
  }

  get totalItems() { throw new Error('Not implemented'); }
  get totalPages() { throw new Error('Not implemented'); }

  get nextPageUrl() { throw new Error('Not implemented'); }
  get previousPageUrl() { throw new Error('Not implemented'); }

  get hasNextPage() { throw new Error('Not implemented'); }
  get hasPreviousPage() { throw new Error('Not implemented'); }
  
  get previousPageNumber() { throw new Error('Not implemented'); }
  get nextPageNumber() { throw new Error('Not implemented'); }
  get currentPageNumber() { throw new Error('Not implemented'); }
  
  get list() { throw new Error('Not implemented'); }

  get perPageQueryParam() { throw new Error('Not implemented'); }
  get pageQueryParam() { throw new Error('Not implemented'); }
  get maxPageSize() { throw new Error('Not implemented'); }
  get defaultPageSize() { throw new Error('Not implemented'); }
}


export class DRFResponseAdapter extends BaseResponseAdapter {
  
}
