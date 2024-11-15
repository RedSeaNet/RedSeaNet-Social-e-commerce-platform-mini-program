import React, { Component } from "react";
import Taro from "@tarojs/taro";
import "./messages.scss";
import { View, Text, ScrollView } from "@tarojs/components";
import { USER } from "../../../utils/constant";
import { connect } from "react-redux";
import NavbarIndex from "../../../component/navbarIndex/index";
import { AtTabs, AtTabsPane, AtAvatar } from "taro-ui";
import {
  requestMyNotificationList,
  requestMyUnreadNotificationList,
  requestSystemNotificationList,
  requestSystemUnreadNotificationList,
} from "../../../store/actions/notification";
import EmptyTemplate from "../../../component/emptyTemplate/index";
import MyItem from "./myitem/myitem";
import SystemItem from "./systemitem/systemitem";
class Messages extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      currentTab: 0,
      user: {},
      refresherTriggered: false,
    };
  }
  config = {
    navigationBarTitleText: "消息",
  };

  async componentWillMount() {
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.setState({ user: userData });
    } else {
      Taro.navigateTo({ url: "/pages/about-personal/user-login/user-login" });
      Taro.showToast({
        title: Taro.T._("pleaseloginforcontinue") + "!",
        icon: "none",
        duration: 2000,
      });
    }
  }
  componentDidMount() {
    this.props.dispatch(requestMyNotificationList({}));
    this.props.dispatch(requestMyUnreadNotificationList({}));
    this.props.dispatch(requestSystemNotificationList({}));
    this.props.dispatch(requestSystemUnreadNotificationList({}));
    let notificationCount = this.props.unreadMyNotification.unreadMyNotification
      ? this.props.unreadMyNotification.unreadMyNotification.length
      : 0 + this.props.unreadMyNotification.unreadSystemNotification
      ? this.props.unreadMyNotification.unreadSystemNotification
      : 0;
    Taro.setTabBarBadge({
      index: 2,
      text: "" + notificationCount,
    });
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
    let { unreadMyNotification } = this.props.unreadMyNotification;
    let { unreadSystemNotification } = this.props.unreadSystemNotification;
    if (unreadSystemNotification.length > 0) {
      this.setState({
        currentTab: 0,
      });
    } else if (unreadMyNotification.length > 0) {
      this.setState({
        currentTab: 1,
      });
    }
  }

  componentDidHide() {}
  handleTabClick(value) {
    this.setState({
      currentTab: value,
    });
  }
  goNotificationUrl(item) {
    console.log("item:" + item);
  }
  loadMore = async () => {
    console.log("load more system message");
    let systemNotificationLastId = 0;
    let myNotificationLastId = 0;
    let { myNotification } = this.props.myNotification;
    let { systemNotification } = this.props.systemNotification;
    if (myNotification.length > 0) {
      myNotificationLastId = myNotification[myNotification.length - 1].id;
    }
    if (systemNotification.length > 0) {
      systemNotificationLastId =
        systemNotification[systemNotification.length - 1].id;
    }
    this.props.dispatch(requestMyNotificationList({}, myNotificationLastId));
    this.props.dispatch(
      requestSystemNotificationList({}, systemNotificationLastId)
    );
  };
  onRefresherRefresh(e) {
    this.setState({ refresherTriggered: true });
    console.log("自定义下拉刷新被触发-----onSystemMessageRefresherRefresh");
    this.props.dispatch(requestMyNotificationList({}, 0));
    this.props.dispatch(requestMyUnreadNotificationList({}, 0));
    this.props.dispatch(requestSystemNotificationList({}, 0));
    this.props.dispatch(requestSystemUnreadNotificationList({}, 0));
    let notificationCount = this.props.unreadMyNotification.unreadMyNotification
      ? this.props.unreadMyNotification.unreadMyNotification.length
      : 0 + this.props.unreadMyNotification.unreadSystemNotification
      ? this.props.unreadMyNotification.unreadSystemNotification
      : 0;
    Taro.setTabBarBadge({
      index: 2,
      text: "" + notificationCount,
    });
    setTimeout(() => {
      this.setState({ refresherTriggered: true });
    }, 2000);
  }
  render() {
    const tabList = [{ title: "系统通知" }, { title: "我的通知" }];
    let { currentTab, user, refresherTriggered } = this.state;
    let { myNotification } = this.props.myNotification;
    let { unreadMyNotification } = this.props.unreadMyNotification;
    let { systemNotification } = this.props.systemNotification;
    let { unreadSystemNotification } = this.props.unreadSystemNotification;
    return (
      <ScrollView
        className="message"
        onScrollToLower={() => {
          this.loadMore();
        }}
        onRefresherRefresh={() => {
          this.onRefresherRefresh();
        }}
        scrollY="true"
        scrollTop="0"
        upperThreshold="20"
        lowerThreshold="20"
        refresherEnabled="true"
        refresherTriggered={refresherTriggered}
      >
        <NavbarIndex />
        <AtTabs
          current={currentTab}
          tabList={tabList}
          onClick={this.handleTabClick.bind(this)}
        >
          <AtTabsPane current={currentTab} index={0}>
            <View className="message-ststem">
              <View className="message-system-unread">
                {unreadSystemNotification && unreadSystemNotification.length > 0
                  ? unreadSystemNotification.map((item, idx) => {
                      return <SystemItem {...item} user={user} />;
                    })
                  : ""}
              </View>
              <View className="message-system-read">
                {systemNotification && systemNotification.length > 0
                  ? systemNotification.map((item, idx) => {
                      return <SystemItem {...item} user={user} />;
                    })
                  : ""}
              </View>
              {systemNotification.length == 0 &&
              unreadSystemNotification.length == 0 ? (
                <EmptyTemplate />
              ) : null}
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <View className="message-my">
              <View className="message-my-unread">
                {unreadMyNotification && unreadMyNotification.length > 0
                  ? unreadMyNotification.map((item, idx) => {
                      return <MyItem {...item} user={user} />;
                    })
                  : ""}
              </View>
              <View className="message-my-read">
                {myNotification && myNotification.length > 0
                  ? myNotification.map((item, idx) => {
                      return <MyItem {...item} user={user} />;
                    })
                  : ""}
              </View>
              {unreadMyNotification.length == 0 &&
              myNotification.length == 0 ? (
                <EmptyTemplate />
              ) : null}
            </View>
          </AtTabsPane>
        </AtTabs>
      </ScrollView>
    );
  }
}
const mapStateToProps = ({
  user,
  cart,
  myNotification,
  unreadMyNotification,
  systemNotification,
  unreadSystemNotification,
}) => ({
  user: user,
  cart: cart,
  myNotification: myNotification,
  unreadMyNotification: unreadMyNotification,
  systemNotification: systemNotification,
  unreadSystemNotification: unreadSystemNotification,
});
export default connect(mapStateToProps)(Messages);
