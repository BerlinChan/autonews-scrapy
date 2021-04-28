import { combineReducers, Reducer } from "redux";
import apiCallSaga from "./sagas/apiCallSaga";
import { fork, all } from "redux-saga/effects";
import rootReducer from "./reducer/rootReducer";
import { FakeDataModal } from "./models/actionModel";

export interface RootState {
  // add models
  homeData: FakeDataModal;
}

export const createRootReducer = (): Reducer<any> =>
  combineReducers({
    // userDetails: userDetailsReducerFileImport
    homeData: rootReducer,
  });

export function* rootSaga(): Generator {
  yield all([fork(apiCallSaga)]);
}
