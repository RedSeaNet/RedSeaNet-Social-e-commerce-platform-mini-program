import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./myitem.scss";
import { AtAvatar } from "taro-ui";
import { connect } from "react-redux";
import { useState } from "react";
const Myitem = (props) => {
  const goToCustomer = (customerId) => {
    console.log("customerId:" + customerId);
    Taro.navigateTo({
      url: `/pages/about-find/customer-space/customer-space?spaceId=${props.customer_id}`,
    });
  };
  const goToUrl = () => {
    if (
      props.params &&
      props.params.customerid &&
      props.params.urlkey == "customerid"
    ) {
      Taro.navigateTo({
        url: `/pages/about-find/customer-space/customer-space?spaceId=${props.params.customerid}`,
      });
    } else if (
      props.params &&
      props.params.postid &&
      props.params.urlkey == "postid"
    ) {
      Taro.navigateTo({
        url: `/pages/about-find/find-detail/find-detail?postId=${props.params.postid}`,
      });
    }
    return false;
  };
  return (
    <View className="mycontainer">
      <View className="mycontainer-avatarv">
        <Image
          src={props.avatar}
          className="mycontainer-item-img"
          mode="widthFix"
          onClick={() => goToCustomer(props.sender_id)}
        />
      </View>
      <View className="mycontainer-contentv">
        <View onClick={() => goToUrl()}>{props.title}</View>
        <View className="mycontainer-contentv-time">
          <Text>{props.created_at}</Text>
          {props.status != 1 ? (
            <Text className="mycontainer-contentv-time-new">New</Text>
          ) : (
            ""
          )}
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = ({ user }) => ({
  user: user,
});
export default connect(mapStateToProps)(Myitem);
