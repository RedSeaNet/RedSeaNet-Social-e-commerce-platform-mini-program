import { CHANGE_CART_LIST, CHANGE_CART_LOADING } from "../../utils/constant";

const INITIAL_STATE = {
  cart: {},
  loading: true,
};

export const cart = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_CART_LOADING:
      return { ...state, loading: action.data };
    case CHANGE_CART_LIST:
      return { ...state, cart: action.data };
    default:
      return state;
  }
};
