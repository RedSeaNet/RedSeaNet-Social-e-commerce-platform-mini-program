import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Button, Text } from "@tarojs/components";
import { AtInput } from "taro-ui";
import "./change-password.scss";
import Navbar from "../../../../component/navbarTitle/index";
export default class ChangePassword extends Component {
  config = {
    navigationBarTitleText: "修改密码",
  };

  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  }

  handleChangePassword = () => {
    if (this.state.oldPassword == "") {
      Taro.showToast({
        title: Taro.T._("pleaseenteroldpassword"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    if (this.state.newPassword == "") {
      Taro.showToast({
        title: Taro.T._("pleaseenternewpassword"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    if (this.state.confirmPassword == "") {
      Taro.showToast({
        title: Taro.T._("pleaseconfirmpassword"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    let siginupData = {};
    siginupData.username = this.state.username;
    signup(siginupData);
  };
  componentDidShow() {
    Taro.setNavigationBarTitle({ title: Taro.T._("changepassword") });
  }
  render() {
    return (
      <View className="change-password">
        <Navbar title={Taro.T._("changepassword")} />
        <View className="change-password-item">
          <AtInput
            name="oldPassword"
            type="password"
            value={this.state.oldPassword}
            placeholder={Taro.T._("pleaseenteroldpassword")}
            className="change-password-item-input"
            placeholderClass="change-password-item-input-placeholder"
            onChange={(value) => this.setState({ oldPassword: value })}
          />
        </View>
        <View className="change-password-item">
          <AtInput
            name="newPassword"
            type="password"
            value={this.state.newPassword}
            placeholder={Taro.T._("pleaseenternewpassword")}
            className="change-password-item-input"
            placeholderClass="change-password-item-input-placeholder"
            onChange={(value) => this.setState({ newPassword: value })}
          />
        </View>
        <View className="change-password-item">
          <AtInput
            name="confirmPassword"
            type="password"
            value={this.state.confirmPassword}
            placeholder={Taro.T._("pleaseconfirmpassword")}
            className="change-password-item-input"
            placeholderClass="change-password-item-input-placeholder"
            onChange={(value) => this.setState({ confirmPassword: value })}
          />
        </View>

        <View
          className="change-password-button"
          onClick={this.handleChangePassword}
        >
          <Text>{Taro.T._("save")}</Text>
        </View>
      </View>
    );
  }
}
