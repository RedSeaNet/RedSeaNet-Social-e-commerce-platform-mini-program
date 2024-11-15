import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Button, Text, Image } from "@tarojs/components";
import { signup, sendEmailUserTemplate } from "./../../../api/request";
import { AtInput } from "taro-ui";
import "./forget-password.scss";
export default class ForgetPassword extends Component {
  config = {
    navigationBarTitleText: "忘记密码",
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleForgetPassword = () => {
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
  componentDidShow() {
    Taro.setNavigationBarTitle({ title: Taro.T._("forgetpassword") });
  }
  render() {
    return (
      <View className="forget-password">
        <View className="eforget-password-header">
          <Image
            src={require("./../../../assets/arrow-left.png")}
            style={"width:20px;height:16px;padding:2px;"}
            onClick={() => {
              if (Taro.getCurrentPages().length > 1) {
                Taro.navigateBack();
              } else {
                Taro.switchTab({ url: "/pages/index/index" });
              }
            }}
          />
        </View>
        <View className="forget-password-tipv">
          <Text className="forget-password-tipv-title">
            {Taro.T._("forgetpassword")}
          </Text>
        </View>
        <View className="forget-password-item">
          <AtInput
            name="phone"
            type="text"
            value={this.state.email}
            placeholder={Taro.T._("registerCelInput")}
            className="forget-password-item-input"
            placeholderClass="forget-password-item-input-placeholder"
            onChange={(value) => this.setState({ phone: value })}
          />
        </View>
        <View className="forget-password-item">
          <AtInput
            clear
            name="validCode"
            type="number"
            className="forget-password-item-input"
            value={this.state.validCode}
            placeholder={Taro.T._("registerValidCodeInput")}
            placeholderClass="phone-register-item-input-placeholder"
            onChange={(value) => this.setState({ validCode: value })}
            maxLength="6"
          >
            <Text onClick={this.getEmailValidcode}>
              {this.state.validCodeTip}
            </Text>
          </AtInput>
        </View>

        <View className="forget-password-button" onClick={this.handleReg}>
          <Text>{Taro.T._("submit")}</Text>
        </View>
      </View>
    );
  }
}
