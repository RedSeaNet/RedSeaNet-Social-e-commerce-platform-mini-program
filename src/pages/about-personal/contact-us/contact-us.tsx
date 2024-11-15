import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Button, Text } from "@tarojs/components";
import { AtInput } from "taro-ui";
import "./contact-us.scss";
import Navbar from "../../../component/navbarTitle/index";
export default class ContactUs extends Component {
  config = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidShow() {
    Taro.setNavigationBarTitle({ title: Taro.T._("contactus") });
  }
  render() {
    return (
      <View className="contact-us">
        <Navbar title={Taro.T._("contactus")} />
        <Text>Contact Us</Text>
      </View>
    );
  }
}
