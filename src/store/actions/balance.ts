import { CHANGE_BALANCE, CHANGE_BALANCE_LOADING } from "../../utils/constant";
import { balanceList } from "../../api/request";

export const requestBalance = (condition, page, limit) => {
  return async (dispatch) => {
    let result = await balanceList(condition, page, limit);
    dispatch(changeBalance(result));
  };
};

export const changeBalance = (data) => ({
  type: CHANGE_BALANCE,
  data,
});

export const changeBalanceLoading = (data) => ({
  type: CHANGE_BALANCE_LOADING,
  data,
});
