import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Button, Text } from "@tarojs/components";
import { AtInput } from "taro-ui";
import "./feedback.scss";
import Navbar from "../../../../component/navbarTitle/index";
export default class Feedback extends Component {
  config = {
    navigationBarTitleText: "意见反馈",
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleFeedback = () => {
    if (this.state.username == "") {
      Taro.showToast({
        title: Taro.T._("pleaseenterusername"),
        icon: "none",
        duration: 2000,
      });
      return false;
    } else if (this.state.username.length < 5) {
      Taro.showToast({
        title: Taro.T._("usernamelongrequire"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }

    let siginupData = {};
    siginupData.username = this.state.username;
    siginupData.password = this.state.password;
    siginupData.email = "";
    siginupData.cel = this.state.phone;
    siginupData.motto = "";
    siginupData.referer = "";
    siginupData.avatar = this.state.avatar;
    signup(siginupData);
  };
  render() {
    return (
      <View className="feedback">
        <Navbar title={Taro.T._("feedback")} />
        <View className="feedback-tipv">
          <Text className="feedback-tipv-title">
            {Taro.T._("forgetpassword")}
          </Text>
        </View>
        <View className="feedback-item">
          <AtInput
            name="phone"
            type="text"
            value={this.state.email}
            placeholder={Taro.T._("registerCelInput")}
            className="feedback-item-input"
            placeholderClass="feedback-item-input-placeholder"
            onChange={(value) => this.setState({ phone: value })}
          />
        </View>
        <View className="feedback-item">
          <AtInput
            clear
            name="validCode"
            type="number"
            className="feedback-item-input"
            value={this.state.validCode}
            placeholder={Taro.T._("registerValidCodeInput")}
            placeholderClass="feedback-item-input-placeholder"
            onChange={(value) => this.setState({ validCode: value })}
            maxLength="6"
          >
            <Text onClick={this.getEmailValidcode}>
              {this.state.validCodeTip}
            </Text>
          </AtInput>
        </View>

        <View className="feedback-button" onClick={this.handleFeedback}>
          <Text>{Taro.T._("register")}</Text>
        </View>
      </View>
    );
  }
}
