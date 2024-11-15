import { Component } from "react";
import Taro from "@tarojs/taro";
import {
  View,
  Input,
  Button,
  Text,
  Image,
  CoverView,
} from "@tarojs/components";
import { AtInput, AtAvatar, AtRadio } from "taro-ui";
import "./user-info.scss";
import { USER } from "../../../../utils/constant";
import { customerUpdate } from "../../../../api/request";
import Navbar from "../../../../component/navbarTitle/index";
import { connect } from "react-redux";
import TaroCropper from "../../../../component/taroCropper/index";
class UserInfo extends Component {
  config = {
    navigationBarTitleText: "修改个人信息",
  };
  constructor(props) {
    super(props);
  }
  state = {
    gender: 1,
    user: {},
    showCropper: false,
  };
  handleUserInfo = () => {
    let updateData = {};
    updateData.gender = this.state.gender;
    customerUpdate(updateData);
  };
  handleAvatar = async (avatar) => {
    let updateData = {};
    updateData.avatar = avatar;
    let userData = await customerUpdate(updateData);
    this.setState({ showCropper: false, user: userData });
  };
  handleAvatarCancel = () => {
    this.setState({ showCropper: false });
  };
  componentDidMount() {
    let user = Taro.getStorageSync(USER);
    console.log(user);
    this.setState({ gender: user.gender, user: user });
  }
  render() {
    let { user, gender, showCropper } = this.state;
    return (
      <View className="user-info">
        <Navbar title={Taro.T._("profile")} />
        <View className="user-info-item">
          <View className="user-info-item-left">
            <Text>{Taro.T._("avatar")}:</Text>
          </View>
          <View
            onClick={() => {
              this.setState({ showCropper: true });
              console.log(showCropper);
            }}
          >
            <AtAvatar
              circle
              text="avatar"
              size="large"
              image={user.avatar}
            ></AtAvatar>
          </View>
        </View>
        <View className="user-info-item">
          <View className="user-info-item-left">
            <Text>{Taro.T._("username")}:</Text>
          </View>
          <View>
            <Text>{user.username}</Text>
          </View>
        </View>

        <View className="user-info-item">
          <View className="user-info-item-left">
            <Text>{Taro.T._("gender")}:</Text>
          </View>
          <View className="user-info-item-sex">
            <View
              className="user-info-item-sex-v"
              onClick={() => {
                this.setState({ gender: "1" });
              }}
            >
              <Image
                src={
                  gender == "1"
                    ? require("../../assets/agree.png")
                    : require("../../assets/unagree.png")
                }
                className="user-info-item-sex-v-img"
              />{" "}
              <Text>{Taro.T._("male")}</Text>
            </View>
            <View
              className="user-info-item-sex-v"
              onClick={() => {
                this.setState({ gender: "0" });
              }}
            >
              <Image
                src={
                  gender == "0"
                    ? require("../../assets/agree.png")
                    : require("../../assets/unagree.png")
                }
                className="user-info-item-sex-v-img"
              />{" "}
              <Text>{Taro.T._("female")}</Text>
            </View>
          </View>
        </View>
        <View className="user-info-button" onClick={this.handleUserInfo}>
          <Text>{Taro.T._("save")}</Text>
        </View>
        {showCropper ? (
          <View className="user-info-cropper">
            <TaroCropper
              handleCropper={this.handleAvatar}
              handleCancel={this.handleAvatarCancel}
            />
          </View>
        ) : null}
      </View>
    );
  }
}
const mapStateToProps = ({ cart }) => ({
  cart: cart,
});

export default connect(mapStateToProps)(UserInfo);
