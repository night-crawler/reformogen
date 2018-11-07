import request from 'superagent';
import { delay } from 'redux-saga';

import { call, put, select } from 'redux-saga/effects';

import { IS_PRODUCTION, RETRY_COUNT, RETRY_TIMEOUT } from '../constants';

import { APIError } from './errors';

export class BaseApi {
  constructor({ 
    isProduction = IS_PRODUCTION, 
    rootUrl = '', 
    timeout = { response: 10000, deadline: 20000 },
    retryCount = RETRY_COUNT,
    retryTimeout = RETRY_TIMEOUT,
    retryStatusCodes = [ undefined, 524, 504, 502, 408 ],
    redirects = 0,
  } = {}) {
    this.isProduction = isProduction;
    this.rootUrl = rootUrl;
    this.timeout = timeout;
    this.redirects = redirects;
    this.retryCount = retryCount;
    this.retryTimeout = retryTimeout;
    this.retryStatusCodes = retryStatusCodes;
  }

  applyWrappers({ requestObject }) {
    let req = requestObject
      .timeout(this.timeout)
      .redirects(this.redirects);
      
    if (!this.isProduction) {
      req = req.withCredentials();
    }
    return req;
  }

  prepareRequest({ 
    method='get',
    url,
    query={}, 
    headers={}
  }) {
    const requestObject = request[method](url)
      .query(query)
      .set(headers);
    
    return this.applyWrappers({ requestObject });
  }

  *getRuntimeHeaders() {
    // TODO: ?
    yield 0;
    return { 
      Accept: 'application/json' 
    };
  }

  *executeRequest({ retryCount=this.retryCount, ...opts }) {
    const errors = [];
    const runtimeHeaders = yield this.getRuntimeHeaders();

    for (let retryAttempt=0; retryAttempt < retryCount; retryAttempt++) {
      try {
        const response = yield this.prepareRequest({ ...opts, headers: runtimeHeaders });
        return response;
      } catch(e) {
        if (!this.retryStatusCodes.includes(e.status))
          throw e;

        // TODO: add action type later
        put({ type: 'NETWORK_ISSUE', payload: { retryAttempt, opts } });

        errors.push(e);
        yield call(delay, this.retryTimeout); 
      }
    }
    throw new APIError(opts, errors, this.retryCount);
  }
}
