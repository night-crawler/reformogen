import { BaseResponseAdapter } from './base';


export class DjangoRestFrameworkResponseAdapter extends BaseResponseAdapter {
  get totalItems() { return this.responseObject.count; }
  get totalPages() { return this.responseObject.num_pages; }

  get nextPageUrl() {  return this.responseObject.next; }
  get previousPageUrl() { return this.responseObject.previous; }

  get hasNextPage() { return !!this.responseObject.next; }
  get hasPreviousPage() { return !!this.responseObject.previous; }
  
  get previousPageNumber() { 
    if (!this.hasPreviousPage)
      return null;

    return BaseResponseAdapter.getQueryObject(
      this.responseObject.previous
    )[this.pageQueryParam];
  }
  get nextPageNumber() { 
    if (!this.hasNextPage)
      return null;

    return BaseResponseAdapter.getQueryObject(
      this.responseObject.next
    )[this.pageQueryParam];
  }
  get currentPageNumber() { 
    throw new Error('Not implemented'); 
  }
  
  get list() { return this.responseObject.results; }

  get perPageQueryParam() { return 'page_size'; }
  get pageQueryParam() { return 'page'; }
  get maxPageSize() { return this.responseObject.max_page_size || 300; }
  get defaultPageSize() { return this.responseObject.page_size || 10; }
}
