import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./about-us.scss";
import Navbar from "../../../../component/navbarTitle/index";
export default class AboutUs extends Component {
  config = {
    navigationBarTitleText: "关于我们",
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidShow() {
    Taro.setNavigationBarTitle({ title: Taro.T._("aboutus") });
  }
  render() {
    return (
      <View className="about-us">
        <Navbar title={Taro.T._("aboutus")} />
        <Text>About Us</Text>
      </View>
    );
  }
}
