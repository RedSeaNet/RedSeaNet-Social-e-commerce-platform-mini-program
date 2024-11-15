import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import "./user.scss";
import { USER, LOCALE, LOCALEID, CURRENCY } from "../../../utils/constant";
import T from "../../../utils/i18n";
import { connect } from "react-redux";
import { AtIcon } from "taro-ui";
import { changeCart } from "../../../store/actions/cart";
import { requestCurrency } from "../../../store/actions/currency";
import { requestCoupons } from "../../../store/actions/coupons";
import { requestBalance } from "../../../store/actions/balance";
import locales from "../../../utils/locales";
class User extends Component {
  constructor(props) {
    super(props);
  }
  state = { user: {}, currency: {} };
  componentDidMount() {
    this.props.dispatch(requestCurrency());
    let currency = Taro.getStorageSync(CURRENCY);
    this.setState({ currency: currency });
    this.props.dispatch(requestCoupons());
    this.props.dispatch(requestBalance({ status: 1 }, 1, 20));
  }
  componentDidShow() {
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.setState({ user: userData });
    } else {
      Taro.navigateTo({ url: "/pages/about-personal/user-login/user-login" });
      Taro.showToast({
        title: Taro.T._("pleaseloginforcontinue") + "!",
        icon: "none",
        duration: 2000,
      });
    }
    let productCount = this.props.cart.cart.productCount
      ? this.props.cart.cart.productCount
      : 0;
    console.log("productCount:" + productCount);
    Taro.setTabBarBadge({
      index: 3,
      text: "" + productCount,
    });
  }
  config = {
    navigationBarTitleText: "User center",
  };

  showAlert = () => {
    Taro.showModal({
      title: Taro.T._("surelogoutmsg"),
    }).then((res) => {
      if (res.confirm) {
        this.logout();
      }
    });
  };
  handleLogout = () => {
    let locale = Taro.getStorageSync(LOCALE);
    let localeid = Taro.getStorageSync(LOCALEID);
    let currency = Taro.getStorageSync(CURRENCY);
    Taro.clearStorage();
    this.props.dispatch(changeCart([]));
    Taro.setTabBarBadge({
      index: 2,
      text: "0",
    });
    Taro.setStorage({ key: LOCALE, data: locale });
    Taro.setStorage({ key: LOCALEID, data: localeid });
    Taro.setStorage({ key: CURRENCY, data: currency });
    Taro.reLaunch({ url: "/pages/index/index" });
  };
  handerSwithLanguage = async (language, languageId) => {
    //await Taro.setStorage({key: LOCALE, data: 'zh'});
    Taro.setStorage({ key: LOCALE, data: language });
    Taro.setStorage({ key: LOCALEID, data: languageId });
    Taro.T = new T(locales, language);
    Taro.setTabBarItem({
      index: 0,
      text: Taro.T._("home"),
    });
    Taro.setTabBarItem({
      index: 1,
      text: Taro.T._("social"),
    }),
      Taro.setTabBarItem({
        index: 2,
        text: Taro.T._("message"),
      }),
      Taro.setTabBarItem({
        index: 3,
        text: Taro.T._("cart"),
      }),
      Taro.setTabBarItem({
        index: 4,
        text: Taro.T._("my"),
      });
    Taro.reLaunch({ url: "/pages/index/index" });
  };
  handerSwithCurrency = async (id, symbol, code) => {
    let currency = { code: code, id: id, symbol: symbol };
    console.log(currency);
    Taro.setStorage({ key: CURRENCY, data: currency });
    Taro.reLaunch({ url: "/pages/index/index" });
  };
  render() {
    let { user, currency } = this.state;
    let locale = Taro.getStorageSync(LOCALE);
    let { coupons } = this.props.coupons;
    let { wishlist } = this.props.wishlist;
    let { balance } = this.props.balance;
    console.log(coupons);
    return (
      <View className="user">
        <View className="user-header">
          <Image
            src={require("./../../../assets/arrow-left.png")}
            style={"width:20px;height:16px;padding:2px;"}
            onClick={() => {
              if (Taro.getCurrentPages().length > 1) {
                Taro.navigateBack();
              } else {
                Taro.switchTab({ url: "/pages/index/index" });
              }
            }}
          />
        </View>
        <View className="user-login">
          <View className="user-login-avatarandset">
            <View className="user-login-avatarandset-avatar">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  className="user-login-avatarandset-avatar-img"
                  onClick={() => {
                    Taro.navigateTo({
                      url: "/pages/about-personal/settings/user-info/user-info",
                    });
                  }}
                />
              ) : (
                <Image
                  src={require("./../../../assets/bgAvatar.png")}
                  className="user-login-avatarandset-avatar-img"
                  onClick={() =>
                    Taro.navigateTo({ url: `/pages/about-personal/user/user` })
                  }
                />
              )}
              <Text className="user-login-avatarandset-avatar-username">
                {user.username}
              </Text>
              <Text
                onClick={this.handleLogout}
                className="user-login-avatarandset-avatar-logout"
              >
                {Taro.T._("logout")}
              </Text>
            </View>
            <View className="user-login-avatarandset-set">
              <AtIcon
                value="settings"
                size="24"
                color="#333"
                onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/about-personal/settings/index",
                  });
                }}
              ></AtIcon>
            </View>
          </View>
          <View className="user-login-summary">
            <View
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-product/wish-list/wish-list",
                });
              }}
              className="user-login-summary-view"
            >
              <Text className="user-login-summary-view-number">
                {wishlist ? wishlist.length : 0}
              </Text>
              <Text className="user-login-summary-view-title">
                {Taro.T._("favorite")}
              </Text>
            </View>
            <View
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-personal/rewardpoints/rewardpoints",
                });
              }}
              className="user-login-summary-view"
            >
              <Text className="user-login-summary-view-number">
                {user.rewardpoints ? user.rewardpoints : 0}
              </Text>
              <Text className="user-login-summary-view-title">
                {Taro.T._("rewardpoints")}
              </Text>
            </View>
            <View
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-product/history-list/history-list",
                });
              }}
              className="user-login-summary-view"
            >
              <Text className="user-login-summary-view-number">0</Text>
              <Text className="user-login-summary-view-title">
                {Taro.T._("browsinghistory")}
              </Text>
            </View>
            <View
              onClick={() => {
                Taro.navigateTo({ url: "/pages/about-order/coupons/coupons" });
              }}
              className="user-login-summary-view"
            >
              <Text className="user-login-summary-view-number">
                {coupons ? coupons.length : 0}
              </Text>
              <Text className="user-login-summary-view-title">
                {Taro.T._("coupon")}
              </Text>
            </View>
          </View>
          <View className="user-login-rich">
            <View className="user-login-rich-v">
              <View
                className="user-login-rich-v-left"
                onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/about-personal/balances/balances",
                  });
                }}
              >
                <Text className="user-login-rich-v-left-amount">
                  {balance.total ? parseFloat(balance.total).toFixed(2) : 0.0}
                </Text>
                <Text>{Taro.T._("mybalance")}</Text>
              </View>
              <View className="user-login-rich-v-right">
                <Text
                  className="user-login-rich-v-right-button"
                  onClick={() => {
                    Taro.navigateTo({
                      url: "/pages/about-order/charge-balance/charge-balance",
                    });
                  }}
                >
                  {Taro.T._("topup")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="user-action">
          <View className="user-action-titleContainer">
            <Text
              className="user-action-titleContainer-title"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-order/orders/orders",
                });
              }}
            >
              {Taro.T._("myorder")}
            </Text>
            <Text
              className="user-action-titleContainer-all"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-order/orders/orders",
                });
              }}
            >
              {Taro.T._("all")}
            </Text>
          </View>

          <View className="user-action-buttonview">
            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-order/orders/orders?statusId=2",
                });
              }}
            >
              <Image src={require("../../../assets/notPay.png")} />
              <Text>{Taro.T._("pendingpayment")}</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-order/orders/orders?statusId=1",
                });
              }}
            >
              <Image src={require("../../../assets/notShip.png")} />
              <Text>{Taro.T._("pending")}</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-order/orders/orders?statusId=4",
                });
              }}
            >
              <Image src={require("../../../assets/notReceipt.png")} />
              <Text>{Taro.T._("complete")}</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-order/orders/orders?statusId=2",
                });
              }}
            >
              <Image src={require("../../../assets/notEvaluation.png")} />
              <Text>{Taro.T._("waitappraise")}</Text>
            </View>
            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-order/orders/orders?statusId=2",
                });
              }}
            >
              <Image src={require("../../../assets/afterSale.png")} />
              <Text>{Taro.T._("refoundaftersales")}</Text>
            </View>
          </View>
        </View>

        <View className="user-action">
          <View className="user-action-titleContainer">
            <Text className="user-action-titleContainer-title">
              {Taro.T._("social")}
            </Text>
          </View>
          <View className="user-action-buttonview">
            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-find/publish-post/publish-post",
                });
              }}
            >
              <Image src={require("../../../assets/publishpost.png")} />
              <Text>{Taro.T._("publishpost")}</Text>
            </View>
            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-find/my-post/my-post",
                });
              }}
            >
              <Image src={require("../../../assets/mypost-list.png")} />
              <Text>{Taro.T._("mypostlist")}</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-find/my-reply/my-reply",
                });
              }}
            >
              <Image src={require("../../../assets/reply_list.png")} />
              <Text>{Taro.T._("repliesmanagement")}</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-find/my-liked/my-liked",
                });
              }}
            >
              <Image src={require("../../../assets/like_post_list.png")} />
              <Text>{Taro.T._("liked")}</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-find/my-favorited/my-favorited",
                });
              }}
            >
              <Image src={require("../../../assets/favoritedpost.png")} />
              <Text>{Taro.T._("favoritedpost")}</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-find/be-liked/be-liked",
                });
              }}
            >
              <Image src={require("../../../assets/beliked.png")} />
              <Text>{Taro.T._("beliked")}</Text>
            </View>
            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-find/be-favorited/be-favorited",
                });
              }}
            >
              <Image src={require("../../../assets/befavorited.png")} />
              <Text>{Taro.T._("befavorited")}</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-find/my-following/my-following",
                });
              }}
            >
              <Image src={require("../../../assets/following.png")} />
              <Text>{Taro.T._("following")}</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-find/my-fans/my-fans",
                });
              }}
            >
              <Image src={require("../../../assets/fans.png")} />
              <Text>{Taro.T._("fans")}</Text>
            </View>
          </View>
        </View>
        <View className="user-action">
          <View className="user-action-titleContainer">
            <Text className="user-action-titleContainer-title">
              {Taro.T._("services")}
            </Text>
          </View>
          <View className="user-action-buttonview">
            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({ url: "/pages/about-order/coupons/coupons" });
              }}
            >
              <Image src={require("../../../assets/coupon.png")} />
              <Text>{Taro.T._("coupon")}</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-personal/address/address-list/address-list",
                });
              }}
            >
              <Image src={require("../../../assets/address.png")} />
              <Text>{Taro.T._("address")}</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about-personal/contact-us/contact-us",
                });
              }}
            >
              <Image src={require("../../../assets/customerService.png")} />
              <Text>{Taro.T._("contactus")}</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                Taro.navigateTo({ url: "/pages/about-personal/help/help" });
              }}
            >
              <Image src={require("../../../assets/action.png")} />
              <Text>{Taro.T._("help")}</Text>
            </View>
          </View>
        </View>
        <View className="user-action">
          <View className="user-action-titleContainer">
            <Text className="user-action-titleContainer-title">
              {Taro.T._("language")}
            </Text>
          </View>
          <View className="user-action-buttonview">
            <View
              className="user-action-buttonview-button"
              onClick={() => {
                this.handerSwithLanguage("zh", "1");
              }}
              style={
                locale == "zh"
                  ? "background-color: rgb(207, 8, 94);color:#fff;"
                  : ""
              }
            >
              <Text>简体中文</Text>
            </View>

            <View
              className="user-action-buttonview-button"
              onClick={() => {
                this.handerSwithLanguage("zh_HK", "3");
              }}
              style={
                locale == "zh_HK"
                  ? "background-color: rgb(207, 8, 94);color:#fff;"
                  : ""
              }
            >
              <Text>繁體中文</Text>
            </View>
            <View
              className="user-action-buttonview-button"
              onClick={() => {
                this.handerSwithLanguage("en", "2");
              }}
              style={
                locale == "en"
                  ? "background-color: rgb(207, 8, 94);color:#fff;"
                  : ""
              }
            >
              <Text>English</Text>
            </View>
          </View>
        </View>

        <View className="user-action">
          <View className="user-action-titleContainer">
            <Text className="user-action-titleContainer-title">
              {Taro.T._("currency")}
            </Text>
          </View>
          <View className="user-action-buttonview">
            {this.props.currency &&
            this.props.currency.currency &&
            this.props.currency.currency.enable &&
            this.props.currency.currency.enable.length > 0
              ? this.props.currency.currency.enable.map((item, idx) => {
                  return (
                    <View
                      className="user-action-buttonview-button"
                      onClick={() => {
                        this.handerSwithCurrency(
                          item.id,
                          item.symbol,
                          item.code
                        );
                      }}
                      style={
                        currency.id == item.id
                          ? "background-color: rgb(207, 8, 94);color:#fff;"
                          : ""
                      }
                      key={idx}
                    >
                      <Text>{item.code}</Text>
                    </View>
                  );
                })
              : null}
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({
  user,
  cart,
  currency,
  coupons,
  wishlist,
  balance,
}) => ({
  user: user,
  cart: cart,
  currency: currency,
  coupons: coupons,
  wishlist: wishlist,
  balance: balance,
});
export default connect(mapStateToProps)(User);
