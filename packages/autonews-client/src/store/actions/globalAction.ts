import { Action } from "src/store/models/actionModel";
import actionTypes from "src/store/types/actionTypes";

export const setUserinfo = (userInfo: any): Action<any> => {
  return { type: actionTypes.GLOBAL_SET_USERINFO, payload: userInfo };
};
export const fetchGlobalOrigin = (): Action<any> => {
  return { type: actionTypes.GLOBAL_FETCH_origin_REQUESTED };
};
export const fetchGlobalUserSetting = (
  origin: any,
  selectedOriginKeys: any,
  showSentimentInspector: boolean = true
): Action<any> => {
  return {
    type: actionTypes.GLOBAL_FETCH_userSetting_REQUESTED,
    payload: {
      origin,
      selectedOriginKeys,
      showSentimentInspector,
    },
  };
};
export const fetchGlobalNewsList = (originKeys: any): Action<any> => {
  return {
    type: actionTypes.GLOBAL_FETCH_newsList_REQUESTED,
    payload: originKeys,
  };
};
export const setLayouts = (layouts: any): Action<any> => {
  return { type: actionTypes.GLOBAL_SET_layouts, payload: layouts };
};
export const setFilteredList = (item: any): Action<any> => {
  return { type: actionTypes.GLOBAL_SET_filteredList, payload: item };
};
export const setShowSentimentInspector = (status: any): Action<any> => {
  return {
    type: actionTypes.GLOBAL_SET_showSentimentInspector,
    payload: status,
  };
};
