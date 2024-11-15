import React, { Component } from "react";
import Taro from "@tarojs/taro";
import "./my-post.scss";
import { View, Text } from "@tarojs/components";
import { connect } from "react-redux";
import { AtIcon } from "taro-ui";
import Navbar from "../../../component/navbarTitle/index";
import { getForumPostList } from "../../../api/request";
import { USER } from "../../../utils/constant";
import EmptyTemplate from "../../../component/emptyTemplate/index";
class MyPost extends Component {
  config = {
    navigationBarTitleText: "My post",
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
    let condition = {};
    condition.customer_id = userData.id;
    getForumPostList(condition, page, 20).then((data) => {
      this.setState({ list: data });
    });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  onPullDownRefresh = () => {
    let { page, user } = this.state;
    let condition = {};
    condition.customer_id = user.id;
    getForumPostList(condition, page, 20).then((data) => {
      this.setState({ list: data });
    });
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  loadMore = () => {
    console.log("load more");
    let { page, list, user } = this.state;
    let condition = {};
    condition.customer_id = user.id;
    getForumPostList(condition, page + 1, 20).then((data) => {
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
        <Navbar title={Taro.T._("mypostlist")} />
        <View className="find-list">
          {list.length > 0 ? (
            list.map((item, idx) => {
              return (
                <View
                  key={item.id}
                  onClick={() => this.handleClick(item.id)}
                  className="find-list-container"
                >
                  <View className="find-list-container-customer">
                    <View className="find-list-container-customer-avatar">
                      <image src={item.customer_avatar} />
                    </View>
                    <View className="find-list-container-customer-right">
                      <Text className="find-list-container-customer-right-username">
                        {item.customer_name}
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
                  <View className="find-list-container-bottom">
                    <AtIcon value="edit" size="12" color="#707070"></AtIcon>
                    <Text>0 </Text>
                    <AtIcon value="heart" size="12" color="#707070"></AtIcon>
                    <Text>0 </Text>
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
export default connect(mapStateToProps)(MyPost);
