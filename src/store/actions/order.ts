import {
  getAddress,
  getPaymentMethod,
  getShippingMethod,
  getOrder,
} from "../../api/request";
import {
  CHANGE_ORDER_ADDRESS,
  CHANGE_ORDER_DELIVERY,
  CHANGE_ORDER_PAYMENT,
  CHANGE_ORDER_SELECTED_ADDRESS,
} from "../../utils/constant";

export const requestAddress = () => {
  return async (dispatch) => {
    let addressList = await getAddress();

    if (addressList.length > 0) {
      let defaultAddress = addressList.filter((item) => item.is_default == 1);
      if (defaultAddress[0] && defaultAddress[0].id) {
        dispatch(changeSelectedAddress(defaultAddress[0]));
      } else {
        dispatch(changeSelectedAddress(addressList[0]));
      }
    }
    dispatch(changeAddress(addressList));
  };
};
export const requestSelectedAddress = (address) => {
  return async (dispatch) => {
    dispatch(changeSelectedAddress(address));
  };
};
export const changeAddress = (data) => ({
  type: CHANGE_ORDER_ADDRESS,
  data,
});
//修改当前选择的收货地址
export const changeSelectedAddress = (data) => ({
  type: CHANGE_ORDER_SELECTED_ADDRESS,
  data,
});
//获取配送方式
export const requestDeliveryMethod = (ids) => {
  return async (dispatch) => {
    let result = await getShippingMethod(ids);
    let arr = [];
    Object.keys(result).map((item) => {
      let obj = { ...result[item], storeId: item };
      arr.push(obj);
    });
    dispatch(changeDeliverMethod(arr));
  };
};

export const changeDeliverMethod = (data) => ({
  type: CHANGE_ORDER_DELIVERY,
  data,
});

export const requestPayment = () => {
  return async (dispatch) => {
    let result = await getPaymentMethod();
    dispatch(changePayment(result));
  };
};

export const changePayment = (data) => ({
  type: CHANGE_ORDER_PAYMENT,
  data,
});
