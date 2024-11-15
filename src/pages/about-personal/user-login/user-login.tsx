import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Button, Text, Image } from "@tarojs/components";
import "./user-login.scss";
import { wechatMiniprogramLogin, oauthLogin } from "./../../../api/request";
import { USER } from "../../../utils/constant";
import { requestCart } from "../../../store/actions/cart";
import { AtIcon, AtToast, AtFloatLayout, AtTextarea, AtButton } from "taro-ui";
let isWapp = process.env.TARO_ENV;
import { connect } from "react-redux";
class UserLogin extends Component {
  config = {
    navigationBarTitleText: "登录",
  };

  constructor(props) {
    super(props);
  }
  state = {
    username: "",
    password: "",
    layoutIsOpened: false,
    loading: false,
    signupusername: "",
    signuppassword: "",
    signupemail: "",
    signupgender: "",
    signupeavatar: "",
    signupeopenid: "",
    toastIsOpened: false,
    toastText: "",
  };
  handleLogin = () => {
    let { username, password } = this.state;
    if (username == "") {
      Taro.showToast({
        title: Taro.T._("loginUsernameInput"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    if (password == "") {
      Taro.showToast({
        title: Taro.T._("loginPasswordInput"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    Taro.login().then((response) => {
      console.log(response);
      if (response.code) {
        wechatMiniprogramLogin(response.code, username, password).then(
          (data) => {
            console.log("-----wechatMiniprogramLogin data-----");
            console.log(data);
            Taro.setStorageSync(USER, data);
            this.props.dispatch(requestCart());
            Taro.navigateBack();
          }
        );
      } else {
        Taro.showToast({
          title:
            "you should allow to get your Wechat user information, Please try again.",
          icon: "none",
          duration: 2000,
        });
      }
    });
  };
  weixinLogin = () => {
    Taro.getUserProfile({
      desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("------res-----");
        console.log(res);
        Taro.login().then((response) => {
          console.log(response);
          if (response.code) {
            wechatMiniprogramLogin(response.code).then((data) => {
              console.log("-----data-----");
              console.log(data);
              if (data.id) {
                Taro.setStorageSync(USER, data);
                this.props.dispatch(requestCart());
                Taro.navigateBack();
              } else if (data.openid) {
                this.setState({
                  layoutIsOpened: true,
                  signupeavatar: res.userInfo.avatarUrl,
                  signupgender: res.userInfo.gender,
                  signupeopenid: data.unionid,
                });
              }
            });
          } else {
            Taro.showToast({
              title:
                "you should allow to get your Wechat user information, Please try again.",
              icon: "none",
              duration: 2000,
            });
          }
        });
      },
    });
  };
  onActionWechatSignUp = () => {
    console.log("------onActionWechatSignUp--------");
    let {
      layoutIsOpened,
      loading,
      signupusername,
      signuppassword,
      signupemail,
      signupeavatar,
      signupgender,
      signupeopenid,
    } = this.state;
    if (signupusername == "") {
      this.setState({
        toastIsOpened: true,
        toastText: Taro.T._("loginUsernameInput"),
      });
      return false;
    }
    if (signuppassword == "") {
      this.setState({
        toastIsOpened: true,
        toastText: Taro.T._("pleaseenterpassword"),
      });
      return false;
    }

    let regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (signupemail == "") {
      this.setState({
        toastIsOpened: true,
        toastText: Taro.T._("pleaseenteremail"),
      });
      return false;
    } else if (!regEmail.test(signupemail)) {
      this.setState({
        toastIsOpened: true,
        toastText: Taro.T._("pleaseenterrightemail"),
      });
      return false;
    }

    if (signupeopenid == "") {
      this.setState({
        toastIsOpened: true,
        toastText: Taro.T._("openidcannotnull"),
      });
      return false;
    }
    let customerData = {};
    customerData.avatar = signupeavatar;
    customerData.username = signupusername;
    customerData.gender = signupgender;
    customerData.email = signupemail;
    customerData.password = signuppassword;
    oauthLogin(signupeopenid, customerData).then((cdata) => {
      console.log("---------cdata--------");
      console.log(cdata);
      if (cdata.id) {
        Taro.setStorageSync(USER, cdata);
        this.props.dispatch(requestCart());
        this.setState({ layoutIsOpened: false });
        Taro.navigateBack();
      } else {
        console.log("-----errror----");
      }
    });
  };
  render() {
    let {
      username,
      password,
      layoutIsOpened,
      loading,
      signupusername,
      signuppassword,
      signupemail,
      toastIsOpened,
      toastText,
    } = this.state;
    return (
      <View className="user-login">
        <View className="user-login-header">
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
        <View className="user-login-tipv">
          <Text className="user-login-tipv-title">{Taro.T._("login")}</Text>
          <Text className="user-login-tipv-tip">{Taro.T._("loginTip")}</Text>
        </View>
        <View className="user-login-item">
          <Input
            className="user-login-item-input"
            value={username}
            placeholder={Taro.T._("loginUsernameInput")}
            placeholderClass="user-login-item-input-placeholder"
            onInput={(e) => this.setState({ username: e.target.value })}
          />
        </View>
        <View className="user-login-item">
          <Input
            className="user-login-item-input"
            value={password}
            placeholder={Taro.T._("loginPasswordInput")}
            onInput={(e) => this.setState({ password: e.target.value })}
            placeholderClass="user-login-item-input-placeholder"
            password={true}
          />
        </View>

        <View className="user-login-button" onClick={this.handleLogin}>
          <Text>{Taro.T._("login")}</Text>
        </View>
        <View className="user-login-regandforget">
          <View
            style={"width:48%"}
            onClick={() => {
              Taro.navigateTo({
                url: "/pages/about-personal/email-register/email-register",
              });
            }}
          >
            <Text className="user-login-regandforget-title">
              {Taro.T._("emailregister")}
            </Text>
          </View>
          <View>
            <Text className="user-login-regandforget-title">|</Text>
          </View>
          <View
            style={"width:48%"}
            onClick={() => {
              Taro.navigateTo({
                url: "/pages/about-personal/forget-password/forget-password",
              });
            }}
          >
            <Text className="user-login-regandforget-title">
              {Taro.T._("forgetpassword")}？
            </Text>
          </View>
        </View>

        <View className="user-login-oauthtitle">
          <View className="user-login-oauthtitle-c" />
          <Text className="user-login-oauthtitle-c-title">
            使用第三方账号登录
          </Text>
          <View className="user-login-oauthtitle-c-divider" />
        </View>

        <View className="user-login-oauth">
          {isWapp === "weapp" && (
            <Button
              className="user-login-oauth-wechat"
              open-type="getUserProfile"
              onClick={() => this.weixinLogin()}
            >
              <Image
                src={require("../assets/wechat-signin.png")}
                className="user-login-oauth-wechat-img"
              />
            </Button>
          )}
        </View>
        <AtFloatLayout
          isOpened={layoutIsOpened}
          title={Taro.T._("wechatsignup")}
          onClose={() => {
            this.setState({ layoutIsOpened: false });
          }}
        >
          <View className="user-login-item">
            <Input
              className="user-login-item-input"
              value={signupusername}
              placeholder={Taro.T._("pleaseenterusername")}
              onInput={(e) => this.setState({ signupusername: e.target.value })}
              placeholderClass="user-login-item-input-placeholder"
              type="text"
            />
          </View>
          <View className="user-login-item">
            <Input
              className="user-login-item-input"
              value={signupemail}
              placeholder={Taro.T._("pleaseenteremail")}
              onInput={(e) => this.setState({ signupemail: e.target.value })}
              placeholderClass="user-login-item-input-placeholder"
              type="email"
            />
          </View>
          <View className="user-login-item">
            <Input
              className="user-login-item-input"
              value={signuppassword}
              placeholder={Taro.T._("pleaseenterpassword")}
              onInput={(e) => this.setState({ signuppassword: e.target.value })}
              placeholderClass="user-login-item-input-placeholder"
              password={true}
            />
          </View>
          <View
            onClick={() => this.onActionWechatSignUp()}
            style={{ marginTop: 18 }}
          >
            <AtButton type="primary" loading={loading}>
              {Taro.T._("submit")}
            </AtButton>
          </View>
        </AtFloatLayout>
        <AtToast
          isOpened={toastIsOpened}
          text={toastText}
          icon={"check-circle"}
          onClose={() => {
            this.setState({ toastIsOpened: false });
          }}
        ></AtToast>
      </View>
    );
  }
}
const mapStateToProps = ({ cart }) => ({
  cart: cart,
});
export default connect(mapStateToProps)(UserLogin);
