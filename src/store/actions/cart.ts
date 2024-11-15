import Taro from "@tarojs/taro";
import { CHANGE_CART_LIST, CHANGE_CART_LOADING } from "../../utils/constant";
import {
  getCartsInfo,
  changeProductQuantity,
  removeProductInCart,
  addProductToCart,
  changeStatusCart,
  selectShipping,
  selectPayment,
} from "../../api/request";

export const requestCart = () => {
  return async (dispatch) => {
    let result = await getCartsInfo();
    let resultObj = cartDataMapper(result);
    dispatch(changeCart(resultObj));
    Taro.eventCenter.trigger("cartChange");
  };
};

export const changeCart = (data) => ({
  type: CHANGE_CART_LIST,
  data,
});

export const requestChangeQtyCart = (itemId, qty) => {
  return async (dispatch) => {
    let result = await changeProductQuantity(itemId, qty);
    console.log("requestChangeQtyCart:");
    console.log(result);
    let resultObj = cartDataMapper(result);
    dispatch(changeCart(resultObj));
    Taro.eventCenter.trigger("cartChange");
  };
};

export const requestRemoveCart = (itemIds) => {
  return async (dispatch) => {
    console.log("requestRemoveCart start:");
    let result = await removeProductInCart(itemIds);
    console.log("requestRemoveCart:");
    console.log(result);
    let resultObj = cartDataMapper(result);
    dispatch(changeCart(resultObj));
    Taro.eventCenter.trigger("cartChange");
  };
};
export const requestAddProductCart = (
  productId,
  quantity,
  sku,
  options = []
) => {
  return async (dispatch) => {
    console.log("requestAddProductCart start:");
    let result = await addProductToCart(productId, quantity, sku, options);
    console.log("requestAddProductCart:");
    console.log(result);
    let resultObj = cartDataMapper(result);
    dispatch(changeCart(resultObj));
    Taro.eventCenter.trigger("cartChange");
  };
};

export const changeLoading = (data) => ({
  type: CHANGE_CART_LOADING,
  data,
});

export const requestChangeStatusCart = (ids, actionType) => {
  return async (dispatch) => {
    console.log("requestChangeStatusCart start:");
    let result = await changeStatusCart(ids, actionType);
    console.log("requestChangeStatusCart:");
    console.log(result);
    let resultObj = cartDataMapper(result);
    dispatch(changeCart(resultObj));
    Taro.eventCenter.trigger("cartChange");
  };
};
export const requestSelectShipping = (orderData) => {
  return async (dispatch) => {
    console.log("requestSelectShipping start:");
    let result = await selectShipping(orderData);
    console.log("requestSelectShipping:");
    console.log(result);
    let resultObj = cartDataMapper(result);
    dispatch(changeCart(resultObj));
    Taro.eventCenter.trigger("cartChange");
  };
};
export const requestSelectPayment = (orderData) => {
  return async (dispatch) => {
    console.log("requestSelectPayment start:");
    let result = await selectPayment(orderData);
    console.log("requestSelectPayment:");
    console.log(result);
    let resultObj = cartDataMapper(result);
    dispatch(changeCart(resultObj));
    Taro.eventCenter.trigger("cartChange");
  };
};
export const cartDataMapper = (result) => {
  let resultObj = result;
  let selectAll = true;
  let productCount = 0;
  let storeIds = [];
  result.storeSubTotal = [];
  let itemObjs = Object.keys(result.items).map((store) => {
    storeIds.push(store);
    return result.items[store].map((item) => {
      console.log(item.status);
      if (!result.storeSubTotal[store]) {
        result.storeSubTotal[store] = 0;
      }
      if (item.status == 1) {
        item.selected = true;
        result.storeSubTotal[store] =
          result.storeSubTotal[store] + parseFloat(item.total);
      } else {
        item.selected = false;
        selectAll = false;
      }
      productCount = productCount + parseInt(item.qty);
      return item;
    });
  });

  resultObj.selectAll = selectAll;
  resultObj.productCount = productCount;
  resultObj.items = itemObjs;
  resultObj.storeIds = storeIds;
  return resultObj;
};
