import { all } from 'redux-saga/effects';

import { formogenSagas } from '~/formogen-redux/saga';


export default function* rootSaga() {
  yield all([
    formogenSagas(),
  ]);
}
