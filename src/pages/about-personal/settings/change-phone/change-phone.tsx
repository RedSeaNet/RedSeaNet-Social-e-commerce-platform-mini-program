import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Button, Text } from "@tarojs/components";
import { AtInput } from "taro-ui";
import "./change-phone.scss";
import { USER } from "../../../../utils/constant";
import { sendSmsCodeForCusotmer } from "../../../../api/request";
import Navbar from "../../../../component/navbarTitle/index";
export default class ChangePhone extends Component {
  config = {
    navigationBarTitleText: "修改手机",
  };

  constructor(props) {
    super(props);
    let user = Taro.getStorageSync(USER);
    this.state = {
      oldPhone: user.cel,
      oldPhoneCode: "",
      oldisGetCode: false,
      oldValidCodeTip: Taro.T._("togetvalidcode"),
      oldCheckCode: "",

      phone: "",
      phoneCode: "",
      checkPhone: "",
      isGetCode: false,
      validCodeTip: Taro.T._("togetvalidcode"),
      checkCode: "",
      user: user,
    };
  }
  componentDidShow() {
    Taro.setNavigationBarTitle({ title: Taro.T._("changephone") });
  }

  sendOldPhoneCode = () => {
    let codeCel = "";
    for (let i = 0; i < 4; i++) {
      codeCel = codeCel + parseInt(Math.random() * 10);
    }

    this.setState({ oldCheckCode: codeCel, oldisGetCode: true });
    let number = 120;
    this.interval = setInterval(() => {
      if (number == 1) {
        this.setState({
          oldisGetCode: false,
          oldValidCodeTip: Taro.T._("togetvalidcode"),
        });
        clearInterval(this.interval);
      } else {
        number = number - 1;
        this.setState({
          oldisGetCode: true,
          oldValidCodeTip: Taro.T._("togetvalidcodeagain") + `(${number}s)`,
        });
      }
    }, 1000);
    sendSmsCodeForCusotmer(
      this.state.oldPhone,
      "register_template",
      codeCel
    ).then((data) => {
      Taro.showToast({
        title: Taro.T._("phonecodesentremind"),
        icon: "none",
        duration: 2000,
      });
    });
  };

  sendPhoneCode = () => {
    let codeCel = "";
    for (let i = 0; i < 4; i++) {
      codeCel = codeCel + parseInt(Math.random() * 10);
    }
    this.setState({
      checkPhone: this.state.phone,
      checkCode: codeCel,
      isGetCode: true,
    });
    let number = 120;
    this.interval = setInterval(() => {
      if (number == 1) {
        this.setState({
          isGetCode: false,
          validCodeTip: Taro.T._("togetvalidcode"),
        });
        clearInterval(this.interval);
      } else {
        number = number - 1;
        this.setState({
          isGetCode: true,
          validCodeTip: Taro.T._("togetvalidcodeagain") + `(${number}s)`,
        });
      }
    }, 1000);
    sendSmsCodeForCusotmer(this.state.phone, "register_template", codeCel).then(
      (data) => {
        Taro.showToast({
          title: Taro.T._("phonecodesentremind"),
          icon: "none",
          duration: 2000,
        });
      }
    );
  };

  handleChangePhone = () => {
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
        title: Taro.T._("validephonenotthesame"),
        icon: "none",
        duration: 2000,
      });
    }
    let updateData = {};
    updateData.phone = this.state.phone;
    customerUpdate(updateData);
    Taro.navigateBack();
  };

  render() {
    let { user } = this.state;
    return (
      <View className="change-phone">
        <Navbar title={Taro.T._("changephone")} />
        <View className="change-phone-item">
          <AtInput
            name="phone"
            type="text"
            value={user.cel}
            placeholder={Taro.T._("registerCelInput")}
            className="change-phone-item-input"
            placeholderClass="change-phone-item-input-placeholder"
            disabled
          />
        </View>
        <View className="change-phone-item">
          <AtInput
            clear
            name="validCode"
            type="number"
            className="change-phone-item-input"
            value={this.state.oldPhoneCode}
            placeholder={Taro.T._("registerValidCodeInput")}
            placeholderClass="change-phone-item-input-placeholder"
            onChange={(value) => this.setState({ oldPhoneCode: value })}
            maxLength="6"
          >
            <Text onClick={this.sendOldPhoneCode}>
              {this.state.oldValidCodeTip}
            </Text>
          </AtInput>
        </View>
        <View className="change-phone-item">
          <AtInput
            name="phone"
            type="text"
            value={this.state.phone}
            placeholder={Taro.T._("registerCelInput")}
            className="change-phone-item-input"
            placeholderClass="change-phone-item-input-placeholder"
            onChange={(value) => this.setState({ phone: value })}
          />
        </View>
        <View className="change-phone-item">
          <AtInput
            clear
            name="validCode"
            type="number"
            className="change-phone-item-input"
            value={this.state.validCode}
            placeholder={Taro.T._("registerValidCodeInput")}
            placeholderClass="change-phone-item-input-placeholder"
            onChange={(value) => this.setState({ validCode: value })}
            maxLength="6"
          >
            <Text onClick={this.sendPhoneCode}>{this.state.validCodeTip}</Text>
          </AtInput>
        </View>
        <View className="change-phone-button" onClick={this.handleChangePhone}>
          <Text>{Taro.T._("save")}</Text>
        </View>
      </View>
    );
  }
}
