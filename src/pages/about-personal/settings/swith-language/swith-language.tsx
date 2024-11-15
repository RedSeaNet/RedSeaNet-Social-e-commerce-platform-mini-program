import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Input, Button, Text } from "@tarojs/components";
import "./swith-language.scss";
import T from "../../../../utils/i18n";
import locales from "../../../../utils/locales";
import { USER, LOCALE, LOCALEID } from "../../../../utils/constant";
import Navbar from "../../../../component/navbarTitle/index";
export default class SwithLanguage extends Component {
  config = {
    navigationBarTitleText: "切换语言",
  };

  constructor(props) {
    super(props);
  }
  handerSwithLanguage = async (language, languageId) => {
    //await Taro.setStorage({key: LOCALE, data: 'zh'});
    Taro.setStorage({ key: LOCALE, data: language });
    Taro.setStorage({ key: LOCALEID, data: languageId });
    Taro.T = new T(locales, language);
    Taro.setTabBarItem({
      index: 0,
      text: Taro.T._("home"),
    });
    Taro.setTabBarItem({
      index: 1,
      text: Taro.T._("social"),
    }),
      Taro.setTabBarItem({
        index: 2,
        text: Taro.T._("message"),
      }),
      Taro.setTabBarItem({
        index: 3,
        text: Taro.T._("cart"),
      }),
      Taro.setTabBarItem({
        index: 4,
        text: Taro.T._("my"),
      });
    Taro.reLaunch({ url: "/pages/index/index" });
  };

  render() {
    let locale = Taro.getStorageSync(LOCALE);
    console.log(locale);
    return (
      <View className="swith-language">
        <Navbar title={Taro.T._("swithlanguage")} />
        <View
          className="swith-language-item"
          onClick={() => {
            this.handerSwithLanguage("zh", "2");
          }}
          style={locale == "zh" ? "background-color: rgb(207, 8, 94)" : ""}
        >
          <Text>简体中文</Text>
          <Text>></Text>
        </View>
        <View
          className="swith-language-item"
          onClick={() => {
            this.handerSwithLanguage("zh_HK", "3");
          }}
          style={
            locale == "zh_HK" ? "background-color: rgb(207, 8, 94);col" : ""
          }
        >
          <Text>繁體中文</Text>
          <Text>></Text>
        </View>
        <View
          className="swith-language-item"
          onClick={() => {
            this.handerSwithLanguage("en", "1");
          }}
          style={locale == "en" ? "background-color: rgb(207, 8, 94)" : ""}
        >
          <Text>English</Text>
          <Text>></Text>
        </View>
      </View>
    );
  }
}
