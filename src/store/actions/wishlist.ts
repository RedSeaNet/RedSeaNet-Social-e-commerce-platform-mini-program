import {
  CHANGE_WISH_LIST,
  CHANGE_WISH_LIST_LOADING,
} from "../../utils/constant";
import { addWishlistItem, getWishlist } from "../../api/request";

export const requestWishList = (page = 1, limit = 20) => {
  return async (dispatch) => {
    let result = await getWishlist(page, limit);
    dispatch(changeWishList(result));
  };
};
export const requestAddWishList = (itemData) => {
  console.log("requestAddWishList---");
  return async (dispatch) => {
    let result = await addWishlistItem(itemData);
    dispatch(changeWishList(result));
  };
};
export const changeWishList = (data) => ({
  type: CHANGE_WISH_LIST,
  data,
});

export const changeWishListLoading = (data) => ({
  type: CHANGE_WISH_LIST_LOADING,
  data,
});
