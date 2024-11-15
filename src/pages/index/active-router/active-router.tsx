import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "react-redux";
import React, { Component } from "react";
class ActiveRouter extends Component {
  current = getCurrentInstance();
  constructor(props) {
    super(props);
    this.state = {
      scene: "",
    };
  }

  componentWillMount() {
    this.setState({ scene: this.current.router.params.scene });
    if (this.current.router.params.scene) {
      const scene = this.current.router.params.scene;
      let paramsArray = scene.split("-");
      if (paramsArray[0] && paramsArray[0] == 1) {
        if (
          paramsArray[1] &&
          paramsArray[2] &&
          paramsArray[1] != "" &&
          paramsArray[2] != ""
        ) {
          Taro.redirectTo({
            url: `/pages/about-order/bargain-detail/bargain-detail?bargain_id=${paramsArray[1]}&bargain_user_id=${paramsArray[2]}`,
          });
        } else {
          Taro.switchTab({ url: "/pages/tabBar/index/index" });
        }
      } else {
        Taro.switchTab({ url: "/pages/tabBar/index/index" });
      }
    } else {
      Taro.switchTab({ url: "/pages/tabBar/index/index" });
    }
  }
  componentDidMount() {}
  render() {
    let { scene } = this.state;
    return (
      <View>
        <View>
          <Text>scene:{scene}</Text>
        </View>
      </View>
    );
  }
}
export default connect(({}) => ({}))(ActiveRouter);
