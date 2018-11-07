import { BaseApi } from './base';

/**
 * NOTE: keep in mind and plan method arguments the way they might receive action's payload as the first argument.
 */
export class FormogenApi extends BaseApi {
  describe = ({ subUrl, options }={}) => {
    return this.executeRequest({ 
      method: 'get',
      subUrl: subUrl,
      ...options
    });
  }
}
