import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./bulk-order.scss";
import { connect } from "react-redux";
import Navbar from "../../../component/navbarTitle";
import { CURRENCY, USER } from "../../../utils/constant";
import {
  getShippingMethod,
  getProductDetailById,
  getShippingMethodByItems,
  bulkApply,
  getPaymentMethodByCondition,
} from "../../../api/request";
import {
  requestAddress,
  requestPayment,
  requestSelectedAddress,
} from "../../../store/actions/order";
import {
  AtIcon,
  AtFloatLayout,
  AtButton,
  AtActionSheet,
  AtActionSheetItem,
  AtRadio,
} from "taro-ui";
class BulkOrder extends Component {
  config = {
    navigationBarTitleText: "确认订单",
  };
  current = getCurrentInstance();
  constructor(props) {
    super(props);
  }
  state = {
    productData: {},
    showPayModal: false, //是否显示弹框
    payment: "", //当前付款方式
    paymentMethodList: [],
    shippingMethod: [], //配送方式
    selectedAddress: {},
    storeIds: [], //店铺id集合
    user: {},
    currency: {},
    cart: {},
    showAddressModal: false,
    showShippingModal: false,
    shippingMethodList: [],
    shippingFee: 0,
    total: 0,
    bulkSize: "",
    bulkPrice: 0,
    quantity: 0,
    bulkId: "",
  };

  async componentDidMount() {
    this.setState({ quantity: this.current.router.params.quantity });
    console.log("------this.current.router.params.bulkId---------");
    console.log(this.current.router.params.bulkId);
    let bulkSize = "";
    if (
      this.current.router.params.bulkId &&
      this.current.router.params.bulkId != ""
    ) {
      bulkSize = this.current.router.params.size;
      this.setState({
        bulkSize: this.current.router.params.size,
        bulkId: this.current.router.params.bulkId,
      });
    }
    console.log("----options_name--------");
    console.log(this.current.router.params.options_name);
    let options = JSON.parse(this.current.router.params.options);
    console.log("------options---------");
    console.log(options);
    this.props.dispatch(requestAddress());
    //匹配已经勾选的商品并按照店铺拼成二维数组
    let user = Taro.getStorageSync(USER);
    if (!user.id) {
      Taro.redirectTo({ url: "/pages/about-personal/user-login/user-login" });
    }
    let currency = Taro.getStorageSync(CURRENCY);
    console.log("getStorageSync currency:");
    console.log(currency);
    this.setState({ currency: currency });
    const productResult = await getProductDetailById(
      this.current.router.params.product_id
    );
    console.log("productResult:");
    console.log(productResult);
    this.setState({ productData: productResult });
    if (productResult.bulk_price) {
      if (
        this.current.router.params.size &&
        this.current.router.params.size != ""
      ) {
        Object.keys(productResult.bulk_price).map((bulkman) => {
          if (bulkman == this.current.router.params.size) {
            this.setState({
              bulkPrice: productResult.bulk_price[bulkman],
              total:
                parseFloat(productResult.bulk_price[bulkman]) *
                this.current.router.params.quantity,
            });
          }
        });
      } else {
        Object.keys(productResult.bulk_price).map((bulkman) => {
          bulkSize = bulkman;
          this.setState({
            bulkPrice: productResult.bulk_price[bulkman],
            total:
              parseFloat(productResult.bulk_price[bulkman]) *
              this.current.router.params.quantity,
            bulkSize: bulkman,
          });
          return;
        });
      }
    }
    const { addressList } = this.props.order;
    let selectedAddress = {};
    if (addressList.length > 0) {
      addressList.map((address, idx) => {
        if (address.is_default == "1") {
          selectedAddress = address;
        }
      });
      if (!selectedAddress.id) {
        selectedAddress = addressList[0];
      }
      this.setState({ selectedAddress: selectedAddress });
      let storeIds = [];
      storeIds.push(productResult.store_id);
      const shippingMethodResult = await getShippingMethodByItems(
        [productResult],
        selectedAddress.id
      );
      let arr = [];
      let shippingMethod = {};
      let shippingFee = 0;
      let s = 0;
      Object.keys(shippingMethodResult).map((item) => {
        let obj = { ...shippingMethodResult[item] };
        arr.push(obj);
        if (s == 0) {
          shippingMethod = shippingMethodResult[item];
          shippingMethod.code = item;
          shippingFee = parseFloat(shippingMethodResult[item].fee);
        }
      });
      this.setState({
        shippingMethodList: shippingMethodResult,
        shippingMethod: shippingMethod,
        shippingFee: shippingFee,
      });
    }
    let condition = {
      total:
        parseFloat(productResult.bulk_price[bulkSize]) *
        this.current.router.params.quantity,
      shipping_address_id: selectedAddress.id ? selectedAddress.id : "",
    };
    getPaymentMethodByCondition(condition).then((payments) => {
      console.log("-------getPaymentMethodByCondition------");
      console.log(payments);
      this.setState({ paymentMethodList: payments });
    });
  }
  handleChooseAddress = (address) => {
    this.setState({ showAddressModal: false, selectedAddress: address });
    let { total, shippingMethod } = this.state;
    let condition = { total: total, shipping_address_id: address.id };

    getPaymentMethodByCondition(condition).then((payments) => {
      console.log("-------getPaymentMethodByCondition------");
      console.log(payments);
      this.setState({ paymentMethodList: payments });
    });
  };

  handleChooseShippingMethodPanel = () => {
    this.setState({
      showShippingModal: true,
    });
  };
  chooseShippingMethod = (shippingMethodCode) => {
    let { shippingMethod, shippingMethodList } = this.state;
    let shippingFee = 0;

    Object.keys(shippingMethodList).map((methodcode) => {
      if (methodcode == shippingMethodCode) {
        shippingMethod = shippingMethodList[methodcode];
        shippingMethod.code = methodcode;
        shippingFee = shippingMethodList[methodcode].fee;
      }
    });
    this.setState({
      shippingMethod: shippingMethod,
      showShippingModal: false,
      shippingFee: shippingFee,
    });
  };
  handleNewBulkButton = () => {
    let { shippingMethod, productData, bulkSize, selectedAddress } = this.state;
    if (!bulkSize) {
      Taro.showModal({
        title: Taro.T._("pleasechoosebulkpricestep"),
        showCancel: false,
      });
      return false;
    }
    if (productData.product_type_id != "2" && !selectedAddress.id) {
      Taro.showModal({
        title: Taro.T._("pleasechooseaddress"),
        showCancel: false,
      });
      return false;
    }
    this.setState({ showPayModal: true });
  };
  handleConfirmPay = async () => {
    let {
      payment,
      shippingMethod,
      productData,
      bulkSize,
      quantity,
      bulkId,
      selectedAddress,
    } = this.state;
    if (!bulkSize) {
      Taro.showModal({
        title: Taro.T._("pleasechoosebulkpricestep"),
        showCancel: false,
      });
      return false;
    }
    if (productData.product_type_id != "2" && selectedAddress == "") {
      Taro.showModal({
        title: Taro.T._("pleasechooseaddress"),
        showCancel: false,
      });
      return false;
    }
    if (!payment) {
      Taro.showModal({
        title: Taro.T._("pleasechoosepayment"),
        showCancel: false,
      });
      return false;
    }

    let choosenShippingMethod = shippingMethod.code;
    let data = {
      payment_method: this.state.payment,
      shipping_address_id: this.props.order.selectedAddress.id,
      billing_address_id: this.props.order.selectedAddress.id,
      shipping_method: { [productData.store_id]: choosenShippingMethod },
      options: JSON.parse(this.current.router.params.options),
      options_name: this.current.router.params.options_name,
      qty: quantity,
      warehouse_id: 1,
      size: bulkSize,
    };
    let placeOrderResult = await bulkApply(productData.id, bulkId, data);
    Taro.redirectTo({
      url: "/pages/about-order/orders/orders",
    });
  };
  render() {
    const { addressList } = this.props.order;
    let {
      user,
      currency,
      showPayModal,
      payment,
      showAddressModal,
      showShippingModal,
      tmpShippingMethod,
      shippingMethod,
      shippingMethodList,
      shippingFee,
      productData,
      total,
      bulkPrice,
      bulkSize,
      selectedAddress,
      paymentMethodList,
      quantity,
      bulkId,
    } = this.state;
    console.log("------shippingMethodList-----");
    console.log(shippingMethodList);
    let optionsName = this.current.router.params.options_name;
    console.log(optionsName);
    return (
      <View className="confirm-order">
        <Navbar title={Taro.T._("newbulk")} />
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
        <View className="confirm-order-bulksize">
          {productData.bulk_price
            ? bulkId != ""
              ? Object.keys(productData.bulk_price).map((bulkman) => {
                  return bulkman == bulkSize ? (
                    <View
                      className="confirm-order-bulksize-option"
                      style={{
                        border: "1px solid #d62c75",
                      }}
                    >
                      <View>
                        <Text className="confirm-order-bulksize-option-price">
                          {currency.symbol +
                            parseFloat(productData.bulk_price[bulkman]).toFixed(
                              2
                            )}
                        </Text>
                      </View>
                      <View>
                        <Text className="confirm-order-bulksize-option-desc">
                          {bulkman + Taro.T._("bulkpeople")}
                        </Text>
                      </View>
                    </View>
                  ) : null;
                })
              : Object.keys(productData.bulk_price).map((bulkman) => {
                  return (
                    <View
                      className="confirm-order-bulksize-option"
                      onClick={() => {
                        this.setState({
                          bulkSize: bulkman,
                          bulkPrice: productData.bulk_price[bulkman],
                          total:
                            parseFloat(productData.bulk_price[bulkman]) *
                            quantity,
                        });
                      }}
                      style={
                        bulkman == bulkSize
                          ? {
                              border: "1px solid #d62c75",
                            }
                          : ""
                      }
                    >
                      <View>
                        <Text className="confirm-order-bulksize-option-price">
                          {currency.symbol +
                            parseFloat(productData.bulk_price[bulkman]).toFixed(
                              2
                            )}
                        </Text>
                      </View>
                      <View>
                        <Text className="confirm-order-bulksize-option-desc">
                          {bulkman + Taro.T._("bulkpeople")}
                        </Text>
                      </View>
                    </View>
                  );
                })
            : null}
        </View>
        <View className="confirm-order-product">
          <View className="confirm-order-product-container">
            <View className="confirm-order-product-container-imgc">
              <Image
                src={this.current.router.params.options_image}
                className="confirm-order-product-container-imgc-img"
              />
            </View>
            <View className="confirm-order-product-container-detail">
              <View>
                <Text>{productData.name}</Text>
              </View>
              <View className="confirm-order-product-container-detail-option">
                <Text>{optionsName}</Text>
              </View>
              <View className="confirm-order-product-container-detail-option">
                <Text>X {this.current.router.params.quantity}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="confirm-order-totalview">
          <View className="confirm-order-product-store-shippingmethod">
            {shippingMethod.code ? (
              <Text onClick={() => this.handleChooseShippingMethodPanel()}>
                {Taro.T._("shippingmethod") + ": " + shippingMethod.label}
              </Text>
            ) : (
              <Text onClick={() => this.handleChooseShippingMethodPanel()}>
                {Taro.T._("shippingmethod") + ": "}
              </Text>
            )}
          </View>

          <View className="confirm-order-totalview-subtotal">
            <Text>
              {Taro.T._("subtotal")}：
              {currency.symbol + parseFloat(total).toFixed(2)}
            </Text>
          </View>
          <View className="confirm-order-totalview-discount">
            <Text>
              {Taro.T._("shippingfee")}：
              {currency.symbol + parseFloat(shippingFee).toFixed(2)}
            </Text>
          </View>
        </View>
        <View className="confirm-order-confirm">
          <Text>{Taro.T._("total")}：</Text>
          <Text style={{ fontWeight: "bold", color: "#D62C75" }}>
            {currency.symbol} {(parseFloat(total) + shippingFee).toFixed(2)}
          </Text>
          <View
            className="confirm-order-confirm-button"
            onClick={() => this.handleNewBulkButton()}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {Taro.T._("newbulk")}
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
              {(parseFloat(total) + shippingFee).toFixed(2)}
            </Text>
          </View>
          {Object.keys(paymentMethodList).map((item) => (
            <View
              className="confirm-order-alert-pay"
              onClick={() => this.setState({ payment: item })}
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
          {Object.keys(shippingMethodList).map((code) => {
            return (
              <AtActionSheetItem
                onClick={() => {
                  this.chooseShippingMethod(code);
                }}
              >
                {shippingMethodList[code].label}(
                {currency.symbol + shippingMethodList[code].fee})
              </AtActionSheetItem>
            );
          })}
        </AtActionSheet>
      </View>
    );
  }
}

const mapStateToProps = ({ order, cart }) => ({
  order,
  cart: cart,
});

export default connect(mapStateToProps)(BulkOrder);
