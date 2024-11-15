import React, { Component } from "react";
import Taro from "@tarojs/taro";
import "./cart.scss";
// import "../../assets/iconfont/myIconfont.scss";
import { View, ScrollView, Image, Text } from "@tarojs/components";
import { CURRENCY } from "../../../utils/constant";
import {
  changeCart,
  requestCart,
  requestChangeStatusCart,
} from "../../../store/actions/cart";
import { connect } from "react-redux";
import CartItem from "./cart-item/cart-item";
import { AtIcon, AtButton } from "taro-ui";
import { getPrice } from "../../../utils/getPrice";
import { USER, WINDOW_HEIGHT, WINDOW_WIDTH } from "../../../utils/constant";
import NavbarIndex from "../../../component/navbarIndex/index";

class Cart extends Component {
  static options = {
    addGlobalClass: true,
  };

  constructor(props) {
    super(props);
  }
  config = {
    navigationBarTitleText: "购物车",
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
  };

  state = {
    login: false,
    currency: {},
  };

  componentDidMount() {
    let user = Taro.getStorageSync(USER);
    if (user) {
      this.props.dispatch(requestCart());
      this.setState({ login: true });
    }
    let currency = Taro.getStorageSync(CURRENCY);
    this.setState({ currency: currency });
  }

  componentWillUnmount() {}

  componentDidShow() {
    let user = Taro.getStorageSync(USER);
    if (user) {
      this.setState({ login: true });
    } else {
      this.setState({ login: false });
    }
    let productCount = this.props.cart.cart.productCount
      ? this.props.cart.cart.productCount
      : 0;
    console.log("productCount:" + productCount);
    Taro.setTabBarBadge({
      index: 3,
      text: "" + productCount,
    });
    this.props.dispatch(requestCart());
  }

  componentDidHide() {}

  onPullDownRefresh = () => {
    this.props.dispatch(requestCart());
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  handleSelectAll = () => {
    let cartObj = this.props.cart.cart;
    let ids = [];
    Object.keys(cartObj.items).map((index) => {
      cartObj.items[index].map((item) => {
        ids.push(item.id);
      });
    });
    let actionType = 1;
    if (cartObj.selectAll) {
      actionType = 0;
    } else {
      actionType = 1;
    }
    this.props.dispatch(requestChangeStatusCart(ids, actionType));
  };

  render() {
    let { cart } = this.props.cart;
    let selectedAll = cart.selectAll;
    let { currency, login } = this.state;
    return (
      <View className="cart-container">
        <NavbarIndex />
        {!login ? (
          <View
            className="cart-container-login"
            onClick={() =>
              Taro.navigateTo({
                url: `/pages/about-personal/user-login/user-login`,
              })
            }
          >
            <View className="cart-container-login-icon">
              <Image
                className="cart-container-login-icon-img"
                src={require("./../../../assets/cart.png")}
                mode="widthFix"
              />
            </View>
            <View className="cart-container-login-button">
              <Text style={{ color: "white" }}>{Taro.T._("login")}</Text>
            </View>
          </View>
        ) : cart.items && cart.items.length > 0 ? (
          <View className="cart-container-has">
            <View className="cart-container-has-buy">
              {selectedAll ? (
                <AtIcon
                  value="check-circle"
                  size="20"
                  color="#d62c75"
                  onClick={() => this.handleSelectAll()}
                />
              ) : (
                <AtIcon
                  value="close-circle"
                  size="20"
                  color="#707070"
                  onClick={() => this.handleSelectAll()}
                />
              )}
              <Text className="cart-container-has-edit-selectAll">
                {Taro.T._("selectall")}
              </Text>
              <Text className="cart-container-has-buy-money">
                {currency.symbol}
                {cart.subtotal ? parseFloat(cart.subtotal).toFixed(2) : 0}
              </Text>
              <View
                className="cart-container-has-buy-buy"
                onClick={() =>
                  Taro.navigateTo({
                    url: "/pages/about-order/confirm-order/confirm-order",
                  })
                }
              >
                <Text className="cart-container-has-buy-buy-text">
                  {Taro.T._("checkout")}
                </Text>
              </View>
            </View>
            <View
              className="cart-container-has-edit"
              style={!login ? { display: "none" } : null}
            >
              {selectedAll ? (
                <AtIcon
                  value="check-circle"
                  size="20"
                  color="#d62c75"
                  onClick={() => this.handleSelectAll()}
                />
              ) : (
                <AtIcon
                  value="close-circle"
                  size="20"
                  color="#707070"
                  onClick={() => this.handleSelectAll()}
                />
              )}{" "}
              <Text className="cart-container-has-edit-selectAll">
                {Taro.T._("selectall")}
              </Text>
            </View>
            {cart.items && cart.items.length > 0
              ? Object.keys(cart.items).map((storeId) => {
                  return (
                    <View>
                      <View className="cart-container-has-store">
                        <Image
                          src={require("../../../assets/store-ico.png")}
                          className="cart-container-has-store-icon"
                        />
                        <Text>{cart.items[storeId][0].store_name}</Text>
                      </View>
                      {cart.items[storeId].map((item) => {
                        return (
                          <CartItem
                            {...item}
                            handleSelect={(store_id, id) => {
                              this.handleSelect(store_id, id);
                            }}
                            currency={currency}
                          />
                        );
                      })}
                    </View>
                  );
                })
              : null}
          </View>
        ) : (
          <View className="cart-container-empty">
            <Image
              src={require("./../../../assets/cart.png")}
              mode="widthFix"
              className="cart-container-empty-icon"
            />
            <View
              className="cart-container-empty-title"
              onClick={() => {
                Taro.switchTab({ url: "/pages/index/index" });
              }}
            >
              <Text>{Taro.T._("cartempty")}!</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({ cart }) => ({
  cart: cart,
});

export default connect(mapStateToProps)(Cart);
