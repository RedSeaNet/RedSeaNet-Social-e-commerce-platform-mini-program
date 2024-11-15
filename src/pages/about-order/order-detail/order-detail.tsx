import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Input, Button, Text, Image } from "@tarojs/components";
import { AtInput, AtIcon } from "taro-ui";
import "./order-detail.scss";
import { getOrderById } from "./../../../api/request";
import Navbar from "../../../component/navbarTitle/index";
export default class OrderDetail extends Component {
  current = getCurrentInstance();
  config = {
    navigationBarTitleText: "order detail",
  };

  constructor(props) {
    super(props);
  }
  state = {
    orderId: this.current.router.params.orderId,
    order: [],
  };
  componentDidMount() {
    getOrderById(this.state.orderId).then((data) => {
      console.log("getOrderById:");
      console.log(data);
      this.setState({ order: data });
    });
  }

  render() {
    let { order } = this.state;
    return (
      <View className="order-detail">
        <Navbar title={Taro.T._("orderdetail")} />

        <View className="order-detail-status">
          <View className="order-detail-status-icon">
            <AtIcon value="check-circle" size="50" color="#FFF"></AtIcon>
          </View>
          <Text>
            {order.status && order.status.name
              ? Taro.T._(order.status.name)
              : ""}
          </Text>
        </View>
        <View className="order-detail-shipping">
          <View>
            <Text>{Taro.T._("shippinginfo")}</Text>
          </View>
          <View className="order-detail-shipping-info">
            <Text>{order.shipping_address}</Text>
          </View>
        </View>
        <View className="order-detail-store">
          <Image src={require("./../assets/store-ico.png")} />
          <Text>{order.store && order.store.name ? order.store.name : ""}</Text>
        </View>
        <View className="order-detail-items">
          {order.items && order.items.length > 0
            ? order.items.map((item, idx) => {
                return (
                  <View className="order-detail-items-item">
                    <View className="order-detail-items-item-imgview">
                      <Image
                        src={item.image}
                        className="order-detail-items-item-imgview-img"
                        onClick={() => {
                          Taro.navigateTo({
                            url: `/pages/about-product/product-detail/product-detail?productId=${item.product_id}`,
                          });
                        }}
                      />
                    </View>
                    <View className="order-detail-items-item-right">
                      <View>
                        <Text
                          onClick={() => {
                            Taro.navigateTo({
                              url: `/pages/about-product/product-detail/product-detail?productId=${item.product_id}`,
                            });
                          }}
                        >
                          {item.product_name}
                        </Text>
                      </View>
                      {item.options_name ? (
                        <View className="order-detail-items-item-right-option">
                          <Text>{item.options_name}</Text>
                        </View>
                      ) : null}
                      <View className="order-detail-items-item-right-price">
                        <Text>x {parseInt(item.qty)}</Text>
                      </View>
                      <View className="order-detail-items-item-right-price">
                        <Text>
                          {order.currencyData && order.currencyData.symbol
                            ? order.currencyData.symbol
                            : ""}
                          {parseFloat(item.price).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            : null}
        </View>
        <View className="order-detail-bottom">
          <View>
            <Text>
              {Taro.T._("ordersn")}： {order.increment_id}
            </Text>
          </View>
          <View>
            <Text>
              {Taro.T._("createdat")}： {order.created_at}
            </Text>
          </View>
          <View>
            <Text>
              {Taro.T._("shippingmethod")}: {order.shipping_menthod_label}
            </Text>
          </View>
          <View>
            <Text>
              {Taro.T._("paymentmethod")}: {order.payment_method_label}
            </Text>
          </View>
          <View>
            <Text>
              {Taro.T._("subtotal")}:
              {order.currencyData && order.currencyData.symbol
                ? order.currencyData.symbol
                : ""}{" "}
              {parseFloat(order.subtotal).toFixed(2)}
            </Text>
          </View>
          <View>
            <Text>
              {Taro.T._("shippingfee")}:{" "}
              {order.currencyData && order.currencyData.symbol
                ? order.currencyData.symbol
                : ""}
              {parseFloat(order.shipping).toFixed(2)}
            </Text>
          </View>
          <View>
            <Text>
              {Taro.T._("discount")}:
              {order.currencyData && order.currencyData.symbol
                ? order.currencyData.symbol
                : ""}
              {order.discount}
            </Text>
          </View>
          <View>
            <Text>
              {Taro.T._("total")}:{" "}
              {order.currencyData && order.currencyData.symbol
                ? order.currencyData.symbol
                : ""}
              {parseFloat(order.total).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
