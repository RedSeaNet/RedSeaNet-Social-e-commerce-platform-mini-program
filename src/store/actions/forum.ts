import {
  CHANGE_FROUM_CATEGORY,
  CHANGE_FROUM_CATEGORY_LOADING,
  CHANGE_FROUM_POST,
  CHANGE_FROUM_POST_LOADING,
} from "../../utils/constant";
import { getForumCategory, getForumPostList } from "../../api/request";

export const requestFroumCategory = () => {
  return async (dispatch) => {
    let result = await getForumCategory();
    dispatch(changeForumCategory(result));
  };
};

export const changeForumCategory = (data) => ({
  type: CHANGE_FROUM_CATEGORY,
  data,
});

export const changeForumCategoryLoading = (data) => ({
  type: CHANGE_FROUM_CATEGORY_LOADING,
  data,
});

export const requestFroumPost = (condition = {}, page = 1, limit = 20) => {
  return async (dispatch) => {
    let result = await getForumPostList(condition, page, limit);
    dispatch(changeForumPost(result));
  };
};

export const changeForumPost = (data) => ({
  type: CHANGE_FROUM_POST,
  data,
});

export const changeForumPostLoading = (data) => ({
  type: CHANGE_FROUM_POST_LOADING,
  data,
});
