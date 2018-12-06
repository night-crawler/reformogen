import { pick } from 'lodash';

import { splitExt, bytesToSize, unfoldWildcardFieldsets } from './utils';

describe('formogen/utils', () => {
  describe('splitExt', () => {
    it('should split extension', () => expect(
      splitExt('http://domain.tld/some.file.mp3')
    ).toEqual(['http://domain.tld/some.file', 'mp3']));

    it('should split empty extension', () => expect(
      splitExt('file')
    ).toEqual(['file', '']));
  });


  describe('bytesToSize', () => {
    it('should return proper 0 display', () => expect(
      bytesToSize(0)
    ).toEqual('-'));

    it('should doStuff', () => expect(
      bytesToSize(1000000000000000)
    ).toEqual('909.5 TB'));
  });


  describe('unfoldWildcardFieldsets', () => {
    const getDisplayOptionsFn = () => 0;

    const metaDataFields = [
      { name: 'author' },
      { name: 'title' },
      { name: 'score' },
    ];

    it('should handle empty values', () => expect(
      unfoldWildcardFieldsets()
    ).toEqual([]));

    
    it('should handle default usage scenario', () => expect(
      unfoldWildcardFieldsets(
        metaDataFields,
        [
          {
            header: null,
            fields: ['*'],
            getDisplayOptions: getDisplayOptionsFn
          }
        ]
      )
    ).toEqual([
      {
        fields: [ 'author', 'title', 'score' ],
        getDisplayOptions: getDisplayOptionsFn,
        header: null
      }
    ]));

    it('should handle broken fieldsets with repeated fields', () => expect(() =>
      unfoldWildcardFieldsets(
        metaDataFields, 
        [
          { fields: ['*'] },
          { fields: ['*'] }
        ]
      )
    ).toThrowError());

    it('should handle multiple field sets', () => expect(
      unfoldWildcardFieldsets(
        metaDataFields, 
        [
          { header: '1', fields: ['author'] },
          { header: '2', fields: ['title'] },
          { header: '3', fields: ['*'] },
        ]
      )
    ).toMatchObject([  // * it skips getDisplayOptions
      { fields: ['author'], header: '1' }, 
      { fields: ['title'], header: '2' }, 
      { fields: ['score'], header: '3' }
    ]));

    it('should provide default getDisplayOptions', () => expect(
      unfoldWildcardFieldsets(
        metaDataFields, 
        [ { fields: ['*'] } ]
      )[0].getDisplayOptions()
    ).toBeTruthy());

    it('should raise on malformed fieldset without fields specified', () => expect(() =>
      unfoldWildcardFieldsets(
        metaDataFields, 
        [ { } ]
      )
    ).toThrowError());

  });
  
  
});
