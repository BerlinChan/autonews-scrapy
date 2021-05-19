import { take, put } from "redux-saga/effects";
import actionTypes from "../types/actionTypes";
import { API_SERVER } from "src/shared/constants/urls";
import FetchSendRequest from "src/shared/services/fetchSendRequestService";
import { notification } from "antd";

const sendRequest = FetchSendRequest.instance;

function* watchFetchPastInquiry(): any {
  while (true) {
    const { origin, beginDate, endDate, keyword, current, pageSize } =
      yield take(actionTypes.PastInquiry_FETCH_REQUESTED);

    const pastInquiry: any = yield sendRequest.MakeAPICall({
      url:
        API_SERVER +
        `pastInquiry?origin=${origin}&beginDate=${beginDate}&endDate=${endDate}&keyword=${keyword}&current=${current}&pageSize=${pageSize}`,
    });

    if (pastInquiry) {
      yield put({
        type: actionTypes.PastInquiry_FETCH_SUCCESSED,
        payload: pastInquiry.data.data,
      });
    } else {
      let errBody = yield pastInquiry;
      notification.error({
        message: "Error",
        description: errBody,
      });
    }
  }
}
function* watchFetchDetailById(): any {
  while (true) {
    const { id } = yield take(actionTypes.PastInquiry_FETCH_detail_REQUESTED);

    yield put({
      type: actionTypes.PastInquiry_SET_isDetailModalShow,
      payload: true,
    });
    const newsDetail: any = yield sendRequest.MakeAPICall({
      url: API_SERVER + `getNewsDetailById?id=${id}`,
    });

    if (newsDetail) {
      yield put({
        type: actionTypes.PastInquiry_FETCH_detail_SUCCESSED,
        data: newsDetail.data.data,
      });
    } else {
      let errBody = yield newsDetail;
      notification.error({
        message: "Error",
        description: errBody,
      });
    }
  }
}

const pastInquirySaga = [watchFetchPastInquiry, watchFetchDetailById];

export default pastInquirySaga;
