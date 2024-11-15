import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtInput } from "taro-ui";
import "./change-email.scss";
import { USER } from "../../../../utils/constant";
import Navbar from "../../../../component/navbarTitle/index";
export default class ChangeEmail extends Component {
  config = {
    navigationBarTitleText: "修改邮箱",
  };

  constructor(props) {
    super(props);
    let user = Taro.getStorageSync(USER);
    this.state = {
      oldEmail: user.email,
      oldEmailCode: "",
      oldisGetCode: false,
      oldValidCodeTip: Taro.T._("togetvalidcode"),
      oldCheckCode: "",

      email: "",
      emailCode: "",
      checkEmail: "",
      isGetCode: false,
      validCodeTip: Taro.T._("togetvalidcode"),
      checkCode: "",
    };
  }

  handleChangeEmail = () => {
    let regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (this.state.email == "") {
      Taro.showToast({
        title: Taro.T._("pleaseenteremail"),
        icon: "none",
        duration: 2000,
      });
      return false;
    } else if (!regEmail.test(this.state.email)) {
      Taro.showToast({
        title: Taro.T._("pleaseenterrightemail"),
        icon: "none",
        duration: 2000,
      });
      return false;
    } else if (this.state.email != this.state.checkEmail) {
      Taro.showToast({
        title: Taro.T._("validemailnotthesame"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }

    let updateData = {};
    updateData.email = this.state.email;
    customerUpdate(updateData);
    Taro.navigateBack();
  };
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
  getOldEmailValidcode = () => {
    if (this.state.oldEmail) {
      if (this.state.oldisGetCode) {
        return false;
      } else {
        let oldCodeEmail = {};
        oldCodeEmail["code"] = "";

        this.setState({ oldisGetCode: true });
        let number = 120;
        this.interval = setInterval(() => {
          if (number == 1) {
            this.setState({ oldisGetCode: false });
            this.setState({ oldValidCodeTip: Taro.T._("togetvalidcode") });
            clearInterval(this.interval);
          } else {
            number = number - 1;
            this.setState({ oldisGetCode: true });
            this.setState({
              oldValidCodeTip: Taro.T._("togetvalidcodeagain") + `(${number}s)`,
            });
          }
        }, 1000);

        for (let i = 0; i < 4; i++) {
          oldCodeEmail["code"] =
            oldCodeEmail["code"] + parseInt(Math.random() * 10);
        }

        this.setState({ oldCheckCode: oldCodeEmail["code"] });

        sendEmailUserTemplate(
          this.state.oldEmail,
          "mobile_regiter_valid_code",
          oldCodeEmail
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
  componentDidShow() {
    Taro.setNavigationBarTitle({ title: Taro.T._("changeemail") });
  }
  render() {
    return (
      <View className="change-email">
        <Navbar title={Taro.T._("changeemail")} />
        <View className="change-email-item">
          <AtInput
            name="oldEmail"
            type="text"
            value={this.state.oldEmail}
            placeholder={Taro.T._("pleaseenteremail")}
            className="change-email-item-input"
            placeholderClass="change-email-item-input-placeholder"
            disabled
          />
        </View>
        <View className="change-email-item">
          <AtInput
            clear
            name="emailCode"
            type="number"
            className="change-email-item-input"
            value={this.state.emailCode}
            placeholder={Taro.T._("pleaseentervalidcode")}
            placeholderClass="change-email-item-input-placeholder"
            onChange={(value) => this.setState({ emailCode: value })}
            maxLength="6"
          >
            <Text onClick={this.getOldEmailValidcode}>
              {this.state.validCodeTip}
            </Text>
          </AtInput>
        </View>
        <View className="change-email-item">
          <AtInput
            name="email"
            type="text"
            value={this.state.email}
            placeholder={Taro.T._("pleaseenternewemail")}
            className="change-email-item-input"
            placeholderClass="change-email-item-input-placeholder"
            onChange={(value) => this.setState({ phone: value })}
          />
        </View>
        <View className="change-email-item">
          <AtInput
            clear
            name="validCode"
            type="number"
            className="change-email-item-input"
            value={this.state.validCode}
            placeholder={Taro.T._("pleaseentervalidcode")}
            placeholderClass="change-email-item-input-placeholder"
            onChange={(value) => this.setState({ validCode: value })}
            maxLength="6"
          >
            <Text onClick={this.getEmailValidcode}>
              {this.state.validCodeTip}
            </Text>
          </AtInput>
        </View>
        <View className="change-email-button" onClick={this.handleChangeEmail}>
          <Text>{Taro.T._("save")}</Text>
        </View>
      </View>
    );
  }
}
