import { AnyAction, Reducer } from "redux";
import actionTypes from "../types/actionTypes";

const initialState = {
  isFetching: false,
  pastInquiryResult: { list: [], pagination: {} },
  form: {},
  isDetailModalShow: false,
  isDetailFetching: false,
  detail: {},
};

const pastInquiryReducer: Reducer<any> = (
  state: any = initialState,
  action: AnyAction
): any | any => {
  switch (action.type) {
    case actionTypes.PastInquiry_FETCH_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.PastInquiry_FETCH_SUCCESSED:
      return {
        ...state,
        isFetching: false,
      };
    case actionTypes.PastInquiry_FETCH_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    case actionTypes.PastInquiry_SET_formValue:
      return {
        ...state,
        form: Object.assign(state.form, action.payload),
      };
    case actionTypes.PastInquiry_FETCH_detail_SUCCESSED:
      return {
        ...state,
        isDetailFetching: false,
      };
    case actionTypes.PastInquiry_FETCH_detail_REQUESTED:
      return {
        ...state,
        isDetailFetching: true,
      };
    case actionTypes.PastInquiry_SET_isDetailModalShow:
      if (action.payload) {
        return {
          ...state,
          isDetailModalShow: action.payload,
        };
      } else {
        return {
          ...state,
          isDetailModalShow: action.payload,
          detail: {},
        };
      }

    default:
      return state;
  }
};

export default pastInquiryReducer;
