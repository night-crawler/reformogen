import { responseAdapterRegistry } from './ResponseAdapters';
import { executeRequest, singleApiCall } from './apiHelpers';
import { 
  FETCH_FORM_METADATA, FETCH_FORM_METADATA_SUCCESS, FETCH_FORM_METADATA_ERROR,
  FETCH_FORM_DATA, FETCH_FORM_DATA_SUCCESS, FETCH_FORM_DATA_ERROR,

  FETCH_NEXT_FIELD_OPTIONS, FETCH_NEXT_FIELD_OPTIONS_SUCCESS, FETCH_NEXT_FIELD_OPTIONS_ERROR,
} from './constants';


export const fetchFormMetadata = singleApiCall({
  method: requestOpts => executeRequest(requestOpts),
  types: [ FETCH_FORM_METADATA, FETCH_FORM_METADATA_SUCCESS, FETCH_FORM_METADATA_ERROR ],
});


export const fetchFormData = singleApiCall({
  method: requestOpts => executeRequest(requestOpts),
  types: [ FETCH_FORM_DATA, FETCH_FORM_DATA_SUCCESS, FETCH_FORM_DATA_ERROR, ],
});


export const searchDataFieldOptions = singleApiCall({
  processResponse: ({ response, payload: { url } }) => {
    const Adapter = responseAdapterRegistry.resolveAdapter(url);
    return new Adapter(response.body);
  },
  method: ({ url, page, searchText }) => executeRequest({ 
    url, 
    query: { page, q: searchText } 
  }),
  types: [ 
    FETCH_NEXT_FIELD_OPTIONS, 
    FETCH_NEXT_FIELD_OPTIONS_SUCCESS, 
    FETCH_NEXT_FIELD_OPTIONS_ERROR, 
  ],
});
