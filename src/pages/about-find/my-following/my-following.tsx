import React, { Component } from "react";
import Taro from "@tarojs/taro";
import "./my-following.scss";
import { View, Text } from "@tarojs/components";
import { connect } from "react-redux";
import Navbar from "../../../component/navbarTitle/index";
import { getFollow } from "../../../api/request";
import { USER } from "../../../utils/constant";
import EmptyTemplate from "../../../component/emptyTemplate/index";
class MyFollowing extends Component {
  config = {
    navigationBarTitleText: "following",
  };
  state = {
    page: 1,
    list: [],
    user: {},
  };
  async componentWillMount() {}
  componentDidMount() {
    let { page } = this.state;
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.setState({ user: userData });
    }

    getFollow(page, 20).then((data) => {
      console.log("----componentDidMount-----");
      console.log(data);
      this.setState({ list: data });
    });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  onPullDownRefresh = () => {
    let { page } = this.state;
    getFollow(page, 20).then((data) => {
      this.setState({ list: data });
    });
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  loadMore = () => {
    console.log("load more");
    let { page, list } = this.state;
    getFollow(page + 1, 20).then((data) => {
      data.map((item) => {
        list.push(item);
      });
    });
    this.setState({ page: page + 1, list: list });
  };
  goToCustomer = (custoemrId) => {
    console.log("custoemrId:" + custoemrId);
    Taro.navigateTo({
      url: `/pages/about-find/customer-space/customer-space?spaceId=${custoemrId}`,
    });
  };
  render() {
    let { list } = this.state;
    return (
      <View className="find">
        <Navbar title={Taro.T._("following")} />
        <View className="find-list">
          {list.length > 0 ? (
            list.map((item, idx) => {
              return (
                <View key={item.id} className="find-list-container">
                  <View className="find-list-container-customer">
                    <View className="find-list-container-customer-avatar">
                      <image src={item.avatar} />
                    </View>
                    <View className="find-list-container-customer-right">
                      <Text className="find-list-container-customer-right-username">
                        {item.username}
                      </Text>
                      <Text className="find-list-container-customer-right-date">
                        {item.created_at}
                      </Text>
                    </View>
                  </View>
                  <View className="find-list-container-title">
                    <Text>{item.motto}</Text>
                  </View>
                  <View className="find-list-container-bottom">
                    <Text
                      onClick={() => {
                        this.goToCustomer(item.customer_id);
                      }}
                      className="find-list-container-bottom-button"
                    >
                      {Taro.T._("view")}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <EmptyTemplate title={Taro.T._("followingisempty")} />
          )}
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({ forumCategory }) => ({
  forumCategory,
});
export default connect(mapStateToProps)(MyFollowing);
