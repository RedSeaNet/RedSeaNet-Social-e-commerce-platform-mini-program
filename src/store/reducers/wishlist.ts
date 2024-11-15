import {
  CHANGE_WISH_LIST,
  CHANGE_WISH_LIST_LOADING,
} from "../../utils/constant";

const INITIAL_WISHLIST_STATE = {
  loading: false,
  wishlist: [],
};

export function wishlist(state = INITIAL_WISHLIST_STATE, action) {
  switch (action.type) {
    case CHANGE_WISH_LIST:
      return { ...state, wishlist: action.data };
    case CHANGE_WISH_LIST_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}
