import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Input, Button, Text, Image } from "@tarojs/components";
import { AtInput, AtIcon, AtButton, AtFloatLayout } from "taro-ui";
import "./charge-balance.scss";
import { chargeBalanceOrder } from "../../../api/request";
import Navbar from "../../../component/navbarTitle/index";
import { CURRENCY, USER } from "../../../utils/constant";
import { connect } from "react-redux";
import { requestPayment } from "../../../store/actions/order";
class ChargeBalance extends Component {
  current = getCurrentInstance();
  config = {
    navigationBarTitleText: "charge balance",
  };

  constructor(props) {
    super(props);
  }
  state = {
    amount: 1,
    showPayModal: false,
    payment: "",
    currency: {},
    user: {},
  };
  componentDidMount() {
    this.props.dispatch(requestPayment());
    let user = Taro.getStorageSync(USER);
    if (!user.id) {
      Taro.redirectTo({ url: "/pages/about-personal/user-login/user-loagin" });
    }
    let currency = Taro.getStorageSync(CURRENCY);
    console.log("getStorageSync currency:");
    console.log(currency);
    this.setState({ currency: currency });
  }
  handleAmountChange(value) {
    this.setState({
      amount: value,
    });
    return value;
  }
  toCreateOrder = async () => {
    let { payment, amount } = this.state;
    let orderinfo = await chargeBalanceOrder(amount, payment);
    console.log(orderinfo);
  };
  render() {
    const { paymentMethodList } = this.props.order;
    let { amount, showPayModal, currency, payment } = this.state;
    return (
      <View className="charge-balance">
        <Navbar title={Taro.T._("chargebalance")} />
        <View className="charge-balance-title">
          <Text>{Taro.T._("chargebalance")}</Text>
        </View>
        <View>
          <AtInput
            name="amount"
            type="number"
            title={Taro.T._("topupamount")}
            placeholder={Taro.T._("topupamount")}
            value={amount}
            onChange={this.handleAmountChange.bind(this)}
          />
        </View>
        <View className="charge-balance-action">
          <AtButton
            type="primary"
            onClick={() => this.setState({ showPayModal: true })}
          >
            {Taro.T._("topay")}
          </AtButton>
        </View>
        {/*choose payment method start*/}
        <AtFloatLayout
          title={Taro.T._("confirmpayment")}
          isOpened={showPayModal}
          className="charge-balance-alert"
        >
          <View className="charge-balance-alert-account">
            <Text>{amount}</Text>
          </View>
          {Object.keys(paymentMethodList).map((item) => (
            <View
              className="charge-balance-alert-pay"
              onClick={() => this.setState({ payment: item })}
            >
              <Text className="charge-balance-alert-pay-text">
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
                className="charge-balance-alert-pay-icon"
              />
            </View>
          ))}
          <View
            className="charge-balance-alert-button"
            onClick={this.toCreateOrder}
          >
            <Text style={{ color: "white" }}>{Taro.T._("confirmandpay")}</Text>
          </View>
        </AtFloatLayout>
        {/*choose payment method end*/}
      </View>
    );
  }
}
const mapStateToProps = ({ order, cart }) => ({
  order,
  cart: cart,
});

export default connect(mapStateToProps)(ChargeBalance);
