import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView, Text, Image } from "@tarojs/components";
import { connect } from "react-redux";
import { requestSearchProduct } from "../../../store/actions/product";
import Navbar from "../../../component/navbarTitle/index";
import "./search-product.scss";
import { CURRENCY } from "../../../utils/constant";
class SearchProduct extends Component {
  current = getCurrentInstance();
  config = {
    navigationBarTitleText: "产品",
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
  };
  state = {
    page: 1,
    keyword: this.current.router.params.keyword,
  };
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let { keyword, page } = this.state;
    this.props.dispatch(requestSearchProduct(keyword, page, 20));
    let currency = Taro.getStorageSync(CURRENCY);
    this.setState({ currency: currency });
  }

  onPullDownRefresh = () => {
    let { keyword, page } = this.state;
    this.props.dispatch(requestSearchProduct(keyword, page, 20));
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  loadMore = () => {
    console.log("load more");
    let { keyword, page } = this.state;
    this.props.dispatch(requestSearchProduct(keyword, page + 1, 20));
    this.setState({ page: page + 1 });
  };
  handleClick = (productId) => {
    Taro.navigateTo({
      url: `/pages/about-product/product-detail/product-detail?productId=${productId}`,
    });
  };
  render() {
    const height = Taro.getSystemInfoSync().windowHeight;
    const searchProduct = this.props.searchProduct;
    let { keyword, currency } = this.state;
    return (
      <View style={{ position: "relative", overflow: "hidden" }}>
        <Navbar title={keyword != "" ? keyword : Taro.T._("searchproduct")} />
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
          <View className="container">
            {searchProduct && searchProduct.length > 0
              ? searchProduct.map((item, idx) => {
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
                        <Text className="container-item-price-msrp">
                          {currency && currency.symbol ? currency.symbol : null}
                          {parseFloat(info.price).toFixed(2)}
                        </Text>
                        <Text> </Text>
                        <Text className="container-item-price-or">
                          {currency && currency.symbol ? currency.symbol : null}
                          {parseFloat(info.price).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ searchProduct }) => ({
  searchProduct: searchProduct.searchProduct,
});
export default connect(mapStateToProps)(SearchProduct);
