import { CHANGE_BANNER, CHANGE_BANNER_LOADING } from "../../utils/constant";

const BANNER_INFO_INITIAL_STATE = {
  loading: false,
  banner: {},
};

export function banner(state = BANNER_INFO_INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_BANNER:
      let result = state.banner;
      if (action.data) {
        result[action.code] = action.data;
      }
      return { ...state, banner: result };
    case CHANGE_BANNER_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}
