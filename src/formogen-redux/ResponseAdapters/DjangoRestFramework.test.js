import { DjangoRestFrameworkResponseAdapter } from './DjangoRestFramework';

const adapter = new DjangoRestFrameworkResponseAdapter({
  'page_size': 10,
  'num_pages': 3,
  'count': 23,
  'next': 'http://localhost:8000/api/v1/sample/authors/?page=2',
  'previous': null,
  'results': [1, 2, 3],
});

describe('DjangoRestFrameworkResponseAdapter', () => {
  it('totalItems()', () => {
    expect(adapter.totalItems).toBeTruthy(23);
  });
  it('totalPages()', () => {
    expect(adapter.totalPages).toEqual(3);
  });
  it('nextPageUrl()', () => {
    expect(adapter.nextPageUrl).toEqual('http://localhost:8000/api/v1/sample/authors/?page=2');
  });
  it('previousPageUrl()', () => {
    expect(adapter.previousPageUrl).toEqual(null);
  });
  it('hasNextPage()', () => {
    expect(adapter.hasNextPage).toEqual(true);
  });
  it('hasPreviousPage()', () => {
    expect(adapter.hasPreviousPage).toEqual(false);
  });
  it('previousPageNumber()', () => {
    expect(adapter.previousPageNumber).toEqual(null);
  });
  it('nextPageNumber()', () => {
    expect(adapter.nextPageNumber).toEqual(2);
  });
  it('currentPageNumber()', () => {
    expect(adapter.currentPageNumber).toEqual(1);
  });
  it('list()', () => {
    expect(adapter.list).toEqual([ 1, 2, 3 ]);
  });
  it('perPageQueryParam()', () => {
    expect(adapter.perPageQueryParam).toEqual('page_size');
  });
  it('pageQueryParam()', () => {
    expect(adapter.pageQueryParam).toEqual('page');
  });
  it('maxPageSize()', () => {
    expect(adapter.maxPageSize).toEqual(300);
  });
  it('defaultPageSize()', () => {
    expect(adapter.defaultPageSize).toEqual(10);
  });
});
