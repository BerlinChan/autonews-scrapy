import { Action } from "src/store/models/actionModel";
import actionTypes from "src/store/types/actionTypes";
import dayjs from "dayjs";

export function onDestroy(): Action<any> {
  return {
    type: actionTypes.PastInquiry_ON_destroy,
  };
}
export function fetchPastInquiry(
  origin = "",
  beginDate = new Date(dayjs().format("YYYY-MM-DD")),
  endDate = new Date(dayjs().add(1, "day").format("YYYY-MM-DD")),
  keyword = "",
  current = 1,
  pageSize = 20
): Action<any> {
  return {
    type: actionTypes.PastInquiry_FETCH_REQUESTED,
    payload: { origin, beginDate, endDate, keyword, current, pageSize },
  };
}
export function setFormValue(fields: any): Action<any> {
  return {
    type: actionTypes.PastInquiry_SET_formValue,
    payload: fields,
  };
}
export function setIsDetailModalShow(status = false): Action<any> {
  return {
    type: actionTypes.PastInquiry_SET_isDetailModalShow,
    payload: status,
  };
}
export function fetchDetailById(id: any) {
  return {
    type: actionTypes.PastInquiry_FETCH_detail_REQUESTED,
    id,
  };
}
