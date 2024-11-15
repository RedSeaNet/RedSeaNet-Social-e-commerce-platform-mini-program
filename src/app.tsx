import { Component } from "react";
import Taro from "@tarojs/taro";
import "taro-ui/dist/style/index.scss"; // 全局引入一次即可
import configStore from "./store";
import { Provider } from "react-redux";
import "taro-ui/dist/style/index.scss"; // 全局引入一次即可
import { getToken } from "./api/request";
import "./app.scss";
import locales from "./utils/locales";
import T from "./utils/i18n";
import { LOCALE, LOCALEID, CURRENCY } from "./utils/constant";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {
  async componentWillMount() {
    //处理token
    await getToken();
    this.initLocale();
  }
  //初始化国际化
  initLocale = async () => {
    let locale = Taro.getStorageSync(LOCALE);
    if (!locale) {
      const systemInfo = await Taro.getSystemInfo();
      let sysCodeLang = systemInfo.language;
      let secondStr = sysCodeLang.substring(0, 2);
      if (secondStr == "zh") {
        if (sysCodeLang == "zh_Hk" || sysCodeLang == "zh_TW") {
          locale = "zh_Hk";
        } else {
          locale = "zh";
        }
      } else if (secondStr == "en") {
        locale = "en";
      } else {
        locale = "zh";
      }
      Taro.setStorage({ key: LOCALE, data: locale });
    }
    if (locale == "zh") {
      Taro.setStorage({ key: LOCALEID, data: 1 });
    } else if (locale == "zh_HK") {
      Taro.setStorage({ key: LOCALEID, data: 3 });
    } else {
      Taro.setStorage({ key: LOCALEID, data: 2 });
    }
    console.log("locale:" + locale);
    Taro.T = new T(locales, locale);
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
  };
  async componentDidMount() {
    let currencyData = Taro.getStorageSync(CURRENCY);
    if (!currencyData.code) {
      let currency = { code: "CNY", id: "3", symbol: "￥" };
      Taro.setStorage({ key: CURRENCY, data: currency });
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}
Taro.getSystemInfo({}).then((res) => {
  Taro.$navBarMarginTop = res.statusBarHeight || 0;
});
export default App;
