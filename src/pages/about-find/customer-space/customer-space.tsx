import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import "./customer-space.scss";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { connect } from "react-redux";
import {
  forumSpaceData,
  forumToLikeCustomer,
  getForumPostList,
  forumPostReviewSave,
} from "../../../api/request";
import { USER } from "../../../utils/constant";
import { AtIcon, AtToast, AtFloatLayout, AtTextarea, AtButton } from "taro-ui";
import PostItem from "./item/item";
class CustomerSpace extends Component {
  current = getCurrentInstance();
  config = {
    navigationBarTitleText: "myspace",
  };
  state = {
    page: 1,
    list: [],
    user: {},
    spaceId: "",
    spaceData: {},
    followed: false,
    loading: false,
    reviewcontent: "",
    layoutIsOpened: false,
    reviewpostid: "",
    statusBarHeight: 0,
  };
  async componentWillMount() {}
  componentDidMount() {
    let { page } = this.state;
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.setState({ user: userData });
    }
    let spaceId = this.current.router.params.spaceId;
    this.setState({ spaceId: spaceId });
    forumSpaceData(spaceId).then((data) => {
      console.log("----componentDidMount-----");
      console.log(data);
      let followed = false;
      if (data.customerliked && data.customerliked > 0) {
        followed = true;
      }
      this.setState({ spaceData: data, followed: followed });
    });
    let condition = {};
    condition.customer_id = spaceId;
    getForumPostList(condition, page, 20).then((data) => {
      this.setState({ list: data });
    });
    Taro.getSystemInfo({}).then((res) => {
      if (res.statusBarHeight) {
        this.setState({ statusBarHeight: res.statusBarHeight });
      }
    });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  onPullDownRefresh = () => {
    let { page, spaceId } = this.state;
    let condition = {};
    condition.customer_id = spaceId;
    getForumPostList(condition, page, 20).then((data) => {
      this.setState({ list: data });
    });
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  loadMore = async () => {
    console.log("load more");
    let { page, list } = this.state;
    let condition = {};
    condition.customer_id = spaceId;
    let result = await getForumPostList(condition, page, 20);
    result.map((item) => {
      list.push(item);
    });
    this.setState({ page: page + 1, list: list });
  };
  toFollow = (toLikeCustomerId) => {
    let { user, followed } = this.state;
    if (!user || !user.id) {
      Taro.navigateTo({
        url: `/pages/user-login/user-login`,
      });
      return false;
    }
    this.setState({ loading: true });
    forumToLikeCustomer(toLikeCustomerId).then((data) => {
      this.setState({
        followed: followed ? false : true,
        toastIsOpened: true,
        toastText: Taro.T._("followtheusersuccessfully"),
        loading: false,
      });
    });
  };

  handleReviewChange(value) {
    this.setState({
      reviewcontent: value,
    });
    return value;
  }
  onActionReviewClick() {
    console.log("-------onActionReviewClick----");
    let { reviewpostid, reviewcontent } = this.state;
    console.log("-----reviewpostid------");
    console.log(reviewpostid);
    if (reviewcontent == "") {
      this.setState({
        toastIsOpened: true,
        toastIsOpened: true,
        toastText: Taro.T._("pleaseenterreviewcontent"),
      });
      return false;
    }
    let reviewData = {};
    reviewData.content = reviewcontent;
    reviewData.title = reviewcontent;
    forumPostReviewSave(reviewpostid, reviewData).then((data) => {
      console.log(data);
      this.setState({
        toastIsOpened: true,
        toastIsOpened: true,
        toastText: Taro.T._("sendreviewsuccessfully"),
        reviewcontent: "",
        layoutIsOpened: false,
      });
      let { list } = this.state;
      let postList = [];
      if (list.length > 0) {
        list.map((item) => {
          if (reviewpostid == item.id) {
            item.reviews = parseInt(item.reviews) + 1;
            postList.push(item);
          } else {
            postList.push(item);
          }
        });
      }
      this.setState({ list: postList });
    });
  }
  layoutOpenAction = (postId) => {
    let { layoutIsOpened } = this.state;
    console.log("-------layoutOpenAction----");
    if (layoutIsOpened) {
      this.setState({ layoutIsOpened: false, reviewpostid: postId });
    } else {
      this.setState({ layoutIsOpened: true, reviewpostid: postId });
    }
  };

  render() {
    let {
      user,
      spaceData,
      list,
      toastIsOpened,
      toastText,
      loading,
      spaceId,
      followed,
      reviewcontent,
      layoutIsOpened,
      reviewpostid,
      statusBarHeight,
    } = this.state;
    const style = {
      paddingTop: statusBarHeight + "px",
    };
    return (
      <ScrollView
        className="user"
        onScrollToLower={() => {
          this.loadMore();
        }}
      >
        <View className="user-header" style={style}>
          <Image
            src={require("./../../../assets/arrow-left.png")}
            style={"width:20px;height:16px;padding:2px;"}
            onClick={() => {
              if (Taro.getCurrentPages().length > 1) {
                Taro.navigateBack();
              } else {
                Taro.switchTab({ url: "/pages/index/index" });
              }
            }}
          />
        </View>
        <View className="user-login">
          <View className="user-login-avatarandset">
            <View className="user-login-avatarandset-avatar">
              {spaceData.avatar ? (
                <Image
                  src={spaceData.avatar}
                  className="user-login-avatarandset-avatar-img"
                />
              ) : (
                <Image
                  src={require("./../../../assets/bgAvatar.png")}
                  className="user-login-avatarandset-avatar-img"
                />
              )}
              <Text>{spaceData.username ? spaceData.username : null}</Text>
            </View>
            <View className="user-login-avatarandset-set">
              <View className="user-login-avatarandset-set-follow">
                {user.id != spaceId ? (
                  followed ? (
                    <AtButton
                      loading={loading}
                      type="secondary"
                      onClick={() => {
                        this.toFollow(spaceId);
                      }}
                    >
                      {Taro.T._("cancelfollow")}
                    </AtButton>
                  ) : (
                    <AtButton
                      loading={loading}
                      type="primary"
                      onClick={() => {
                        this.toFollow(spaceId);
                      }}
                    >
                      +{Taro.T._("follow")}
                    </AtButton>
                  )
                ) : null}
              </View>
            </View>
          </View>
          <View className="user-login-summary">
            <View>
              <Text>{spaceData.following ? spaceData.following : 0}</Text>
              <Text>{Taro.T._("follow")}</Text>
            </View>
            <View>
              <Text>{spaceData.fans ? spaceData.fans : 0}</Text>
              <Text>{Taro.T._("fans")}</Text>
            </View>
            <View>
              <Text>{spaceData.beliked ? spaceData.beliked : 0}</Text>
              <Text>{Taro.T._("beliked")}</Text>
            </View>
            <View>
              <Text>{spaceData.befavorited ? spaceData.befavorited : 0}</Text>
              <Text>{Taro.T._("befavorited")}</Text>
            </View>
          </View>
        </View>
        <View className="user-posts">
          {list.length > 0
            ? list.map((item, idx) => {
                return (
                  <PostItem
                    {...item}
                    user={user}
                    layoutOpenAction={(postId) => this.layoutOpenAction(postId)}
                  />
                );
              })
            : ""}
        </View>
        <AtFloatLayout
          isOpened={layoutIsOpened}
          title={Taro.T._("review")}
          onClose={() => {
            this.setState({ layoutIsOpened: false });
          }}
        >
          <View>
            <AtTextarea
              value={reviewcontent}
              onChange={this.handleReviewChange.bind(this)}
              maxLength={200}
              placeholder={Taro.T._("pleaseenterreviewcontent")}
            />
          </View>
          <View
            className="user-sendreviewbutton"
            onClick={() => this.onActionReviewClick()}
          >
            <AtButton type="primary" loading={loading}>
              {Taro.T._("send")}
            </AtButton>
          </View>
        </AtFloatLayout>
        <AtToast
          isOpened={toastIsOpened}
          text={toastText}
          icon={"check-circle"}
        ></AtToast>
      </ScrollView>
    );
  }
}
const mapStateToProps = ({ forumCategory }) => ({
  forumCategory,
});
export default connect(mapStateToProps)(CustomerSpace);
