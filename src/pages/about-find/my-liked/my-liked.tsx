import React, { Component } from "react";
import Taro from "@tarojs/taro";
import "./my-liked.scss";
import { View, Text } from "@tarojs/components";
import { connect } from "react-redux";
import { AtIcon } from "taro-ui";
import Navbar from "../../../component/navbarTitle/index";
import { getMyLiked } from "../../../api/request";
import { USER } from "../../../utils/constant";
import EmptyTemplate from "../../../component/emptyTemplate/index";
class MyLiked extends Component {
  config = {
    navigationBarTitleText: "liked",
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

    getMyLiked(page, 20).then((data) => {
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
    getMyLiked(page, 20).then((data) => {
      this.setState({ list: data });
    });
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  loadMore = () => {
    console.log("load more");
    let { page, list } = this.state;
    getMyLiked(page + 1, 20).then((data) => {
      data.map((item) => {
        list.push(item);
      });
    });
    this.setState({ page: page + 1, list: list });
  };
  handleClick = (postId) => {
    console.log("postId:" + postId);
    Taro.navigateTo({
      url: `/pages/about-find/find-detail/find-detail?postId=${postId}`,
    });
  };
  render() {
    let { list } = this.state;
    return (
      <View className="find">
        <Navbar title={Taro.T._("liked")} />
        <View className="find-list">
          {list.length > 0 ? (
            list.map((item, idx) => {
              return (
                <View
                  key={item.id}
                  onClick={() => this.handleClick(item.post_id)}
                  className="find-list-container"
                >
                  <View className="find-list-container-customer">
                    <View className="find-list-container-customer-avatar">
                      <image src={item.avatar} />
                    </View>
                    <View className="find-list-container-customer-right">
                      <Text className="find-list-container-customer-right-username">
                        {item.author}
                      </Text>
                      <Text className="find-list-container-customer-right-date">
                        {item.created_at}
                      </Text>
                    </View>
                  </View>
                  <View className="find-list-container-title">
                    <Text>{item.title}</Text>
                  </View>
                  <View className="find-list-container-images">
                    {item.images && item.images.length > 0
                      ? item.images.map((image) => {
                          return <image src={image} mode="widthFix" />;
                        })
                      : null}
                  </View>
                </View>
              );
            })
          ) : (
            <EmptyTemplate title={Taro.T._("thereisnopost")} />
          )}
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({ forumCategory }) => ({
  forumCategory,
});
export default connect(mapStateToProps)(MyLiked);
