import React, { Component } from "react";
import Taro from "@tarojs/taro";
import "./find.scss";
import { View, Text, ScrollView } from "@tarojs/components";
import { connect } from "react-redux";
import { AtIcon, AtToast, AtFloatLayout, AtTextarea, AtButton } from "taro-ui";
import {
  requestFroumCategory,
  requestFroumPost,
  changeForumPost,
} from "../../../store/actions/forum";
import NavbarIndex from "../../../component/navbarIndex/index";
import { USER } from "../../../utils/constant";
import PostItem from "./item/item";
import { forumPostReviewSave } from "./../../../api/request";
class Find extends Component {
  config = {
    navigationBarTitleText: "发现",
  };
  state = {
    user: {},
    loading: false,
    reviewcontent: "",
    layoutIsOpened: false,
    toastIsOpened: false,
    toastText: false,
    reviewpostid: "",
    page: 1,
    categoryId: "",
    refresherTriggered: false,
  };
  async componentWillMount() {}
  componentDidMount() {
    this.props.dispatch(requestFroumCategory());
    this.props.dispatch(requestFroumPost());
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.setState({ user: userData });
    }
  }

  componentWillUnmount() {}

  componentDidShow() {
    let productCount = this.props.cart.cart.productCount
      ? this.props.cart.cart.productCount
      : 0;
    console.log("productCount:" + productCount);
    Taro.setTabBarBadge({
      index: 3,
      text: "" + productCount,
    });
  }

  componentDidHide() {}

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
        toastText: Taro.T._("sendreviewsuccessfully"),
        reviewcontent: "",
        layoutIsOpened: false,
      });
      let { forumPostInfo } = this.props;
      let postList = [];
      if (forumPostInfo.postList && forumPostInfo.postList.length > 0) {
        forumPostInfo.postList.map((item) => {
          if (reviewpostid == item.id) {
            item.reviews = parseInt(item.reviews) + 1;
            postList.push(item);
          } else {
            postList.push(item);
          }
        });
      }
      this.props.dispatch(changeForumPost(postList));
    });
  }
  layoutOpenAction = (postId) => {
    let userData = Taro.getStorageSync(USER);
    if (!userData.id) {
      Taro.navigateTo({ url: "/pages/about-personal/user-login/user-login" });
      Taro.showToast({
        title: Taro.T._("pleaseloginforcontinue") + "!",
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    let { layoutIsOpened } = this.state;
    console.log("-------layoutOpenAction----");
    if (layoutIsOpened) {
      this.setState({ layoutIsOpened: false, reviewpostid: postId });
    } else {
      this.setState({ layoutIsOpened: true, reviewpostid: postId });
    }
  };
  onPullDownRefresh = () => {
    this.props.dispatch(requestFroumPost({}, 1, 20));
    this.setState({ page: 1, refresherTriggered: true });
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      this.setState({ refresherTriggered: false });
    }, 1000);
  };
  loadMore = () => {
    console.log("----loadMore-----");
    let { page } = this.state;
    this.props.dispatch(requestFroumPost({}, page + 1, 20));
    this.setState({ page: page + 1 });
  };
  chooseCategory = (categoryId) => {
    let condition = {};
    if (categoryId != "") {
      condition.category_id = categoryId;
    }
    this.props.dispatch(requestFroumPost(condition, 1, 20));
    this.setState({ categoryId: categoryId, page: 1 });
  };
  onShareAppMessage = (res) => {
    return {
      title: "红海互联 RedSea Mall",
      imageUrl:
        "https://store.redseanet.com/pub/theme/blue/frontend/images/logo.png",
      path: "pages/index/index",
      desc: "红海互联多语言多货币社交电商系统",
    };
  };
  onShareTimeline = (res) => {
    return {
      title: "红海互联 RedSea Mall",
      imageUrl:
        "https://store.redseanet.com/pub/theme/blue/frontend/images/logo.png",
      path: "pages/index/index",
      desc: "红海互联多语言多货币社交电商系统",
    };
  };
  render() {
    let { forumCategory, forumPostInfo } = this.props;
    let {
      user,
      reviewcontent,
      layoutIsOpened,
      toastIsOpened,
      toastText,
      loading,
      categoryId,
      refresherTriggered,
    } = this.state;
    const height = Taro.getSystemInfoSync().windowHeight;
    return (
      <ScrollView
        className="find"
        scrollY="true"
        scrollTop="0"
        upperThreshold="200"
        lowerThreshold="100"
        refresherEnabled="true"
        refresherTriggered={refresherTriggered}
        style={{ height: height + "px" }}
        onScrollToLower={() => {
          this.loadMore();
        }}
        onRefresherRefresh={() => {
          this.onPullDownRefresh();
        }}
      >
        <NavbarIndex />
        <View className="find-category">
          <Text
            className="find-category-texta"
            style={
              categoryId == ""
                ? {
                    borderBottom: "4px solid #d62c75",
                  }
                : ""
            }
            onClick={() => this.chooseCategory("")}
          >
            {Taro.T._("all")}
          </Text>
          {forumCategory.forumCategoryList &&
          forumCategory.forumCategoryList.length > 0
            ? forumCategory.forumCategoryList.map((item, idx) => {
                return (
                  <Text
                    className="find-category-texta"
                    style={
                      categoryId == item.id
                        ? {
                            borderBottom: "4px solid #d62c75",
                          }
                        : ""
                    }
                    onClick={() => this.chooseCategory(item.id)}
                  >
                    {item.name}
                  </Text>
                );
              })
            : ""}
        </View>
        <View className="find-list">
          {forumPostInfo.postList && forumPostInfo.postList.length > 0
            ? forumPostInfo.postList.map((item, idx) => {
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
            className="find-sendreviewbutton"
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
const mapStateToProps = ({ user, forumCategory, forumPostInfo, cart }) => ({
  user: user,
  forumCategory,
  forumPostInfo,
  cart,
});
export default connect(mapStateToProps)(Find);
