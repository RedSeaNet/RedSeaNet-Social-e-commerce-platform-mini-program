import {
  CHANGE_COUPONS_LIST_LOADING,
  CHANGE_COUPONS_LIST,
} from "../../utils/constant";

const COUPONS_INFO_INITIAL_STATE = {
  loading: false,
  coupons: [],
};

export function coupons(state = COUPONS_INFO_INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_COUPONS_LIST:
      if (action.page != 1 && state.coupons && state.coupons.length > 0) {
        console.log(state.coupons);
        let result = [];
        state.coupons.map((item) => {
          result.push(item);
        });
        if (action.data.coupons && action.data.coupons.length > 0) {
          action.data.coupons.map((item) => {
            result.push(item);
          });
        }
        return { ...state, coupons: result };
      }
      return { ...state, coupons: action.data };
    case CHANGE_COUPONS_LIST_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}
