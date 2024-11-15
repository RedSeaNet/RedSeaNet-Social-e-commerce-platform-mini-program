import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./index.scss";
import React from "react";
function NavbarTitle(props) {
  const style = {
    paddingTop: Taro.$navBarMarginTop + 10 + "px",
  };
  return (
    <View style={style} className="navbarC">
      <View className="navbarC-navbarWrapTitle" style={style}>
        <View className="navbarC-navbarWrapTitle-navbar">
          <View
            className="navbarC-navbarWrapTitle-navbar-left"
            onClick={() => {
              if (props.redirectUrl && props.redirectUrl != "") {
                Taro.redirectTo({
                  url: props.redirectUrl,
                });
              } else if (props.switchtUrl && props.switchUrl != "") {
                Taro.switchTab({ url: props.switchtUrl });
              } else if (Taro.getCurrentPages().length > 1) {
                Taro.navigateBack();
              } else {
                Taro.switchTab({ url: "/pages/index/index" });
              }
            }}
          >
            <Image
              src={require("./../../assets/arrow-left.png")}
              style={"width:20px;height:16px;padding:2px;"}
            />
          </View>
          <View className="navbarC-navbarWrapTitle-navbar-center">
            <Text>
              {props.title
                ? props.title.length > 10
                  ? props.title.substring(0, 10) + "..."
                  : props.title
                : "RedSeaNet Mall"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
export default NavbarTitle;
