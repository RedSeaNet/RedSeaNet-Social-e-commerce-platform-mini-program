import { CHANGE_BALANCE, CHANGE_BALANCE_LOADING } from "../../utils/constant";

const INITIAL_BALANCE_STATE = {
  loading: false,
  balance: {},
};

export function balance(state = INITIAL_BALANCE_STATE, action) {
  switch (action.type) {
    case CHANGE_BALANCE:
      if (action.page != 1 && state.balance && state.balance.length > 0) {
        console.log(state.balance);
        console.log(action.data.balance);
        let result = {};
        result.list = [];
        result.total = action.data.total;
        state.balance.list.map((item) => {
          result.list.push(item);
        });
        if (action.data.balance && action.data.balance.length > 0) {
          action.data.balance.list.map((item) => {
            result.list.push(item);
          });
        }
        return { ...state, balance: result };
      }
      return { ...state, balance: action.data };
    case CHANGE_BALANCE_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}
