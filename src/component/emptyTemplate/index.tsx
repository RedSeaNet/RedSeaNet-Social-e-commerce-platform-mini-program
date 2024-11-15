import { View, Image, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import React, { Component } from "react";
function EmptyTemplate(props) {
  return (
    <View className="container">
      <View className="container-emptyview">
        <Image
          src={require("./../../assets/empty.png")}
          className="container-emptyview-image"
        />
        <Text>
          {props.title ? props.title.substring(0, 40) : Taro.T._("nodatayet")}
        </Text>
      </View>
    </View>
  );
}
export default EmptyTemplate;
