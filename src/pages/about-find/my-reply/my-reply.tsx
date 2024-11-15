import React, { Component } from "react";
import Taro from "@tarojs/taro";
import "./my-reply.scss";
import { View, Text, ScrollView } from "@tarojs/components";
import { connect } from "react-redux";
import {
  AtIcon,
  AtToast,
  AtFloatLayout,
  AtTextarea,
  AtButton,
  AtAvatar,
} from "taro-ui";
import Navbar from "../../../component/navbarTitle/index";
import { forumPostReplyList, forumPostReviewSave } from "../../../api/request";
import { USER } from "../../../utils/constant";
import EmptyTemplate from "../../../component/emptyTemplate/index";
class MyReply extends Component {
  config = {
    navigationBarTitleText: "My reply",
  };
  state = {
    page: 1,
    list: [],
    user: {},
    loading: false,
    reviewcontent: "",
    layoutIsOpened: false,
    reviewpostid: "",
    reviewreferenceid: "",
    toastIsOpened: false,
    toastText: "",
  };
  async componentWillMount() {}
  componentDidMount() {
    let { page } = this.state;
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.setState({ user: userData });
    }

    forumPostReplyList(page, 20).then((data) => {
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
    forumPostReplyList(page, 20).then((data) => {
      this.setState({ list: data });
    });
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  loadMore = () => {
    console.log("load more");
    let { page, list } = this.state;
    forumPostReplyList(page + 1, 20).then((data) => {
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
  handleReviewChange(value) {
    this.setState({
      reviewcontent: value,
    });
    4;
    return value;
  }
  onActionReviewClick() {
    console.log("-------onActionReviewClick----");
    let { reviewpostid, reviewcontent, reviewreferenceid } = this.state;
    console.log("-----reviewpostid------");
    console.log(reviewpostid);
    console.log("----------reviewreferenceid------------");
    console.log(reviewreferenceid);
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
    reviewData.reference = reviewreferenceid;
    forumPostReviewSave(reviewpostid, reviewData).then((data) => {
      console.log(data);
      this.setState({
        toastIsOpened: true,
        toastIsOpened: true,
        toastText: Taro.T._("sendreviewsuccessfully"),
        reviewcontent: "",
        layoutIsOpened: false,
      });
      forumPostReplyList(1, 20).then((data) => {
        console.log("----componentDidMount-----");
        console.log(data);
        this.setState({ list: data, page: 1 });
      });
    });
  }
  layoutOpenAction = (postId, referenceId) => {
    let { layoutIsOpened } = this.state;
    console.log("-------layoutOpenAction----");
    if (layoutIsOpened) {
      this.setState({
        layoutIsOpened: false,
        reviewpostid: postId,
        reviewreferenceid: referenceId,
      });
    } else {
      this.setState({
        layoutIsOpened: true,
        reviewpostid: postId,
        reviewreferenceid: referenceId,
      });
    }
  };
  render() {
    let {
      list,
      reviewcontent,
      layoutIsOpened,
      loading,
      toastIsOpened,
      toastText,
    } = this.state;
    return (
      <ScrollView className="find">
        <Navbar title={Taro.T._("repliesmanagement")} />
        <View className="find-list">
          {list.length > 0 ? (
            list.map((item, idx) => {
              return (
                <View key={idx} className="find-list-container">
                  <View className="find-list-container-customer">
                    <View className="find-list-container-customer-avatar">
                      <image src={item.customer_avatar} />
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
                    <Text onClick={() => this.handleClick(item.post_id)}>
                      {item.content}
                    </Text>
                  </View>
                  <View className="find-list-container-bottom">
                    <Text
                      className="find-list-container-bottom-reply"
                      onClick={() =>
                        this.layoutOpenAction(item.post_id, item.id)
                      }
                    >
                      {Taro.T._("reply")}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <EmptyTemplate title={Taro.T._("thereisnoreview")} />
          )}
        </View>
        <AtFloatLayout
          isOpened={layoutIsOpened}
          title={Taro.T._("reply")}
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
const mapStateToProps = ({ forumCategory }) => ({
  forumCategory,
});
export default connect(mapStateToProps)(MyReply);
