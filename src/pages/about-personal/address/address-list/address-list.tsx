import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Button, Image, Text } from "@tarojs/components";
import "./address-list.scss";
import { requestAddress } from "../../../../store/actions/order";
import { connect } from "react-redux";
import Navbar from "../../../../component/navbarTitle/index";
import { addressDelete } from "./../../../../api/request";
class AddressList extends Component {
  config = {
    navigationBarTitleText: "Address List",
  };

  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.dispatch(requestAddress());
  }
  componentDidShow() {
    Taro.setNavigationBarTitle({ title: Taro.T._("myaddress") });
  }
  deleteAction = (id) => {
    console.log("delete action----");
    addressDelete(id).then((data) => {
      console.log(data);
      this.props.dispatch(requestAddress());
    });
  };
  render() {
    let { order } = this.props;
    console.log(order.addressList);
    return (
      <View className="address-list">
        <Navbar title={Taro.T._("address")} />
        <View
          className="address-list-add"
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/about-personal/address/add-address/add-address`,
            });
          }}
        >
          <Image
            src={require("../../assets/plus.png")}
            className="address-list-add-img"
          />
          <Text>{Taro.T._("addnewaddress")}</Text>
        </View>

        {order.addressList && order.addressList.length > 0
          ? order.addressList.map((item, idx) => {
              return (
                <View className="address-list-item" key={idx}>
                  <View className="address-list-item-left">
                    <View>
                      <Text>{item.name}</Text>
                    </View>
                    <View>
                      <Text>{item.addressString}</Text>
                      <Text>{item.tel}</Text>
                    </View>
                    <View>
                      {item.is_default == "1" ? (
                        <Text className="address-list-item-left-default">
                          {Taro.T._("default")}
                        </Text>
                      ) : null}
                      <Text>
                        {item.country_name ? item.country_name + ", " : ""}
                        {item.region_name ? item.region_name + ", " : ""}
                        {item.city_name ? item.city_name + ", " : ""}
                        {item.county_name ? item.county_name + ", " : ""}
                        {item.address}
                      </Text>
                    </View>
                  </View>
                  <View className="address-list-item-right">
                    <Text
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/about-personal/address/update-address/update-address?id=${item.id}`,
                        });
                      }}
                    >
                      {Taro.T._("edit")}
                    </Text>
                    <Text
                      onClick={() => {
                        this.deleteAction(item.id);
                      }}
                    >
                      {Taro.T._("delete")}
                    </Text>
                  </View>
                </View>
              );
            })
          : null}
      </View>
    );
  }
}
const mapStateToProps = ({ user, order }) => ({
  user: user,
  order: order,
});
export default connect(mapStateToProps)(AddressList);
