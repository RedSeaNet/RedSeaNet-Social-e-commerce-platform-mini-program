import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { connect } from "react-redux";
import "./products.scss";
import { View, Image, Text } from "@tarojs/components";
import { CURRENCY } from "../../../utils/constant";
class Products extends Component {
  current = getCurrentInstance();
  state = {
    finishLoadFlag: false,
    currency: {},
  };
  constructor(props) {
    super(props);
  }

  handleClick = (productId) => {
    Taro.navigateTo({
      url: `/pages/about-product/product-detail/product-detail?productId=${productId}`,
    });
  };
  componentDidMount() {
    let currency = Taro.getStorageSync(CURRENCY);
    this.setState({ currency: currency });
  }
  render() {
    const height = Taro.getSystemInfoSync().windowHeight;
    const homeProduct = this.props.homeProduct.homeProduct;
    let { currency } = this.state;
    return (
      <View>
        <View className="container">
          {homeProduct && homeProduct.length > 0
            ? homeProduct.map((item, idx) => {
                const info = JSON.parse(item);
                let url = require("./../../../assets/placeholder.png");
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
                      <Text className="container-item-price-or">
                        {currency.symbol}
                        {parseFloat(info.price).toFixed(2)}
                      </Text>
                      <Text> </Text>
                      <Text className="container-item-price-msrp">
                        {currency.symbol}
                        {parseFloat(info.msrp).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                );
              })
            : null}
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ homeProduct }) => ({
  homeProduct: homeProduct,
});
export default connect(mapStateToProps)(Products);
