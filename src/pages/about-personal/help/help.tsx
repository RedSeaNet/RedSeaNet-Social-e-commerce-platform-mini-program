import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Button, Text } from "@tarojs/components";
import "./help.scss";
import Navbar from "../../../component/navbarTitle/index";
export default class Help extends Component {
  config = {
    navigationBarTitleText: "Help",
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidShow() {
    Taro.setNavigationBarTitle({ title: Taro.T._("help") });
  }
  render() {
    return (
      <View className="help">
        <Navbar title={Taro.T._("help")} />
        <Text>Help</Text>
      </View>
    );
  }
}
