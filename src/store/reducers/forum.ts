import {
  CHANGE_FROUM_CATEGORY,
  CHANGE_FROUM_CATEGORY_LOADING,
  CHANGE_FROUM_POST,
  CHANGE_FROUM_POST_LOADING,
  CHANGE_POST_DETAIL,
  CHANGE_POST_DETAIL_LOADING,
} from "../../utils/constant";

const INITIAL_FORUM_STATE = {
  loading: false,
  forumCategoryList: [],
};

export function forumCategory(state = INITIAL_FORUM_STATE, action) {
  switch (action.type) {
    case CHANGE_FROUM_CATEGORY:
      return { ...state, forumCategoryList: action.data };
    case CHANGE_FROUM_CATEGORY_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}

const FORUM_POST_INITIAL_STATE = {
  loading: false,
  postList: [],
  postDetail: {},
};

export function forumPostInfo(state = FORUM_POST_INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_FROUM_POST:
      if (
        action.page != 1 &&
        state.postList.posts &&
        state.postList.posts.length > 0
      ) {
        console.log(state.postList.posts);
        console.log(action.data.posts);
        let result = [];
        state.postList.posts.map((item) => {
          result.push(item);
        });
        if (action.data.posts && action.data.posts.length > 0) {
          action.data.posts.map((item) => {
            result.push(item);
          });
        }
        return { ...state, postList: { posts: result } };
      }
      return { ...state, postList: action.data };
    case CHANGE_FROUM_POST_LOADING:
      return { ...state, loading: action.data };
    case CHANGE_POST_DETAIL:
      return { ...state, postDetail: action.data };
    default:
      return state;
  }
}
