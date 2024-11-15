import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Button, Text, Image } from "@tarojs/components";
import { signup, sendEmailUserTemplate } from "../../../api/request";
import { AtInput } from "taro-ui";
import "./phone-register.scss";

export default class PhoneRegister extends Component {
  config = {
    navigationBarTitleText: "手机注册",
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      phone: "",
      validCode: "",
      password: "",
      confirmPassword: "",
      checkEmail: "",
      isGetCode: false,
      validCodeTip: Taro.T._("togetvalidcode"),
      checkCode: "",
    };
  }
  getEmailValidcode = () => {
    if (this.state.email) {
      if (this.state.isGetCode) {
        return false;
      } else {
        let codeEmail = {};
        codeEmail["code"] = "";
        console.log(codeEmail);

        this.setState({ isGetCode: true });
        let number = 120;
        this.interval = setInterval(() => {
          if (number == 1) {
            this.setState({ isGetCode: false });
            this.setState({ validCodeTip: Taro.T._("togetvalidcode") });
            clearInterval(this.interval);
          } else {
            number = number - 1;
            this.setState({ isGetCode: true });
            this.setState({
              validCodeTip: Taro.T._("togetvalidcodeagain") + `(${number}s)`,
            });
          }
        }, 1000);

        for (let i = 0; i < 4; i++) {
          codeEmail["code"] = codeEmail["code"] + parseInt(Math.random() * 10);
        }

        this.setState({
          checkEmail: this.state.email,
          checkCode: codeEmail["code"],
        });
        console.log(codeEmail);
        sendEmailUserTemplate(
          this.state.email,
          "mobile_regiter_valid_code",
          codeEmail
        ).then((data) => {
          Taro.showToast({
            title: Taro.T._("emailsentremind"),
            icon: "none",
            duration: 2000,
          });
        });
      }
    } else {
      Taro.showToast({
        title: Taro.T._("pleaseenteremail"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }
  };
  handleReg = () => {
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

    if (this.state.phone == "") {
      Taro.showToast({
        title: Taro.T._("pleaseenterphone"),
        icon: "none",
        duration: 2000,
      });
      return false;
    } else if (this.state.phone != this.state.checkPhone) {
      Taro.showToast({
        title: Taro.T._("validephonenotthesame"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }

    if (this.state.validCode == "") {
      Taro.showToast({
        title: Taro.T._("pleaseentervalidcode"),
        icon: "none",
        duration: 2000,
      });
      return false;
    } else if (this.state.validCode != this.state.checkCode) {
      Taro.showToast({
        title: Taro.T._("validcodeincorrect"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }

    if (this.state.password == "") {
      Taro.showToast({
        title: Taro.T._("loginPasswordInput"),
        icon: "none",
        duration: 2000,
      });
      return false;
    } else if (this.state.password.length < 5) {
      Taro.showToast({
        title: Taro.T._("passwordlongrequire"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }

    if (this.state.confirmPassword == "") {
      Taro.showToast({
        title: Taro.T._("loginPasswordInput"),
        icon: "none",
        duration: 2000,
      });
      return false;
    } else if (this.state.confirmPassword.length < 5) {
      Taro.showToast({
        title: Taro.T._("passwordlongrequire"),
        icon: "none",
        duration: 2000,
      });
      return false;
    } else if (this.state.confirmPassword != this.state.password) {
      Taro.showToast({
        title: Taro.T._("validemailnothesame"),
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
    Taro.setNavigationBarTitle({ title: Taro.T._("phoneregister") });
  }
  render() {
    return (
      <View className="phone-register">
        <View className="phone-register-header">
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
        <View className="phone-register-tipv">
          <Text className="phone-register-tipv-title">
            {Taro.T._("phoneregister")}
          </Text>
          <Text className="phone-register-tipv-tip">
            {Taro.T._("registerTipByPhone")}
          </Text>
        </View>
        <View className="phone-register-item">
          <AtInput
            name="usename"
            type="text"
            className="phone-register-item-input"
            value={this.state.username}
            placeholder={Taro.T._("registerUsernameInput")}
            placeholderClass="phone-register-item-input-placeholder"
            onChange={(value) => {
              this.setState({ username: value });
            }}
          />
        </View>
        <View className="phone-register-item">
          <AtInput
            name="phone"
            type="text"
            value={this.state.email}
            placeholder={Taro.T._("registerCelInput")}
            className="email-register-item-input"
            placeholderClass="email-register-item-input-placeholder"
            onChange={(value) => this.setState({ phone: value })}
          />
        </View>
        <View className="phone-register-item">
          <AtInput
            clear
            name="validCode"
            type="number"
            className="phone-register-item-input"
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

        <View className="phone-register-item">
          <AtInput
            name="password"
            type="password"
            className="phone-register-item-input"
            value={this.state.password}
            placeholder={Taro.T._("registerPasswordInput")}
            onChange={(value) => this.setState({ password: value })}
            placeholderClass="phone-register-item-input-placeholder"
          />
        </View>
        <View className="phone-register-item">
          <AtInput
            name="confirmPassword"
            type="password"
            className="phone-register-item-input"
            value={this.state.confirmPassword}
            placeholder={Taro.T._("registerRePasswordInput")}
            onChange={(value) => this.setState({ confirmPassword: value })}
            placeholderClass="phone-register-item-input-placeholder"
          />
        </View>

        <View className="phone-register-button" onClick={this.handleReg}>
          <Text>{Taro.T._("register")}</Text>
        </View>

        <View className="phone-register-regandforget">
          <View
            style={"width:48%"}
            onClick={() => {
              Taro.navigateTo({
                url: "/pages/about-personal/user-login/user-login",
              });
            }}
          >
            <Text style={"color:#707070;font-size:small;"}>
              {Taro.T._("login")}
            </Text>
          </View>
          <View>
            <Text style={"color:#707070;font-size:small;"}>|</Text>
          </View>
          <View
            style={"width:48%"}
            onClick={() => {
              Taro.navigateTo({
                url: "/pages/about-personal/email-register/email-register",
              });
            }}
          >
            <Text style={"color:#707070;font-size:small;"}>
              {Taro.T._("emailregister")}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
