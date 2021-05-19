import { Action } from "src/store/models/actionModel";
import actionTypes from "src/store/types/actionTypes";

export function fetchMonitor(): Action<any> {
  return {
    type: actionTypes.Monitor_FETCH_REQUESTED,
  };
}
