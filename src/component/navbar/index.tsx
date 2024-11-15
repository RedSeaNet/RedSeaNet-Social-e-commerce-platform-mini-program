import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import React, { Component } from "react";
class Navbar extends Component {
  state = {
    statusBarHeight: 0,
  };
  componentDidMount() {
    Taro.getSystemInfo({}).then((res) => {
      if (res.statusBarHeight) {
        this.setState({ statusBarHeight: res.statusBarHeight });
      }
    });
  }
  render() {
    const style = {
      paddingTop: this.state.statusBarHeight + 10 + "px",
    };
    // 将状态栏的区域空余出来
    return (
      <View style={style} className="navbarC">
        <View className="navbarC-navbarWrap" style={style}>
          <View className="navbarC-navbarWrap-navbar">
            {/* <View className='navbarC-navbarWrap-navbar-left'>
                            <Image src={require('../../assets/arrow-left.png')} style={"width:20px;height:16px;padding:2px;"} onClick={() => {
                                if (Taro.getCurrentPages().length > 1) {
                                    Taro.navigateBack();
                                } else {
                                    Taro.switchTab({ url: '/pages/index/index' });
                                }
                            }} />
                        </View> */}
            <View className="navbarC-navbarWrap-navbar-center">
              <Image
                src={require("../../assets/logo.png")}
                style={"width:67px;height:24px;padding:2px;"}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default Navbar;
