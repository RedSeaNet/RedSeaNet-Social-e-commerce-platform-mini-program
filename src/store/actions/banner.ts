import { getBannerByCode } from "../../api/request";
import { CHANGE_BANNER, CHANGE_BANNER_LOADING } from "../../utils/constant";

export const requestBanner = (code, limit = 8) => {
  return async (dispatch) => {
    let bannerList = await getBannerByCode(code, limit);
    dispatch(changeBanner(bannerList, code));
  };
};
export const changeBanner = (data, code) => ({
  type: CHANGE_BANNER,
  data,
  code,
});
export const changeBannerLoading = (data) => ({
  type: CHANGE_BANNER_LOADING,
  data,
});
