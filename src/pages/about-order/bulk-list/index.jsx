import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import "./index.scss";
import Navbar from "./../../../component/navbarTitle";
import { bulkList } from "./../../../api/request";
export default class BulkList extends Component {
  state = {
    bulks: [],
    loading: false,
    page: 1,
  };
  componentWillMount() {}

  componentDidMount() {
    let condition = {};
    condition["page"] = 1;
    bulkList(condition).then((data) => {
      this.setState({ bulks: data });
    });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  handleClick = (productId) => {
    Taro.navigateTo({
      url: `/pages/about-order/bulk-detail/bulk-detail?productId=${productId}`,
    });
  };
  render() {
    let { bulks } = this.state;
    return (
      <ScrollView className="bulkc">
        <Navbar title={Taro.T._("bulk")} />
        {bulks.products && bulks.products.length > 0
          ? bulks.products.map((bulk, key) => {
              let bulk_price = Object.values(bulk.bulk_price);
              return (
                <View
                  className="bulkc-itemc"
                  onClick={() => this.handleClick(bulk.id)}
                >
                  <View className="bulkc-itemc-left">
                    <Image
                      src={bulk.images[0].src}
                      className="bulkc-itemc-left-image"
                      mode="widthFix"
                    />
                  </View>
                  <View className="bulkc-itemc-right">
                    <View>{bulk.name}</View>
                    <View className="bulkc-itemc-right-bottom">
                      <View className="bulkc-itemc-right-bottom-pricec">
                        <Text className="bulkc-itemc-right-bottom-pricec-o">
                          {bulks.currency.symbol +
                            parseFloat(bulk.price).toFixed(2)}
                        </Text>
                        <Text className="bulkc-itemc-right-bottom-pricec-b">
                          {bulks.currency.symbol +
                            parseFloat(
                              bulk_price[bulk_price.length - 1]
                            ).toFixed(2)}
                        </Text>
                      </View>
                      <View className="bulkc-itemc-right-bottom-action">
                        <Text>{Taro.T._("tobulk")}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          : null}
      </ScrollView>
    );
  }
}
