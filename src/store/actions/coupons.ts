import { getCoupons } from "../../api/request";
import {
  CHANGE_COUPONS_LIST_LOADING,
  CHANGE_COUPONS_LIST,
} from "../../utils/constant";

export const requestCoupons = (page) => {
  return async (dispatch) => {
    let result = await getCoupons(page);
    dispatch(changeCoupons(result, page));
  };
};

export const changeCoupons = (data, page) => ({
  type: CHANGE_COUPONS_LIST,
  data,
  page,
});
export const changeCouponsLoading = (data) => ({
  type: CHANGE_COUPONS_LIST_LOADING,
  data,
});
