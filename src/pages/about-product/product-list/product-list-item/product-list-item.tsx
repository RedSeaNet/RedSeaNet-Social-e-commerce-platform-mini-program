import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { connect } from "react-redux";
import "./product-list-item.scss";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import { CURRENCY } from "../../../../utils/constant";
class ProductListItem extends Component {
  current = getCurrentInstance();
  constructor(props) {
    super(props);
  }
  state = {
    finishLoadFlag: false,
    currency: {},
  };
  componentDidMount() {
    let currency = Taro.getStorageSync(CURRENCY);
    this.setState({ currency: currency });
  }
  handleClick = (productId) => {
    Taro.navigateTo({
      url: `/pages/about-product/product-detail/product-detail?productId=${productId}`,
    });
  };

  render() {
    const height = Taro.getSystemInfoSync().windowHeight;
    const productList = this.props.productList.products;
    let { currency } = this.state;
    return (
      <ScrollView
        scrollY
        scrollTop="0"
        style={{ height: height + "px" }}
        lowerThreshold="20"
        upperThreshold="20"
        onScrollToLower={() => {
          this.props.loadMore();
        }}
      >
        <View className="container">
          {productList && productList.length > 0
            ? productList.map((item, idx) => {
                const info = JSON.parse(item);
                let url = require("./../../../../assets/placeholder.png");
                if (info.images.length > 0) {
                  url = info.images[0].src;
                }
                return (
                  <View
                    className="container-item"
                    key={info.id}
                    onClick={() => this.handleClick(info.id)}
                  >
                    <Image
                      src={url}
                      className="container-item-img"
                      mode="widthFix"
                      onLoad={() => {
                        console.log("onLoad完成");
                      }}
                    />
                    <Text className="container-item-desc">{info.name}</Text>
                    <View className="container-item-price">
                      <Text className="container-item-price-msrp">
                        {currency.symbol ? currency.symbol : null}
                        {parseFloat(info.msrp).toFixed(2)}
                      </Text>
                      <Text> </Text>
                      <Text className="container-item-price-or">
                        {currency.symbol ? currency.symbol : null}
                        {parseFloat(info.price).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                );
              })
            : null}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ productInfo }) => ({
  productList: productInfo.productList,
});
export default connect(mapStateToProps)(ProductListItem);
