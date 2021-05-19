import { combineReducers, Reducer } from "redux";
import apiCallSaga from "./sagas/apiCallSaga";
import globalSaga from "./sagas/globalSaga";
import monitorSaga from "./sagas/monitorSaga";
import pastInquirySaga from "./sagas/pastInquirySaga";
import { fork, all } from "redux-saga/effects";
import rootReducer from "./reducer/rootReducer";
import monitorReducer from "./reducer/monitorReducer";
import pastInquiryReducer from "./reducer/pastInquiryReducer";
import { FakeDataModal } from "./models/actionModel";

export interface RootState {
  // add models
  root: FakeDataModal;
}

export const createRootReducer = (): Reducer<any> =>
  combineReducers({
    root: rootReducer,
    monitorReducer,
    pastInquiryReducer,
  });

export function* rootSaga(): Generator {
  yield all([
    ...globalSaga,
    ...monitorSaga,
    pastInquirySaga,
    fork(apiCallSaga),
  ]);
}
