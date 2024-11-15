import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./clear-cache.scss";
import Navbar from "../../../../component/navbarTitle/index";
export default class ClearCache extends Component {
  config = {
    navigationBarTitleText: "清除缓存",
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View className="clear-cache">
        <Navbar title={Taro.T._("clearcache")} />
        <Text>clear cache</Text>
      </View>
    );
  }
}
