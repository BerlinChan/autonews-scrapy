import { AnyAction, Reducer } from "redux";
import actionTypes from "../types/actionTypes";

const initialState = {
  isFetching: false,
};

const monitorReducer: Reducer<any> = (
  state: any = initialState,
  action: AnyAction
): any | any => {
  switch (action.type) {
    case actionTypes.Monitor_FETCH_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.Monitor_FETCH_SUCCESSED:
      return {
        ...state,
        isFetching: false,
      };
    case actionTypes.Monitor_FETCH_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    default:
      return state;
  }
};

export default monitorReducer;
