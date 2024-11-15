import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView, Text, Image } from "@tarojs/components";
import { connect } from "react-redux";
import { requestWishList } from "../../../store/actions/wishlist";
import Navbar from "../../../component/navbarTitle/index";
import "./wish-list.scss";
import EmptyTemplate from "../../../component/emptyTemplate/index";
class WishList extends Component {
  current = getCurrentInstance();
  config = {
    navigationBarTitleText: "Wish List",
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
  };
  state = {
    page: 1,
  };
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let { page } = this.state;
    this.props.dispatch(requestWishList(page, 20));
  }

  onPullDownRefresh = () => {
    let { page } = this.state;
    this.props.dispatch(requestWishList(page, 20));
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  loadMore = () => {
    console.log("load more");
    let { page } = this.state;
    this.props.dispatch(requestWishList(page + 1, 20));
    this.setState({ page: page + 1 });
  };
  handleClick = (productId) => {
    Taro.navigateTo({
      url: `/pages/about-product/product-detail/product-detail?productId=${productId}`,
    });
  };
  render() {
    const height = Taro.getSystemInfoSync().windowHeight;
    const { wishlist } = this.props.wishlist;
    return (
      <View style={{ position: "relative", overflow: "hidden" }}>
        <Navbar title={Taro.T._("favorite")} />
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
            {wishlist && wishlist.length > 0 ? (
              wishlist.map((item, idx) => {
                let url = require("./../../../assets/placeholder.png");
                if (item.image != "") {
                  url = item.image;
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
              <EmptyTemplate title={Taro.T._("thereisnowish")} />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ user, wishlist }) => ({
  user: user,
  wishlist: wishlist,
});
export default connect(mapStateToProps)(WishList);
