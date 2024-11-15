import { CHANGE_CURRENCY, CHANGE_CURRENCY_LOADING } from "../../utils/constant";
import { getCurrencies } from "../../api/request";

export const requestCurrency = () => {
  return async (dispatch) => {
    let result = await getCurrencies();
    dispatch(changeCurrency(result));
  };
};

export const changeCurrency = (data) => ({
  type: CHANGE_CURRENCY,
  data,
});

export const changeCurrencyLoading = (data) => ({
  type: CHANGE_CURRENCY_LOADING,
  data,
});
