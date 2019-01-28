import { formogenSagas } from 'reformogen-redux/build/saga';

import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    formogenSagas(),
  ]);
}
