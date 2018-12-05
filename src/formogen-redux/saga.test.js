import { cloneableGenerator } from 'redux-saga/utils';
import { all, put, select } from 'redux-saga/effects';


import * as selectors from './selectors';
import { bootstrap, initializeRelatedFieldOptions } from './saga';
import * as actions from './actions';
import * as api from './api';
import * as apiHelpers from './apiHelpers';

// eslint-disable-next-line
apiHelpers.processError = jest.fn((...args) => args);
// eslint-disable-next-line
api.fetchFormMetadata = jest.fn((...args) => args);
// eslint-disable-next-line
api.fetchFormData = jest.fn((...args) => args);


describe('saga', () => {
  it('should bootstrap', () => {
    const payload = {  // nothing else but ownProps
      formId: 'FORMID',
      locale: 'en',
    };
    const meta = {
      formId: 'FORMID',
    };

    const gen = cloneableGenerator(bootstrap)({ payload, meta });

    expect(gen.next().value).toEqual(
      all([
        select(selectors.describeUrl, payload),
        select(selectors.objectUrl, payload),
      ])
    );

    expect(gen.next([ 
      'http://sample.test/describe/', 
      'http://sample.test/object/111/' 
    ]).value).toEqual(
      put(actions.storeFormLocale(payload))
    );

    gen.next('whocares');

    expect(api.fetchFormData).toHaveBeenCalledWith({
      meta: { formId: 'FORMID' },
      payload: {
        locale: 'en',
        url: 'http://sample.test/object/111/'
      }
    });

    expect(api.fetchFormMetadata).toHaveBeenCalledWith({
      meta: { formId: 'FORMID' }, 
      payload: {
        locale: 'en', 
        url: 'http://sample.test/describe/'
      }
    });

    
    const errorHandlerGen = gen.clone();
    errorHandlerGen.next([
      { error: 1 },
      { error: 1 }
    ]);
    expect(apiHelpers.processError).toHaveBeenCalled();

    expect(gen.next([ { value: 1 }, { value: 1 } ]).value).toEqual(
      initializeRelatedFieldOptions('FORMID')
    );

    expect(gen.next('who cares').value).toEqual(
      put(actions.bootstrapSuccess('FORMID'))
    );

    expect(gen.next('who cares').value).toEqual(true);

  });
});
