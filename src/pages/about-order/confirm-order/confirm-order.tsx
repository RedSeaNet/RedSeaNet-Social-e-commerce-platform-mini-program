import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./confirm-order.scss";
import { connect } from "react-redux";
import Navbar from "../../../component/navbarTitle";
import { CURRENCY, USER } from "../../../utils/constant";
import { getShippingMethod } from "./../../../api/request";
import {
  requestAddress,
  requestPayment,
  requestSelectedAddress,
} from "../../../store/actions/order";
import {
  requestCart,
  requestSelectShipping,
  requestSelectPayment,
} from "../../../store/actions/cart";
import ConfirmOrderItem from "./confirm-order-item/confirm-order-item";
import {
  AtIcon,
  AtFloatLayout,
  AtButton,
  AtActionSheet,
  AtActionSheetItem,
} from "taro-ui";
import { placeOrder } from "./../../../api/request";

class ConfirmOrder extends Component {
  config = {
    navigationBarTitleText: "确认订单",
  };

  constructor(props) {
    super(props);
  }
  state = {
    showPayModal: false, //是否显示弹框
    payment: "", //当前付款方式
    shippingMethod: {}, //配送方式
    storeIds: [], //店铺id集合
    user: {},
    currency: {},
    showAddressModal: false,
    showShippingModal: false,
    shippingMethodList: [],
    actionSheetShippingMethod: {},
  };
  async componentDidMount() {
    this.props.dispatch(requestAddress());
    //匹配已经勾选的商品并按照店铺拼成二维数组
    //获取店铺配送方式
    //获取支付方式
    this.props.dispatch(requestPayment());
    let user = Taro.getStorageSync(USER);
    if (!user.id) {
      Taro.redirectTo({ url: "/pages/about-personal/user-login/userloagin" });
    }
    let currency = Taro.getStorageSync(CURRENCY);
    console.log("getStorageSync currency:");
    console.log(currency);
    this.setState({ currency: currency });
    let { cart } = this.props.cart;
    if (cart.items.length == 0) {
      Taro.switchTab({ url: "/pages/index/cart/cart" });
    }
    this.setState({ storeIds: cart.storeIds });
    //this.props.dispatch(requestDeliveryMethod(Array.from(storeIds)));
    let shippingMethodResult = await getShippingMethod(cart.storeIds);
    let arr = [];
    Object.keys(shippingMethodResult).map((item) => {
      let obj = { ...shippingMethodResult[item], storeId: item };
      arr.push(obj);
      if (!shippingMethodResult[item].isvirtal) {
        shippingMethodResult[item].shippingmethod[0].id = item;
      }
    });
    this.setState({
      shippingMethodList: arr,
    });
  }

  handleChooseAddress = (address) => {
    this.setState({ showAddressModal: false });
    this.props.dispatch(requestSelectedAddress(address));
  };

  handleChooseShippingMethodPanel = (storeId) => {
    let { shippingMethodList } = this.state;
    let actionSheetShippingMethod = {};
    shippingMethodList.map((shipping) => {
      if ((shipping.storeId = storeId)) {
        actionSheetShippingMethod = shipping;
      }
    });
    this.setState({
      actionSheetShippingMethod: actionSheetShippingMethod,
      showShippingModal: true,
    });
  };
  chooseShippingMethod = (storeId, shippingMethodCode) => {
    let { cart } = this.props.cart;
    let shippingMethodOld = cart.shipping_method;
    let request_shipping_method = {};

    Object.keys(shippingMethodOld).map((item) => {
      request_shipping_method[item] = shippingMethodOld[item].code;
    });
    request_shipping_method[storeId] = shippingMethodCode;

    let orderData = {};
    orderData.shipping_method = request_shipping_method;
    this.props.dispatch(requestSelectShipping(orderData));
    this.setState({ showShippingModal: false });
  };
  choosePayMethod = (payment) => {
    let orderData = {};
    orderData.payment_method = payment;
    this.props.dispatch(requestSelectPayment(orderData));
    this.setState({ payment: payment });
  };
  handleConfirmPay = async () => {
    let shippingMethodObj = {};
    let { storeIds, shippingMethodList, payment } = this.state;
    let { cart } = this.props.cart;
    let { selectedAddress } = this.props.order;
    console.log(cart);
    if (cart.is_virtual != 1 && !selectedAddress.id) {
      this.setState({ showAddressModal: true });
      return false;
    }
    for (let s = 0; s < storeIds.length; s++) {
      if (
        cart.shipping_method[storeIds[s]] &&
        cart.shipping_method[storeIds[s]].code
      ) {
        shippingMethodObj[storeIds[s]] = cart.shipping_method[storeIds[s]].code;
      } else if (!shippingMethodList[item].isvirtal) {
        Taro.showModal({
          title: "配送方式",
          showCancel: false,
        });
        return false;
      }
    }
    if (!payment) {
      Taro.showModal({
        title: "请选择支付方式",
        showCancel: false,
      });
      return false;
    }
    let data = {
      payment_method: payment,
      shipping_address_id: selectedAddress.id,
      billing_address_id: selectedAddress.id,
      shipping_method: shippingMethodObj,
    };
    console.log(data);
    let placeOrderResult = await placeOrder(data);
    this.props.dispatch(requestCart());
    if (placeOrderResult.length > 0) {
      Taro.navigateTo({
        url: "/pages/about-order/orders/orders",
      });
    } else {
      Taro.switchTab({ url: "/pages/index/cart/cart" });
    }
  };
  handleConfirmButton = () => {
    this.setState({ showPayModal: true });
  };
  render() {
    const { paymentMethodList, addressList, selectedAddress } =
      this.props.order;
    let { cart } = this.props.cart;
    let {
      currency,
      showPayModal,
      payment,
      showAddressModal,
      showShippingModal,
      shippingMethodList,
      actionSheetShippingMethod,
    } = this.state;
    return (
      <View className="confirm-order">
        <Navbar title={Taro.T._("confirmorder")} />
        <View className="confirm-order-address">
          <View
            onClick={() => this.setState({ showAddressModal: true })}
            className="confirm-order-address-view"
          >
            {selectedAddress.id ? (
              <View className="confirm-order-address-view-item">
                <View className="confirm-order-address-view-item-action">
                  <AtIcon value="edit" size="20" color="#d62c75"></AtIcon>
                </View>
                <View className="confirm-order-address-view-item-content">
                  <View>
                    <Text>{selectedAddress.name}</Text>
                    <Text> {selectedAddress.tel}</Text>
                  </View>
                  <View>
                    <Text>
                      {selectedAddress.region_name
                        ? selectedAddress.region_name + ", "
                        : ""}
                      {selectedAddress.city_name
                        ? selectedAddress.city_name + ", "
                        : ""}
                      {selectedAddress.county_name
                        ? selectedAddress.county_name + ", "
                        : ""}
                      {selectedAddress.address}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View className="confirm-order-address-view-item">
                <View className="confirm-order-address-view-item-action">
                  <AtIcon value="edit" size="30" color="#d62c75"></AtIcon>
                </View>
                <View className="confirm-order-address-view-item-content">
                  <Text>{Taro.T._("pleasechooseaddress")}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
        <View className="confirm-order-product">
          {cart.items && cart.items.length > 0
            ? Object.keys(cart.items).map((storeId) => {
                return (
                  <View className="confirm-order-product-store">
                    <View className="confirm-order-product-store-title">
                      <Image
                        src={require("../../../assets/store-ico.png")}
                        className="cart-container-store-icon"
                      />
                      <Text>{cart.items[storeId][0].store_name}</Text>
                    </View>
                    {cart.items[storeId].map((item) => {
                      return item.status == 1 ? (
                        <ConfirmOrderItem {...item} currency={currency} />
                      ) : null;
                    })}
                    <View className="confirm-order-product-store-subtotal">
                      <Text>
                        {currency.symbol}
                        {parseFloat(
                          cart.storeSubTotal[cart.items[storeId][0].store_id]
                        ).toFixed(2)}
                      </Text>
                    </View>
                    <View className="confirm-order-product-store-shippingmethod">
                      {shippingMethodList[storeId] &&
                      !shippingMethodList[storeId].isvirtal ? (
                        cart.shipping_method[
                          cart.items[storeId][0].store_id
                        ] ? (
                          <Text
                            onClick={() =>
                              this.handleChooseShippingMethodPanel(
                                cart.items[storeId][0].store_id
                              )
                            }
                          >
                            {Taro.T._("shippingmethod") +
                              ": " +
                              cart.shipping_method[
                                cart.items[storeId][0].store_id
                              ].label}
                          </Text>
                        ) : (
                          <Text
                            onClick={() =>
                              this.handleChooseShippingMethodPanel(
                                cart.items[storeId][0].store_id
                              )
                            }
                          >
                            {Taro.T._("shippingmethod") + ": "}
                          </Text>
                        )
                      ) : null}
                    </View>
                  </View>
                );
              })
            : null}
        </View>
        <View className="confirm-order-totalview">
          <View className="confirm-order-totalview-subtotal">
            <Text>
              {Taro.T._("subtotal")}:
              {currency.symbol + parseFloat(cart.subtotal).toFixed(2)}
            </Text>
          </View>
          <View className="confirm-order-totalview-discount">
            <Text>
              {Taro.T._("totaldiscount")}:{parseFloat(cart.discount).toFixed(2)}
            </Text>
          </View>
          <View className="confirm-order-totalview-discountdetail">
            {cart.discount_detail &&
            cart.discount_detail.Promotion &&
            cart.discount_detail.Promotion.detail &&
            cart.discount_detail.Promotion.detail.length > 0
              ? cart.discount_detail.Promotion.detail.map((detail, idx) => {
                  return (
                    <Text>
                      {detail.name}({detail.storename}): -
                      {currency.symbol + detail.discount}
                    </Text>
                  );
                })
              : null}
          </View>
          <View className="confirm-order-totalview-discount">
            <Text>
              {Taro.T._("shippingfee")}：
              {currency.symbol + parseFloat(cart.shipping).toFixed(2)}
            </Text>
          </View>
        </View>
        <View className="confirm-order-confirm">
          <Text>{Taro.T._("total")}：</Text>
          <Text style={{ fontWeight: "bold", color: "#D62C75" }}>
            {currency.symbol} {parseFloat(cart.total).toFixed(2)}
          </Text>
          <View
            className="confirm-order-confirm-button"
            onClick={() => {
              this.handleConfirmButton();
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {Taro.T._("submitorder")}
            </Text>
          </View>
        </View>
        {/*choose payment method start*/}
        <AtFloatLayout
          title={Taro.T._("confirmpayment")}
          isOpened={showPayModal}
          className="confirm-order-alert"
        >
          <View className="confirm-order-alert-account">
            <Text>
              {currency.symbol}
              {parseFloat(cart.total).toFixed(2)}
            </Text>
          </View>
          {Object.keys(paymentMethodList).map((item) => (
            <View
              className="confirm-order-alert-pay"
              onClick={() => this.choosePayMethod(item)}
            >
              <Text className="confirm-order-alert-pay-text">
                {paymentMethodList[item]}
              </Text>
              <AtIcon
                value="check-circle"
                color={
                  paymentMethodList[payment] === paymentMethodList[item]
                    ? "#d62c75"
                    : "#707070"
                }
                size={
                  paymentMethodList[payment] === paymentMethodList[item]
                    ? "18"
                    : "0"
                }
                className="confirm-order-alert-pay-icon"
              />
            </View>
          ))}
          <View
            className="confirm-order-alert-button"
            onClick={this.handleConfirmPay}
          >
            <Text style={{ color: "white" }}>{Taro.T._("confirmandpay")}</Text>
          </View>
        </AtFloatLayout>
        {/*choose payment method end*/}
        {/*choose address start*/}
        <AtFloatLayout
          title={Taro.T._("chooseaddress")}
          isOpened={showAddressModal}
          className="confirm-order-chooseaddress"
        >
          <View className="confirm-order-chooseaddress-listview">
            {addressList.length > 0
              ? addressList.map((address, idx) => {
                  return (
                    <View
                      key={idx}
                      className="confirm-order-chooseaddress-listview-item"
                      onClick={() => this.handleChooseAddress(address)}
                    >
                      <View className="confirm-order-chooseaddress-listview-item-action">
                        {selectedAddress.id &&
                        selectedAddress.id == address.id ? (
                          <AtIcon
                            value="check-circle"
                            size="20"
                            color="#d62c75"
                          />
                        ) : (
                          <AtIcon
                            value="close-circle"
                            size="20"
                            color="#707070"
                          />
                        )}
                      </View>
                      <View className="confirm-order-chooseaddress-listview-item-content">
                        <View>
                          <Text>{address.name}</Text>
                          <Text> {address.tel}</Text>
                        </View>
                        <View>
                          <Text>
                            {address.region_name
                              ? address.region_name + ", "
                              : ""}
                            {address.city_name ? address.city_name + ", " : ""}
                            {address.county_name
                              ? address.county_name + ", "
                              : ""}
                            {address.address}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              : null}
            <AtButton
              type="primary"
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/about-personal/address/add-address/add-address`,
                });
              }}
            >
              {Taro.T._("addnewaddress")}
            </AtButton>
          </View>
        </AtFloatLayout>
        {/*choose address start*/}
        <AtActionSheet isOpened={showShippingModal}>
          {actionSheetShippingMethod.shippingmethod &&
          actionSheetShippingMethod.shippingmethod.length > 0
            ? actionSheetShippingMethod.shippingmethod.map((method) => {
                return (
                  <AtActionSheetItem
                    onClick={() => {
                      this.chooseShippingMethod(
                        actionSheetShippingMethod.storeId,
                        method.code
                      );
                    }}
                  >
                    {method.label}({currency.symbol + method.fee})
                  </AtActionSheetItem>
                );
              })
            : null}
        </AtActionSheet>
      </View>
    );
  }
}

const mapStateToProps = ({ order, cart }) => ({
  order,
  cart: cart,
});

export default connect(mapStateToProps)(ConfirmOrder);
