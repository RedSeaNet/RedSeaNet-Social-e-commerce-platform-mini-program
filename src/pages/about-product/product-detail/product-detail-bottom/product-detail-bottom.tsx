import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./product-detail-bottom.scss";
import { AtIcon, AtBadge } from "taro-ui";
export default class ProductDetailBottom extends Component {
  render() {
    return (
      <View className="product-detail-bottom-container">
        <View
          className="product-detail-bottom-container-item"
          onClick={() => {
            Taro.switchTab({
              url: `/pages/index/index`,
            });
          }}
        >
          <AtIcon value="home" size="24" color="rgb(181,181,181)" />
          <Text className="product-detail-bottom-container-item-text">
            {Taro.T._("home")}
          </Text>
        </View>
        <View className="product-detail-bottom-container-item">
          <View
            className="product-detail-bottom-container-item-button"
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/about-personal/chat/chat?customerId=${this.props.retailerManagerId}`,
              });
            }}
          >
            <AtIcon value="phone" size="24" color="rgb(181,181,181)" />
            <Text className="product-detail-bottom-container-item-button-text">
              {Taro.T._("customerservice")}
            </Text>
          </View>
        </View>
        <View
          className="product-detail-bottom-container-item"
          onClick={() => {
            Taro.switchTab({
              url: `/pages/index/cart/cart`,
            });
          }}
        >
          <AtBadge value={this.props.productCount}>
            <AtIcon value="shopping-cart" size="24" color="rgb(181,181,181)" />
          </AtBadge>
          <Text className="product-detail-bottom-container-item-text">
            {Taro.T._("cart")}
          </Text>
        </View>
        <View className="product-detail-bottom-container-left">
          <Text
            className="product-detail-bottom-container-left-text"
            onClick={() => this.props.handleWishClick()}
          >
            {Taro.T._("favoritedpost")}
          </Text>
        </View>
        <View
          className="product-detail-bottom-container-right"
          onClick={() => this.props.handleClick()}
        >
          <Text className="product-detail-bottom-container-right-text">
            {Taro.T._("addtocart")}
          </Text>
        </View>
      </View>
    );
  }
}
