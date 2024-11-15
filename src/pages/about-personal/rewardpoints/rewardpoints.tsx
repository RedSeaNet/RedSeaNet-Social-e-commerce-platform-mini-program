import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView, Text, Image } from "@tarojs/components";
import { connect } from "react-redux";
import Navbar from "../../../component/navbarTitle/index";
import "./rewardpoints.scss";
import { getRewardPointsList } from "../../../api/request";
import { USER } from "../../../utils/constant";
class Rewardpoints extends Component {
  current = getCurrentInstance();
  config = {
    navigationBarTitleText: "Reward Points",
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
  };
  state = {
    page: 1,
    list: [],
    user: {},
  };
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let { page } = this.state;
    getRewardPointsList([], page, 20).then((data) => {
      this.setState({ list: data });
    });
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.setState({ user: userData });
    }
  }

  onPullDownRefresh = () => {
    let { page } = this.state;
    getRewardPointsList([], page, 20).then((data) => {
      this.setState({ list: data });
    });
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  loadMore = () => {
    console.log("load more");
    let { page, list } = this.state;
    getRewardPointsList([], page + 1, 20).then((data) => {
      data.map((item) => {
        list.push(item);
      });
    });
    this.setState({ page: page + 1, list: list });
  };

  render() {
    const height = Taro.getSystemInfoSync().windowHeight;
    const { list, user } = this.state;
    return (
      <View style={{ position: "relative", overflow: "hidden" }}>
        <Navbar title={Taro.T._("rewardpoints")} />
        <ScrollView
          scrollY
          scrollTop="0"
          style={{ height: height + "px" }}
          lowerThreshold="20"
          upperThreshold="20"
          onScrollToLower={() => {
            this.loadMore();
          }}
        >
          <View className="container">
            <View className="container-header">
              <Text>{Taro.T._("total")}: </Text>
              <Text className="container-header-total">
                {user.rewardpoints ? user.rewardpoints : 0}
              </Text>
            </View>
            {list && list.length > 0
              ? list.map((item, idx) => {
                  return (
                    <View className="container-item" key={item.id}>
                      <View className="container-item-left">
                        <Text className="container-item-left-comment">
                          {item.comment_string}
                        </Text>
                        <Text className="container-item-left-status">
                          {Taro.T._("status") + ":" + item.status_string}
                        </Text>
                        <Text className="container-item-left-date">
                          {item.created_at}
                        </Text>
                      </View>
                      <View className="container-item-right">
                        <View className="container-item-right-amount">
                          <Text>{parseInt(item.count)}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user: user,
});
export default connect(mapStateToProps)(Rewardpoints);
