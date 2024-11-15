import { CHANGE_CURRENCY, CHANGE_CURRENCY_LOADING } from "../../utils/constant";

const INITIAL_CURRENCY_STATE = {
  loading: false,
  currency: {},
};

export function currency(state = INITIAL_CURRENCY_STATE, action) {
  switch (action.type) {
    case CHANGE_CURRENCY:
      return { ...state, currency: action.data };
    case CHANGE_CURRENCY_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}
