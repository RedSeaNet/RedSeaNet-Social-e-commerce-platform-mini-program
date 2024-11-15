import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import "./orders.scss";
import { View, ScrollView, Text, Image } from "@tarojs/components";
import { connect } from "react-redux";
import { getOrder } from "./../../../api/request";
import Navbar from "../../../component/navbarTitle/index";
import { AtSearchBar } from "taro-ui";
import EmptyTemplate from "../../../component/emptyTemplate/index";
class Orders extends Component {
  current = getCurrentInstance();
  state = {
    page: 1,
    statusId: "",
    orders: [],
    searchKeyword: "",
  };
  constructor(props) {
    super(props);
  }
  async componentWillMount() {}
  componentDidMount() {
    let statusId = "";
    if (this.current.router.params.statusId) {
      statusId = this.current.router.params.statusId;
    }
    this.setState({ statusId: statusId });
    getOrder(this.state.page, statusId).then((data) => {
      console.log(data);
      this.setState({ orders: data });
    });
  }
  componentWillUnmount() {}

  componentDidShow() {
    Taro.setNavigationBarTitle({ title: Taro.T._("orderlist") });
  }

  componentDidHide() {}
  handleClick = (orderId) => {
    Taro.navigateTo({
      url: `/pages/about-order/order-detail/order-detail?orderId=${orderId}`,
    });
  };
  loadMore = () => {
    console.log("load more");
    getOrder(this.state.page + 1, this.state.statusId).then((data) => {
      console.log(data);
      let { orders } = this.state;
      if (data.length > 0) {
        data.map((item, idx) => {
          orders.push(item);
        });
      }
      this.setState({ orders: orders, page: this.state.page + 1 });
    });
  };
  onSearchKeyword = (value) => {
    this.setState({ searchKeyword: value });
  };
  onActionSearchKeyword = () => {
    let { searchKeyword } = this.state;
    console.log("searchKeyword:" + searchKeyword);
  };
  render() {
    let { orders, searchKeyword, statusId } = this.state;
    const height = Taro.getSystemInfoSync().windowHeight;
    return (
      <View className="orders">
        <Navbar
          title={Taro.T._("orderlist")}
          switchtUrl="/pages/index/user/user"
        />
        <View className="orders-search">
          <AtSearchBar
            value={searchKeyword}
            onChange={this.onSearchKeyword.bind(this)}
            onActionClick={this.onActionSearchKeyword.bind(this)}
          />
        </View>
        <View className="orders-filter">
          <Text
            style={
              statusId == ""
                ? {
                    borderBottom: "5px solid #d62c75",
                  }
                : ""
            }
            onClick={() => {
              Taro.navigateTo({
                url: "/pages/about-order/orders/orders",
              });
            }}
          >
            {Taro.T._("all")}
          </Text>
          <Text
            style={
              statusId == 1
                ? {
                    borderBottom: "5px solid #d62c75",
                  }
                : ""
            }
            onClick={() => {
              Taro.navigateTo({
                url: "/pages/about-order/orders/orders?statusId=1",
              });
            }}
          >
            {Taro.T._("Pending")}
          </Text>
          <Text>{Taro.T._("Processing")}</Text>
          <Text>{Taro.T._("Confirming")}</Text>
          <Text>{Taro.T._("On Hold")}</Text>
        </View>
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
          {orders && orders.length > 0 ? (
            orders.map((item, idx) => {
              let currencySymbol =
                item.currencyData && item.currencyData.symbol
                  ? item.currencyData.symbol
                  : "";
              return (
                <View
                  key={item.id}
                  onClick={() => this.handleClick(item.id)}
                  className="orders-line"
                >
                  <View className="orders-line-title">
                    <View className="orders-line-title-store">
                      <View className="orders-line-title-store-icon">
                        <Image src={require("./../assets/store-ico.png")} />
                        <Text>
                          {item.store && item.store.name ? item.store.name : ""}
                        </Text>
                      </View>
                      <View className="orders-line-title-store-icon-status">
                        <Text>
                          {item.status && item.status.name
                            ? Taro.T._(item.status.name)
                            : ""}
                        </Text>
                      </View>
                    </View>
                    <View className="orders-line-title-number">
                      <Text>
                        {Taro.T._("ordersn")}： {item.increment_id}
                      </Text>
                    </View>
                  </View>
                  {item.items && item.items.length > 0
                    ? item.items.map((pitem, pidx) => {
                        return (
                          <View className="orders-line-item">
                            <View className="orders-line-item-imgview">
                              <Image
                                src={pitem.image}
                                className="orders-line-item-imgview-img"
                              />
                            </View>
                            <View className="orders-line-item-right">
                              <View className="orders-line-item-right-name">
                                <Text className="orders-line-item-right-name-name">
                                  {pitem.product_name}
                                </Text>
                                <Text className="orders-line-item-right-name-option">
                                  {pitem.options_name}
                                </Text>
                              </View>
                              <View className="orders-line-item-right-price">
                                <Text>
                                  {currencySymbol}{" "}
                                  {parseFloat(pitem.price).toFixed(2)}
                                </Text>
                                <Text>x {parseInt(pitem.qty)}</Text>
                              </View>
                            </View>
                          </View>
                        );
                      })
                    : null}
                  <View className="orders-line-createdat">
                    <Text>
                      {Taro.T._("createdat")}:{item.created_at}
                    </Text>
                  </View>
                  <View className="orders-line-total">
                    <Text>
                      {Taro.T._("total")}:
                      {currencySymbol + parseFloat(item.total).toFixed(2)}
                    </Text>
                  </View>
                  <View className="orders-line-action">
                    <Text>{Taro.T._("refoundaftersales")}</Text>
                    <Text>{Taro.T._("reorder")}</Text>
                    <Text>{Taro.T._("orderdetail")}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <EmptyTemplate title={Taro.T._("thereisnoorder")} />
          )}
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = ({ user }) => ({
  user: user,
});
export default connect(mapStateToProps)(Orders);
