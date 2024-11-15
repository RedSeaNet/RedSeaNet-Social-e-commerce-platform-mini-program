import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Button, Text } from "@tarojs/components";
import { AtInput } from "taro-ui";
import "./index.scss";
import Navbar from "../../../component/navbarTitle/index";
export default class Index extends Component {
  config = {
    navigationBarTitleText: "设置中心",
  };

  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View className="index">
        <Navbar
          title={Taro.T._("sitting")}
          switchtUrl="/pages/index/user/user"
        />
        <View
          className="index-item"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/about-personal/settings/user-info/user-info",
            });
          }}
        >
          <Text>{Taro.T._("personaldetail")}</Text>
          <Text>></Text>
        </View>
        <View
          className="index-item"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/about-personal/settings/change-email/change-email",
            });
          }}
        >
          <Text>{Taro.T._("changeemail")}</Text>
          <Text>></Text>
        </View>
        <View
          className="index-item"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/about-personal/settings/change-phone/change-phone",
            });
          }}
        >
          <Text>{Taro.T._("changephone")}</Text>
          <Text>></Text>
        </View>
        <View
          className="index-item"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/about-personal/settings/swith-language/swith-language",
            });
          }}
        >
          <Text>{Taro.T._("swithlanguage")}</Text>
          <Text>></Text>
        </View>
        <View
          className="index-item"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/about-personal/settings/change-password/change-password",
            });
          }}
        >
          <Text>{Taro.T._("changepassword")}</Text>
          <Text>></Text>
        </View>
        <View
          className="index-item"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/about-personal/settings/feedback/feedback",
            });
          }}
        >
          <Text>{Taro.T._("feedback")}</Text>
          <Text>></Text>
        </View>
        <View
          className="index-item"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/about-personal/settings/about-us/about-us",
            });
          }}
        >
          <Text>{Taro.T._("aboutus")}</Text>
          <Text>></Text>
        </View>
        <View
          className="index-item"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/about-personal/settings/clear-cache/clear-cache",
            });
          }}
        >
          <Text>{Taro.T._("cleancache")}</Text>
          <Text>></Text>
        </View>
        <View className="index-item">
          <Text>{Taro.T._("currentversion")}: 1.0.20</Text>
        </View>
      </View>
    );
  }
}
