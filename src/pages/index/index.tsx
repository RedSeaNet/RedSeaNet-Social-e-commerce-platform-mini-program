import React, { Component } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";
import { View, Text } from "@tarojs/components";
import MySwiper from "../../component/index/MySwiper";
import HomeCategory from "./category";
import { connect } from "react-redux";
import {
  requestProductCategory,
  requestHomeProduct,
} from "../../store/actions/product";
import { requestCart } from "../../store/actions/cart";
import NavbarIndex from "../../component/navbarIndex/index";
import HomeProduct from "./products/products";
import { USER, TOKEN, LOCALEID, LOCALE } from "../../utils/constant";
import { AtToast, AtSearchBar, AtIcon } from "taro-ui";
import T from "../../utils/i18n";
import locales from "../../utils/locales";
import {requestBanner} from "./../../store/actions/banner"
import {
  requestMyUnreadNotificationList,
  requestSystemUnreadNotificationList,
} from "../../store/actions/notification";
class Index extends Component {
  constructor(props) {
    super(props);
    if (!Taro.T) {
      Taro.setStorage({ key: LOCALEID, data: 2 });
      Taro.setStorage({ key: LOCALE, data: "zh" });
      Taro.T = new T(locales, "zh");
    }
  }
  config = {
    navigationBarTitleText: "首页",
  };
  state = { user: {}, cart: {}, searchKeyworkds: "" };

  async componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
    });
  }

  async componentDidMount() {
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.props.dispatch(requestCart());
      this.setState({ user: userData, cart: this.props.cart.cart });
      this.props.dispatch(requestMyUnreadNotificationList({ page: 1 }));
      this.props.dispatch(requestSystemUnreadNotificationList({ page: 1 }));
      let notificationCount = this.props.unreadMyNotification
        .unreadMyNotification
        ? this.props.unreadMyNotification.unreadMyNotification.length
        : 0 + this.props.unreadMyNotification.unreadSystemNotification
        ? this.props.unreadMyNotification.unreadSystemNotification
        : 0;
      Taro.setTabBarBadge({
        index: 2,
        text: "" + notificationCount,
      });
    }
    this.props.dispatch(requestProductCategory());
    this.props.dispatch(requestHomeProduct([51], 1));
    this.props.dispatch(requestBanner('miniprogramhome'));
    Taro.eventCenter.on("cartChange", () => {
      console.log("home Taro.eventCenter--");
      let productCount = this.props.cart.cart.productCount
        ? this.props.cart.cart.productCount
        : 0;
      Taro.setTabBarBadge({
        index: 3,
        text: "" + productCount,
      });
    });

    if (Taro.canIUse("getUpdateManager")) {
      const updateManager = Taro.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log("========res.hasUpdate==========");
        console.log(res.hasUpdate);
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            Taro.showModal({
              title: Taro.T._("newversionremind"),
              content: Taro.T._("newversionreadandgotoupdate") + "?",
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              },
            });
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            Taro.showModal({
              title: Taro.T._("foundnewversion"),
              content: Taro.T._("deletetheappandresearchandinstall") + "...",
            });
          });
        }
      });
    }
  }
  onPullDownRefresh = () => {
    this.props.dispatch(requestProductCategory());
    this.props.dispatch(requestHomeProduct([51], 1));
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  keywordsSearch = (e) => {
    this.setState({ searchKeyworkds: e });
  };
  searchAction = () => {
    const { searchKeyworkds } = this.state;
    if (searchKeyworkds == "") {
      Taro.showToast({
        title: "Please enter search keyword!",
        icon: "none",
        duration: 2000,
      });
      return false;
    } else {
      Taro.navigateTo({
        url: `/pages/about-product/search-product/search-product?keyword=${searchKeyworkds}`,
      });
    }
  };
  onShareAppMessage = (res) => {
    return {
      title: "红海互联 RedSea Mall",
      imageUrl:
        "https://store.redseanet.com/pub/theme/blue/frontend/images/logo.png",
      path: "pages/index/index",
      desc: "红海互联多语言多货币社交电商系统",
    };
  };
  onShareTimeline = (res) => {
    return {
      title: "红海互联 RedSea Mall",
      imageUrl:
        "https://store.redseanet.com/pub/theme/blue/frontend/images/logo.png",
      path: "pages/index/index",
      desc: "红海互联多语言多货币社交电商系统",
    };
  };
  render() {
    const { productCategoryList } = this.props.category;
    const { homeProduct } = this.props.homeProduct;
    let { searchKeyworkds } = this.state;
    return (
      <View style={" position: relative;"}>
        <NavbarIndex />
        <View className="searchview">
          <AtSearchBar
            inputType="text"
            value={searchKeyworkds}
            onChange={this.keywordsSearch}
            actionName={Taro.T._("search")}
            placeholder={Taro.T._("searchproduct")}
            onActionClick={this.searchAction}
            className="searchview-searchInput"
            height="6vh"
          />
        </View>
        <MySwiper />
        <View className="recomment">
          <View className="recomment-item">
            <AtIcon value="check-circle" size="20" color="#d62c75"></AtIcon>
            <Text>红海精选</Text>
          </View>
          <View className="recomment-item">
            <AtIcon value="check-circle" size="20" color="#d62c75"></AtIcon>
            <Text>产品直供</Text>
          </View>
          <View className="recomment-item">
            <AtIcon value="check-circle" size="20" color="#d62c75"></AtIcon>
            <Text>保证正品</Text>
          </View>
          <View className="recomment-item">
            <AtIcon value="check-circle" size="20" color="#d62c75"></AtIcon>
            <Text>平台售后</Text>
          </View>
        </View>
        <HomeCategory list={productCategoryList} />
        <HomeProduct list={homeProduct} />
      </View>
    );
  }
}
export default connect(
  ({
    category,
    homeProduct,
    cart,
    unreadMyNotification,
    unreadSystemNotification,
    banner
  }) => ({
    category,
    homeProduct,
    cart,
    unreadMyNotification,
    unreadSystemNotification,
    banner
  })
)(Index);
