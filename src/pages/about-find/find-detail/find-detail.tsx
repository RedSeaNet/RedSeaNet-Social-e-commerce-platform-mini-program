import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { connect } from "react-redux";
import {
  View,
  WebView,
  Text,
  Image,
  Button,
  ScrollView,
  Video,
} from "@tarojs/components";
import FindDetailSwiper from "./find-detail-swiper/find-detail-swiper";
import {
  getForumPostById,
  forumToLikeCustomer,
  forumLikePost,
  forumFavoritePost,
  forumPostReviewList,
  forumPostReviewSave,
} from "./../../../api/request";
import Navbar from "../../../component/navbarTitle/index";
import {
  AtIcon,
  AtToast,
  AtFloatLayout,
  AtTextarea,
  AtButton,
  AtTag,
  AtAvatar,
} from "taro-ui";
import "./find-detail.scss";
import { USER } from "../../../utils/constant";
class FindDetail extends Component {
  current = getCurrentInstance();
  constructor(props) {
    super(props);
  }
  state = {
    detail: {},
    followed: false,
    user: {},
    liked: false,
    toastIsOpened: false,
    toastText: "",
    favorited: false,
    page: 1,
    reviewlist: [],
    reviewcontent: "",
    layoutIsOpened: false,
    loading: false,
  };
  handleMessage() {}

  componentDidMount() {
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.setState({ user: userData });
    }
    let postId = this.current.router.params.postId;
    getForumPostById(postId).then((data) => {
      console.log("getForumPostById data:");
      console.log(data);
      let followed = false;
      if (data.customerliked && data.customerliked > 0) {
        followed = true;
      }
      let liked = false;
      if (
        (userData.id && userData.id == data.customer_id) ||
        (data.liked && data.liked > 0)
      ) {
        liked = true;
      }
      let favorited = false;
      if (
        (userData.id && userData.id == data.customer_id) ||
        (data.favorited && data.favorited > 0)
      ) {
        favorited = true;
      }
      this.setState({
        detail: data,
        followed: followed,
        liked: liked,
        favorited: favorited,
        reviewlist: data.reviewlist,
      });
    });
    Taro.showShareMenu({
      withShareTicket: true,
    });
  }
  toFollow = (toLikeCustomerId) => {
    let { user } = this.state;
    if (!user || !user.id) {
      Taro.navigateTo({
        url: `/pages/user-login/user-login`,
      });
      return false;
    }
    forumToLikeCustomer(toLikeCustomerId).then((data) => {
      this.setState({
        followed: true,
        toastIsOpened: true,
        toastText: Taro.T._("followtheusersuccessfully"),
      });
    });
  };
  toLike = () => {
    let { detail, user } = this.state;
    if (!user || !user.id) {
      Taro.navigateTo({
        url: `/pages/user-login/user-login`,
      });
      return false;
    }
    forumLikePost(detail.id).then((data) => {
      this.setState({
        liked: true,
        toastIsOpened: true,
        toastText: Taro.T._("likedpostsuccessfully"),
      });
    });
  };
  toFavoritePost = () => {
    let { detail, user } = this.state;
    if (!user || !user.id) {
      Taro.navigateTo({
        url: `/pages/user-login/user-login`,
      });
      return false;
    }
    forumFavoritePost(detail.id).then((data) => {
      this.setState({
        favorited: true,
        toastIsOpened: true,
        toastText: Taro.T._("favoritedpostsuccessfully"),
      });
    });
  };
  onShareAppMessage = (res) => {
    let { detail } = this.state;
    return {
      title: detail.title ? detail.title : "红海互联 RedSea Mall",
      imageUrl:
        detail.images && detail.images[0]
          ? detail.images && detail.images[0]
          : "https://store.redseanet.com/pub/theme/blue/frontend/images/logo.png",
      path: "pages/index/index",
      desc: detail.content
        ? detail.content
        : "红海互联多语言多货币社交电商系统",
    };
  };
  loadMore = () => {
    console.log("load more");
    let { page, reviewlist, detail } = this.state;
    let condition = {};
    condition.post_id = detail.id;
    forumPostReviewList(condition, page + 1, 20).then((data) => {
      data.map((item) => {
        reviewlist.push(item);
      });
    });
    this.setState({ page: page + 1, reviewlist: reviewlist });
  };
  handleReviewChange(value) {
    this.setState({
      reviewcontent: value,
    });
    return value;
  }
  onActionReviewClick() {
    console.log("-------onActionReviewClick----");
    let { detail, reviewcontent } = this.state;
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
    forumPostReviewSave(detail.id, reviewData).then((data) => {
      console.log(data);
      this.setState({
        toastIsOpened: true,
        toastIsOpened: true,
        toastText: Taro.T._("sendreviewsuccessfully"),
        reviewcontent: "",
        layoutIsOpened: false,
      });
      let condition = {};
      condition.post_id = detail.id;
      let reviewlist = [];
      forumPostReviewList(condition, 1, 20).then((data) => {
        data.map((item) => {
          reviewlist.push(item);
        });
        this.setState({ page: 1, reviewlist: reviewlist });
      });
    });
  }
  render() {
    let {
      detail,
      followed,
      user,
      toastIsOpened,
      toastText,
      liked,
      favorited,
      reviewlist,
      reviewcontent,
      layoutIsOpened,
      loading,
    } = this.state;
    return (
      <ScrollView
        className="find"
        onScrollToLower={() => {
          this.loadMore();
        }}
      >
        <Navbar title={detail.title} />
        {detail.videos && detail.videos != "" ? (
          <View>
            <Video
              objectFit="cover"
              src={detail.videos}
              controls={true}
              autoplay={true}
              initialTime={0}
              loop={false}
              muted={false}
              style={"width:100%;"}
            />
          </View>
        ) : detail.images && detail.images.length > 0 ? (
          <FindDetailSwiper images={detail.images} />
        ) : null}
        <View className="find-action">
          {liked ? (
            <AtIcon value="heart-2" size="24" color="#d62c75" />
          ) : (
            <AtIcon
              value="heart"
              size="24"
              color="#d62c75"
              onClick={() => {
                this.toLike();
              }}
            />
          )}

          {favorited ? (
            <AtIcon value="star-2" size="24" color="#d62c75" />
          ) : (
            <AtIcon
              value="star"
              size="24"
              color="#d62c75"
              onClick={() => {
                this.toFavoritePost();
              }}
            />
          )}
          <Button
            className="find-action-share"
            open-type="share"
            onShareAppMessage={() => this.onShareAppMessage}
          >
            <AtIcon
              value="share"
              size="24"
              color="#d62c75"
              onClick={() => {
                this.onShareAppMessage;
              }}
            />
          </Button>
        </View>
        <View className="find-title">
          <Text>{detail.title}</Text>
        </View>
        {detail.tags ? (
          <View className="find-title">
            {detail.tags.split(",").map((tag, ldx) => {
              return (
                <AtTag type="primary" circle size="small">
                  {tag}
                </AtTag>
              );
            })}
          </View>
        ) : null}
        <View className="find-customer">
          <View
            className="find-customer-detail"
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/about-find/customer-space/customer-space?spaceId=${detail.customer_id}`,
              });
            }}
          >
            <AtAvatar
              size="small"
              circle
              image={detail.customer_avatar}
              text={detail.customer_name}
            ></AtAvatar>
            <Text> {detail.customer_name}</Text>
          </View>
          <View className="find-customer-action">
            {followed ? (
              <Text
                className="find-customer-action-follow"
                onClick={() => this.toFollow(detail.customer_id)}
              >
                +{Taro.T._("follow")}
              </Text>
            ) : (
              <Text
                className="find-customer-action-cancelfollow"
                onClick={() => this.toFollow(detail.customer_id)}
              >
                {Taro.T._("cancelfollow")}
              </Text>
            )}
          </View>
        </View>
        <View className="find-content">
          <View dangerouslySetInnerHTML={{ __html: detail.content }}></View>
        </View>
        <View className="find-review">
          <View className="find-review-title">
            <Text>{Taro.T._("review")}</Text>
            <AtIcon
              value="add-circle"
              size="20"
              color="#797979"
              onClick={() => {
                if (layoutIsOpened) {
                  this.setState({ layoutIsOpened: false });
                } else {
                  this.setState({ layoutIsOpened: true });
                }
              }}
            ></AtIcon>
          </View>
          {reviewlist.length > 0
            ? reviewlist.map((review, idx) => {
                return (
                  <View className="find-review-item">
                    <View
                      className="find-review-item-left"
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/about-find/customer-space/customer-space?spaceId=${review.customer_id}`,
                        });
                      }}
                    >
                      <Image
                        src={review.avatar}
                        mode="widthFix"
                        className="find-review-item-left-avatar"
                      />
                      <Text className="find-review-item-left-username">
                        {review.username}
                      </Text>
                    </View>
                    <View className="find-review-item-right">
                      <Text className="find-review-item-right-content">
                        {review.content}
                      </Text>
                      <Text className="find-review-item-right-date">
                        {review.created_at_string}
                      </Text>
                    </View>
                  </View>
                );
              })
            : null}
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

const mapStateToProps = ({ user }) => ({
  user: user,
});

export default connect(mapStateToProps)(FindDetail);
