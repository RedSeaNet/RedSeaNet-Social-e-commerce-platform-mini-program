import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView, Text, Image } from "@tarojs/components";
import { connect } from "react-redux";
import Navbar from "../../../component/navbarTitle/index";
import "./history-list.scss";
import { getProductsVisitHistoryList } from "./../../../api/request";
import EmptyTemplate from "../../../component/emptyTemplate/index";
class HistoryList extends Component {
  current = getCurrentInstance();
  config = {
    navigationBarTitleText: "History List",
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
  };
  state = {
    page: 1,
    list: [],
  };
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let { page } = this.state;
    getProductsVisitHistoryList(page, 20).then((data) => {
      this.setState({ list: data });
    });
  }

  onPullDownRefresh = () => {
    let { page } = this.state;
    getProductsVisitHistoryList(page, 20).then((data) => {
      this.setState({ list: data });
    });
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  loadMore = () => {
    console.log("load more");
    let { page, list } = this.state;
    getProductsVisitHistoryList(page + 1, 20).then((data) => {
      data.map((item) => {
        list.push(item);
      });
    });
    this.setState({ page: page + 1, list: list });
  };
  handleClick = (productId) => {
    Taro.navigateTo({
      url: `/pages/about-product/product-detail/product-detail?productId=${productId}`,
    });
  };
  render() {
    const height = Taro.getSystemInfoSync().windowHeight;
    const { list } = this.state;
    return (
      <View style={{ position: "relative", overflow: "hidden" }}>
        <Navbar title={Taro.T._("browsinghistory")} />
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
            {list && list.length > 0 ? (
              list.map((item, idx) => {
                let url = require("./../../../assets/placeholder.png");
                if (
                  item.images &&
                  item.images.length > 0 &&
                  item.images[0] &&
                  item.images[0].src
                ) {
                  url = item.images[0].src;
                }
                return (
                  <View
                    className="container-item"
                    key={item.product_id}
                    onClick={() => this.handleClick(item.product_id)}
                  >
                    <Image
                      src={url}
                      className="container-item-img"
                      mode="widthFix"
                      onLoad={() => {
                        console.log("onLoad完成");
                      }}
                    />
                    <Text className="container-item-desc">
                      {item.product_name}
                    </Text>
                    <View className="container-item-price">
                      <Text>￥ {parseFloat(item.price).toFixed(2)}</Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <EmptyTemplate title={Taro.T._("thereisnohistory")} />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user: user,
});
export default connect(mapStateToProps)(HistoryList);
