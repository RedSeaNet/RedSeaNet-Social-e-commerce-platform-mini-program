import Taro from "@tarojs/taro";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import "./index.scss";
import { connect } from "react-redux";
import { bargainList } from "./../../../api/request";
import EmptyTemplate from "../../../component/emptyTemplate/index";
import Navbar from "../../../component/navbarTitle/index";
import React, { Component } from "react";
import locales from "../../../utils/locales";
import T from "../../../utils/i18n";
class BargainList extends Component {
  constructor(props) {
    super(props);
    if (!Taro.T) {
      Taro.T = new T(locales, "zh");
    }
    console.log("bargain-list.constructor.1");
    this.state = {
      page: 1,
      bargains: [],
      currency: {},
    };
  }
  async componentWillMount() {
    console.log("bargain-list.componentWillMount.1");
  }

  async componentDidShow() {
    //console.log("bargain-list.componentDidShow.1");
    let enterOptions = Taro.getEnterOptionsSync();
    console.log(enterOptions);
    if (
      enterOptions.scene === 1065 &&
      enterOptions.path === "pages/about-order/bargain-list/bargain-list"
    ) {
      //await resetBarginUrlScheme(0);
    }
  }

  async componentDidMount() {
    console.log("bargain-list.componentDidMount.1");
    Taro.setNavigationBarTitle({ title: Taro.T._("bargainList") });
    let bargainsResult = await bargainList();
    console.log("------bargainsResult------");
    console.log(bargainsResult);
    if (bargainsResult.bargains && bargainsResult.bargains.length > 0) {
      this.setState({
        bargains: bargainsResult.bargains,
        page: 1,
        currency: bargainsResult.currency,
      });
    }
  }
  onShareAppMessage = (res) => {
    return {
      title: "红海互联 RedSea Mall",
      path: `/pages/about-order/bargain-list/bargain-list`,
      imageUrl:
        "https://store.redseanet.com/pub/theme/blue/frontend/images/logo.png",
      desc: "红海互联多语言多货币社交电商系统",
    };
  };
  loadMore = async () => {
    console.log("-------loadMore-------");
  };
  render() {
    const height = Taro.getSystemInfoSync().windowHeight;
    let { bargains, currency } = this.state;
    return (
      <View className="bargains">
        <Navbar title={Taro.T._("bargains")} />
        <ScrollView
          scrollY
          scrollTop="0"
          style={{ height: height + "px" }}
          lowerThreshold="20"
          upperThreshold="20"
          onScrollToLower={() => {
            this.loadMore();
          }}
        >
          <View className="bargains-header"></View>
          <View className="bargains-content">
            <View className="bargains-content-listView">
              {bargains.length > 0 ? (
                bargains.map((item, idx) => {
                  return (
                    <View
                      className="bargains-content-listView-itemView"
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/about-order/bargain-detail/bargain-detail?bargain_id=${item.id}`,
                        });
                      }}
                      key={"bargain" + idx}
                    >
                      <Image
                        src={item.thumbnail[0]}
                        className="bargains-content-listView-itemView-leftImage"
                      />
                      <View className="bargains-content-listView-itemView-rightView">
                        <View className="bargains-content-listView-itemView-rightView-title">
                          <Text>{item.name}</Text>
                        </View>
                        <View className="bargains-content-listView-itemView-rightView-created">
                          <Text>
                            {item.bargains_user_help_total}{" "}
                            {Taro.T._("friendsparticipation")}{" "}
                          </Text>
                        </View>
                        <View className="bargains-content-listView-itemView-rightView-minPrice">
                          <Text>
                            {Taro.T._("minprice")}{" "}
                            {currency.symbol ? currency.symbol : ""}
                            {parseFloat(item.min_price).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <EmptyTemplate title={Taro.T._("nonebargins")} />
              )}
            </View>
          </View>
          {/* <View>
            <Text
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/about-order/bargain-detail/bargain-detail?bargain_id=3&bargain_case_id=11`,
                });
              }}
            >
              /about-order/bargain-detail/bargain-detail?bargain_id=3&bargain_case_id=11
            </Text>
            <Text> ||||| </Text>
            <Text
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/about-order/bargain-detail/bargain-detail?bargain_id=3&bargain_case_id=11`,
                });
              }}
            >
              /about-order/bargain-detail/bargain-detail?bargain_id=3&bargain_case_id=11
            </Text>
          </View> */}
        </ScrollView>
      </View>
    );
  }
}
export default connect(({ shop, cart }) => ({ shop, cart: cart.cart }))(
  BargainList
);
