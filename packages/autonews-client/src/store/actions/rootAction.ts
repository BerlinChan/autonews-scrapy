import {
  Action,
  GetFakeDataList,
  PostFakeDataObject,
} from "src/store/models/actionModel";
import { updateAction } from "src/utils/utility";
import actionTypes from "src/store/types/actionTypes";

export const setUserinfo = (userInfo: any): Action<any> => {
  return updateAction(actionTypes.GLOBAL_SET_USERINFO, userInfo);
};
export const fetchGlobalOrigin = (): Action<any> => {
  return updateAction(actionTypes.GLOBAL_FETCH_origin_REQUESTED);
};
export const fetchGlobalUserSetting = (
  origin: any,
  selectedOriginKeys: any,
  showSentimentInspector: boolean = true
): Action<any> => {
  return updateAction(actionTypes.GLOBAL_FETCH_userSetting_REQUESTED, {
    origin,
    selectedOriginKeys,
    showSentimentInspector,
  });
};
export const fetchGlobalNewsList = (originKeys: any): Action<any> => {
  return updateAction(actionTypes.GLOBAL_FETCH_newsList_REQUESTED, originKeys);
};
export const setLayouts = (layouts: any): Action<any> => {
  return updateAction(actionTypes.GLOBAL_SET_layouts, layouts);
};
export const setFilteredList = (item: any): Action<any> => {
  return updateAction(actionTypes.GLOBAL_SET_filteredList, item);
};
export const setShowSentimentInspector = (status: any): Action<any> => {
  return updateAction(actionTypes.GLOBAL_SET_showSentimentInspector, status);
};

export const fetchGetApiCallExample = (): Action<GetFakeDataList> => {
  return updateAction(actionTypes.GET_API_CALL);
};

export const fetchGetApiDataExample = (
  payload: GetFakeDataList
): Action<GetFakeDataList> => {
  return updateAction(actionTypes.GET_API_DATA, payload);
};

export const fetchPostApiCallExample = (
  requestJSON: PostFakeDataObject
): Action<PostFakeDataObject> => {
  return updateAction(actionTypes.POST_API_CALL, requestJSON);
};

export const fetchPostApiDataExample = (
  postResponseData: PostFakeDataObject
): Action<PostFakeDataObject> => {
  return updateAction(actionTypes.POST_API_DATA, postResponseData);
};
