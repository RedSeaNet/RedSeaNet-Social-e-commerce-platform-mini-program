import React, { Component } from "react";
import Taro from "@tarojs/taro";
import "./my-favorited.scss";
import { View, Text } from "@tarojs/components";
import { connect } from "react-redux";
import { AtIcon, AtToast, AtFloatLayout, AtTextarea, AtButton } from "taro-ui";
import Navbar from "../../../component/navbarTitle/index";
import EmptyTemplate from "../../../component/emptyTemplate/index";
import {
  getFavoritedWithPosts,
  forumPostReviewSave,
} from "../../../api/request";
import { USER } from "../../../utils/constant";
import PostItem from "./item/item";
class MyFavorited extends Component {
  config = {
    navigationBarTitleText: "favoritedpost",
  };
  state = {
    page: 1,
    list: [],
    user: {},
    loading: false,
    reviewcontent: "",
    layoutIsOpened: false,
    loading: false,
    toastIsOpened: false,
    toastText: false,
    reviewpostid: "",
  };
  async componentWillMount() {}
  componentDidMount() {
    let { page } = this.state;
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.setState({ user: userData });
    }

    getFavoritedWithPosts(page, 20).then((data) => {
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
    getFavoritedWithPosts(page, 20).then((data) => {
      this.setState({ list: data });
    });
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  loadMore = () => {
    console.log("load more");
    let { page, list } = this.state;
    getFavoritedWithPosts(page + 1, 20).then((data) => {
      data.map((item) => {
        list.push(item);
      });
    });
    this.setState({ page: page + 1, list: list });
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
      list,
      user,
      reviewcontent,
      layoutIsOpened,
      toastIsOpened,
      toastText,
      loading,
    } = this.state;
    return (
      <View className="find">
        <Navbar title={Taro.T._("favoritedpost")} />
        <View className="find-list">
          {list.length > 0 ? (
            list.map((item, idx) => {
              return (
                <PostItem
                  {...item}
                  user={user}
                  layoutOpenAction={(postId) => this.layoutOpenAction(postId)}
                />
              );
            })
          ) : (
            <EmptyTemplate title={Taro.T._("thereisnopost")} />
          )}
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
      </View>
    );
  }
}
const mapStateToProps = ({ forumCategory }) => ({
  forumCategory,
});
export default connect(mapStateToProps)(MyFavorited);
