import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import React, { Component } from "react";
class NavbarIndex extends Component {
  constructor(props) {
    super(props);
  }
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
      paddingTop: this.state.statusBarHeight + "px",
    };
    return (
      <View style={style} className="navbarC">
        <View className="navbarC-navbarWrapIndex" style={style}>
          <View className="navbarC-navbarWrapIndex-navbar">
            <View className="navbarC-navbarWrapIndex-navbar-center">
              <Image
                src={require("./../../assets/logo.png")}
                style={"width:67px;height:24px;padding:2px;"}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default NavbarIndex;
