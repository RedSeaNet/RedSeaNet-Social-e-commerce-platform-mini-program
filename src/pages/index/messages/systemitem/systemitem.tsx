import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./systemitem.scss";
import { connect } from "react-redux";
import { useState } from "react";
const Systemitem = (props) => {
  const goToCustomer = (customerId) => {
    console.log("customerId:" + customerId);
    Taro.navigateTo({
      url: `/pages/about-find/customer-space/customer-space?spaceId=${props.customer_id}`,
    });
  };
  return (
    <View className="systemcontainer">
      <View className="systemcontainer-titlec">
        <View>
          <Text>{props.title}</Text>
        </View>
        <View className="systemcontainer-titlec-time">
          <Text>
            {props.created_at}
            {props.status != 1 ? (
              <Text className="systemcontainer-titlec-time-new">New</Text>
            ) : (
              ""
            )}
          </Text>
        </View>
      </View>
      <View className="systemcontainer-contentc">
        <View>
          <Text>{props.content}</Text>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = ({ user }) => ({
  user: user,
});
export default connect(mapStateToProps)(Systemitem);
