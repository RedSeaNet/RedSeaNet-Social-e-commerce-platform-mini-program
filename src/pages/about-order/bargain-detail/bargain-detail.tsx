import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import "./index.scss";
import { connect } from "react-redux";
import {
  getBargain,
  startBargain,
  helpBargain,
  bargainOrder,
} from "../../../api/request";
import Navbar from "../../../component/navbarTitle/index";
import { AtProgress, AtCountdown } from "taro-ui";
import { USER } from "../../../utils/constant";
import { Base64 } from "../../../utils/base64";
import React, { Component } from "react";
import locales from "../../../utils/locales";
import T from "../../../utils/i18n";
class BargainDetail extends Component {
  current = getCurrentInstance();
  constructor(props) {
    super(props);
    if (!Taro.T) {
      Taro.T = new T(locales, "zh");
    }
    this.state = {
      bargainDetailData: {},
      bargainCase: {},
      bargainHelpUserList: [],
      alreadyPrice: 0,
      createdBargain: 0,
      helpCount: 0,
      pricePercent: 0,
      lessPrice: 0,
      userDetail: {},
      userBargainStatusHelp: 0,
      helpMeBargain: false,
    };
  }
  async componentWillMount() {}

  async componentDidShow() {
    let userData = await Taro.getStorageSync(USER);
    this.setState({ userDetail: userData });
    let bargainData = {};
    console.log("this.current.router.params.bargain_id:");
    console.log(this.current.router.params.bargain_id);
    let enterOptions = Taro.getEnterOptionsSync();
    console.log(enterOptions);
    if (
      enterOptions.scene === 1065 &&
      enterOptions.path === "pages/about-order/bargain-detail/bargain-detail"
    ) {
      await resetBarginUrlScheme(this.current.router.params.bargain_id);
    }
    if (
      this.current.router.params.bargain_case_id &&
      this.current.router.params.bargain_case_id != ""
    ) {
      bargainData = await getBargain(
        this.current.router.params.bargain_id,
        this.current.router.params.bargain_case_id
      );
    } else {
      bargainData = await getBargain(this.current.router.params.bargain_id);
    }

    if (bargainData.id) {
      this.setState({
        bargainDetailData: bargainData,
        alreadyPrice: bargainData.already_price,
        createdBargain: bargainData.created_bargain,
        helpCount: bargainData.help_count,
        pricePercent: bargainData.price_percent,
        lessPrice: bargainData.price,
        userBargainStatusHelp: bargainData.userBargainStatusHelp,
      });
    }
    if (bargainData.bargain_case && bargainData.bargain_case.id) {
      if (
        bargainData.bargain_case.helps &&
        bargainData.bargain_case.helps.length > 0
      ) {
        this.setState({
          bargainHelpUserList: bargainData.bargain_case.helps,
        });
        let checkoutMeBargain = true;
        for (let h = 0; h < bargainData.bargain_case.helps.length; h++) {
          if (bargainData.bargain_case.helps[h].customer_id == userData.id) {
            checkoutMeBargain = false;
          }
        }
        if (checkoutMeBargain) {
          this.setState({ helpMeBargain: true });
        }
      } else {
        this.setState({ helpMeBargain: true });
      }
      this.setState({ bargainCase: bargainData.bargain_case });
    }
  }
  async componentDidMount() {
    Taro.setNavigationBarTitle({ title: Taro.T._("bargainList") });
  }
  onShareAppMessage = (res) => {
    let { bargainDetailData, bargainCase, createdBargain, userDetail } =
      this.state;
    if (!userDetail.id || userDetail.id == "") {
      Taro.showToast({
        title: Taro.T._("notloginmsg"),
        icon: "none",
        duration: 3000,
      });
      //Taro.clearStorage();
      Taro.redirectTo({
        url: `/pages/about-personal/user-login/user-login?from_url=${Base64(
          "/pages/about-order/bargain-detail/bargain-detail?bargain_id=" +
            bargainDetailData.id
        )}`,
      });
      return false;
    }
    if (createdBargain != 1) {
      Taro.showToast({
        title: Taro.T._("pleseacreateabargain"),
        icon: "none",
        duration: 3000,
      });
      return false;
    }
    return {
      title:
        "你的好友" +
        (userDetail.username ? userDetail.username : "Redseanet") +
        "邀请你帮他砍" +
        bargainDetailData.name,
      path: `/pages/about-order/bargain-detail/bargain-detail?bargain_id=${
        bargainDetailData.id
      }&bargain_case_id=${bargainCase.id ? bargainCase.id : ""}`,
      imageUrl: bargainDetailData.image,
    };
  };
  startNewBargain = async () => {
    let { userDetail, bargainCase } = this.state;
    if (!userDetail.id || userDetail.id == "") {
      Taro.showToast({
        title: Taro.T._("notloginmsg"),
        icon: "none",
        duration: 3000,
      });
      //Taro.clearStorage();
      Taro.redirectTo({
        url: `/pages/about-personal/user-login/user-login?from_url=${Base64(
          "/pages/about-order/bargain-detail/bargain-detail?bargain_id=" +
            this.current.router.params.bargain_id +
            "&bargain_user_id=" +
            (bargainCase.id ? bargainCase.id : "")
        )}`,
      });
      return false;
    }
    let startBargainReturnData = await startBargain(
      this.current.router.params.bargain_id
    );
    console.log("-----------startBargainReturnData-------");
    console.log(startBargainReturnData);
    let bargainData = await getBargain(this.current.router.params.bargain_id);
    if (bargainData.id) {
      this.setState({
        bargainDetailData: bargainData,
        alreadyPrice: bargainData.already_price,
        createdBargain: bargainData.created_bargain,
        helpCount: bargainData.help_count,
        pricePercent: bargainData.price_percent,
        lessPrice: bargainData.price,
        userBargainStatusHelp: bargainData.userBargainStatusHelp,
      });
    }
    if (bargainData.bargain_case && bargainData.bargain_case.id) {
      if (
        bargainData.bargain_case.helps &&
        bargainData.bargain_case.helps.length > 0
      ) {
        this.setState({
          bargainHelpUserList: bargainData.bargain_case.helps,
        });
        let checkoutMeBargain = true;
        for (let h = 0; h < bargainData.bargain_case.helps.length; h++) {
          if (bargainData.bargain_case.helps[h].customer_id == userDetail.id) {
            checkoutMeBargain = false;
          }
        }
        if (checkoutMeBargain) {
          this.setState({ helpMeBargain: true });
        }
      } else {
        this.setState({ helpMeBargain: true });
      }
      this.setState({ bargainCase: bargainData.bargain_case });
    }
  };
  helpBargain = async () => {
    let { userDetail } = this.state;
    if (!userDetail.id || userDetail.id == "") {
      Taro.showToast({
        title: Taro.T._("notloginmsg"),
        icon: "none",
        duration: 3000,
      });
      Taro.clearStorage();
      Taro.redirectTo({
        url: `/pages/about-personal/user-login/user-login?from_url=${Base64(
          "/pages/about-order/bargain-detail/bargain-detail?bargain_id=" +
            this.current.router.params.bargain_id +
            "&bargain_case_id=" +
            this.current.router.params.bargain_case_id
        )}`,
      });
    }
    let helpBargainReturnData = await helpBargain(
      this.current.router.params.bargain_id,
      this.current.router.params.bargain_case_id
    );
    console.log("-----------helpBargainReturnData-------");
    console.log(helpBargainReturnData);

    let bargainData = await getBargain(
      this.current.router.params.bargain_id,
      this.current.router.params.bargain_case_id
    );
    if (bargainData.id) {
      this.setState({
        bargainDetailData: bargainData,
        alreadyPrice: bargainData.already_price,
        createdBargain: bargainData.created_bargain,
        helpCount: bargainData.help_count,
        pricePercent: bargainData.price_percent,
        lessPrice: bargainData.price,
        userBargainStatusHelp: bargainData.userBargainStatusHelp,
      });
    }
    if (bargainData.bargain_case && bargainData.bargain_case.id) {
      if (
        bargainData.bargain_case.helps &&
        bargainData.bargain_case.helps.length > 0
      ) {
        this.setState({
          bargainHelpUserList: bargainData.bargain_case.helps,
        });
        let checkoutMeBargain = true;
        for (let h = 0; h < bargainData.bargain_case.helps.length; h++) {
          if (bargainData.bargain_case.helps[h].customer_id == userDetail.id) {
            checkoutMeBargain = false;
          }
        }
        if (checkoutMeBargain) {
          this.setState({ helpMeBargain: true });
        } else {
          this.setState({ helpMeBargain: false });
        }
      } else {
        this.setState({ helpMeBargain: true });
      }
      this.setState({ bargainCase: bargainData.bargain_case });
    }
  };
  gotoPay = async () => {
    console.log("-----------gotoPay-------");
  };
  shareToFriend = async () => {
    console.log("-----------shareToFriend-------");
    let {
      bargainDetailData,
      bargainCase,
      userDetail,
      createdBargain,
      lessPrice,
    } = this.state;
    if (!userDetail.id || userDetail.id == "") {
      Taro.showToast({
        title: Taro.T._("notloginmsg"),
        icon: "none",
        duration: 3000,
      });
      Taro.clearStorage();
      Taro.redirectTo({
        url: `/pages/about-personal/user-login/user-login?from_url=${Base64(
          "/pages/about-order/bargain-detail/bargain-detail?bargain_id=" +
            bargainDetailData.id +
            "&bargain_case_id="(bargainCase.id ? bargainCase.id : "")
        )}`,
      });
    }
    if (createdBargain != 1) {
      Taro.showToast({
        title: Taro.T._("pleseacreateabargain"),
        icon: "none",
        duration: 3000,
      });
      return false;
    }
    Taro.navigateTo({
      url: `/pages/about-order/bargain-share-post/bargain-share-post?bargain_id=${
        bargainDetailData.id
      }&bargain_case_id=${bargainCase.id}&user_name=${
        userDetail.username
      }&bargain_product_image=${bargainDetailData.thumbnail[0]}&title=${
        bargainDetailData.name
      }&price=${parseFloat(bargainCase.current_price).toFixed(
        2
      )}&mini_program_qr=${bargainCase.mini_program_qr}&less_price=${parseFloat(
        lessPrice
      ).toFixed(2)}&currency_symbol=${bargainDetailData.currency.symbol}`,
    });
  };
  helpOurselfBargain = async () => {
    console.log("------helpOurselfBargain--------");
    let { userDetail, bargainCase } = this.state;
    if (!userDetail.id || userDetail.id == "") {
      Taro.showToast({
        title: Taro.T._("notloginmsg"),
        icon: "none",
        duration: 3000,
      });
      Taro.clearStorage();
      Taro.redirectTo({
        url: `/pages/about-personal/user-login/user-login?from_url=${Base64(
          "/pages/about-order/bargain-detail/bargain-detail?bargain_id=" +
            this.current.router.params.bargain_id +
            "&bargain_case_id=" +
            bargainCase.id
        )}`,
      });
    }
    let helpBargainReturnData = await helpBargain(
      this.current.router.params.bargain_id,
      bargainCase.id
    );
    console.log("-----------helpOurselfBargain-------");
    console.log(helpBargainReturnData);
    let bargainData = await getBargain(this.current.router.params.bargain_id);
    if (bargainData && bargainData.id) {
      this.setState({
        bargainDetailData: bargainData,
        alreadyPrice: bargainData.already_price,
        createdBargain: bargainData.created_bargain,
        helpCount: bargainData.help_count,
        pricePercent: bargainData.price_percent,
        lessPrice: bargainData.price,
        userBargainStatusHelp: bargainData.userBargainStatusHelp,
      });
    }
    if (bargainData.bargain_case && bargainData.bargain_case.id) {
      if (
        bargainData.bargain_case.helps &&
        bargainData.bargain_case.helps.length > 0
      ) {
        this.setState({
          bargainHelpUserList: bargainData.bargain_case.helps,
        });
      }
      this.setState({
        bargainCase: bargainData.bargain_case,
        helpMeBargain: false,
      });
    }
  };
  gotoLogin = () => {
    let { userDetail, bargainCase } = this.state;
    if (!userDetail.id || userDetail.id == "") {
      Taro.showToast({
        title: Taro.T._("notloginmsg"),
        icon: "none",
        duration: 3000,
      });
      Taro.clearStorage();
      Taro.redirectTo({
        url: `/pages/about-personal/user-login/user-login?from_url=${
          Base64(
            "/pages/about-order/bargain-detail/bargain-detail?bargain_id=" +
              this.current.router.params.bargain_id
          ) + "&bargain_case_id="(bargainCase.id ? bargainCase.id : "")
        }`,
      });
    } else {
      return false;
    }
  };
  render() {
    const height = Taro.getSystemInfoSync().windowHeight;
    let {
      bargainDetailData,
      bargainCase,
      bargainHelpUserList,
      alreadyPrice,
      createdBargain,
      helpCount,
      lessPrice,
      pricePercent,
      userBargainStatusHelp,
      userDetail,
      helpMeBargain,
    } = this.state;
    return (
      <View className="bargainDetail">
        <Navbar title={bargainDetailData.name} />
        <ScrollView
          scrollY
          scrollTop="0"
          style={{ height: height + "px" }}
          lowerThreshold="20"
          upperThreshold="20"
        >
          <View className="bargainDetail-header">
            <View className="bargainDetail-header-title">
              <Text>
                38{Taro.T._("saw")} | 30{Taro.T._("shared")} | {helpCount}
                {Taro.T._("participated")}
              </Text>
            </View>
            <View className="bargainDetail-header-time">
              <View className="bargainDetail-header-time-container">
                <AtCountdown
                  isShowDay
                  format={{
                    day: Taro.T._("days"),
                    hours: Taro.T._("hours"),
                    minutes: Taro.T._("mins"),
                    seconds: Taro.T._("seconds"),
                  }}
                  day={
                    bargainDetailData.time_counter &&
                    bargainDetailData.time_counter.day
                      ? bargainDetailData.time_counter.day
                      : 0
                  }
                  hours={
                    bargainDetailData.time_counter &&
                    bargainDetailData.time_counter.hour
                      ? bargainDetailData.time_counter.hour
                      : 0
                  }
                  minutes={
                    bargainDetailData.time_counter &&
                    bargainDetailData.time_counter.minute
                      ? bargainDetailData.time_counter.minute
                      : 0
                  }
                  seconds={
                    bargainDetailData.time_counter &&
                    bargainDetailData.time_counter.second
                      ? bargainDetailData.time_counter.second
                      : 0
                  }
                />
              </View>
            </View>
          </View>
          <View className="bargainDetail-content">
            <View className="bargainDetail-content-position">
              <View className="bargainDetail-content-position-detailView">
                <View className="bargainDetail-content-position-detailView-itemView">
                  <Image
                    src={
                      bargainDetailData.thumbnail &&
                      bargainDetailData.thumbnail[0]
                        ? bargainDetailData.thumbnail[0]
                        : require("./../../../assets/placeholder.png")
                    }
                    className="bargainDetail-content-position-detailView-itemView-leftImage"
                  />
                  <View className="bargainDetail-content-position-detailView-itemView-rightView">
                    <View className="bargainDetail-conten-positiont-detailView-itemView-rightView-title">
                      <Text>
                        {bargainDetailData.name}
                        {bargainDetailData.optionsname &&
                        bargainDetailData.optionsname != ""
                          ? "(" + bargainDetailData.optionsname + ")"
                          : ""}
                      </Text>
                    </View>
                    <View className="bargainDetail-content-position-detailView-itemView-rightView-currentPrice">
                      <Text>
                        {Taro.T._("current")}{" "}
                        {bargainDetailData.currency &&
                        bargainDetailData.currency.symbol
                          ? bargainDetailData.currency.symbol
                          : ""}
                        {createdBargain == 1
                          ? parseFloat(bargainCase.current_price).toFixed(2)
                          : parseFloat(bargainDetailData.price).toFixed(2)}
                      </Text>
                    </View>
                    <View className="bargainDetail-content-position-detailView-itemView-rightView-minPrice">
                      <Text>
                        {Taro.T._("minprice")}{" "}
                        {bargainDetailData.currency &&
                        bargainDetailData.currency.symbol
                          ? bargainDetailData.currency.symbol
                          : ""}
                        {parseFloat(bargainDetailData.min_price).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="bargainDetail-content-position-detailView-processView">
                  <AtProgress percent={pricePercent} color="#f11b09" />
                  <View className="bargainDetail-content-position-detailView-processView-textView">
                    <View className="bargainDetail-content-position-detailView-processView-textView-left">
                      <Text>
                        {Taro.T._("chopoff")}
                        {bargainDetailData.currency &&
                        bargainDetailData.currency.symbol
                          ? bargainDetailData.currency.symbol
                          : ""}
                        {parseFloat(alreadyPrice).toFixed(2)}
                      </Text>
                    </View>
                    <View className="bargainDetail-content-position-detailView-processView-textView-right">
                      {Taro.T._("less")}
                      {bargainDetailData.currency &&
                      bargainDetailData.currency.symbol
                        ? bargainDetailData.currency.symbol
                        : ""}
                      {parseFloat(lessPrice).toFixed(2)}
                    </View>
                  </View>
                  {lessPrice == 0 ? (
                    ""
                  ) : (
                    <View className="bargainDetail-content-position-detailView-processView-note">
                      <Text>{Taro.T._("had")}</Text>
                      <Text className="bargainDetail-content-position-detailView-processView-note-count">
                        {helpCount}
                      </Text>
                      <Text>{Taro.T._("friendsparticipation")}</Text>
                    </View>
                  )}
                </View>
                {createdBargain == 0 ? (
                  <View className="bargainDetail-content-position-detailView-bargainView">
                    <View
                      className="bargainDetail-content-position-detailView-bargainView-btn"
                      onClick={() => this.startNewBargain()}
                    >
                      <Text>{Taro.T._("joininnow")}</Text>
                    </View>
                    {userDetail.user_id &&
                    bargainCase.user_id &&
                    bargainCase.user_id == userDetail.user_id &&
                    bargainDetailData.num > 0 &&
                    createdBargain == 0 ? (
                      <View className="bargainDetail-content-position-detailView-bargainView-note">
                        <Text>
                          你已经参与过该商品砍价活动，该商品每人限购
                          {bargainDetailData.num}
                        </Text>
                      </View>
                    ) : null}
                    {bargainDetailData.stock &&
                    bargainDetailData.stock > 0 ? null : (
                      <View className="bargainDetail-content-position-detailView-bargainView-gayBtn">
                        <Text>{Taro.T._("outofstock")}</Text>
                      </View>
                    )}
                  </View>
                ) : null}
                {createdBargain == 1 &&
                lessPrice != 0 &&
                bargainCase.customer_id &&
                userDetail.id &&
                bargainCase.customer_id == userDetail.id ? (
                  <View className="bargainDetail-content-position-detailView-bargainView">
                    <View
                      className="bargainDetail-content-position-detailView-bargainView-btn"
                      onClick={() => this.shareToFriend()}
                    >
                      <Text>{Taro.T._("invitefriendstochopoffprice")}</Text>
                    </View>
                  </View>
                ) : null}

                {lessPrice > 0 &&
                bargainCase.customer_id != userDetail.id &&
                userBargainStatusHelp == 1 &&
                helpMeBargain ? (
                  <View className="bargainDetail-content-position-detailView-bargainView">
                    <View
                      className="bargainDetail-content-position-detailView-bargainView-btn"
                      onClick={() => this.helpBargain()}
                    >
                      <Text>{Taro.T._("helpthefriendchopoffprice")}</Text>
                    </View>
                  </View>
                ) : null}
                {lessPrice == 0 &&
                bargainCase.customer_id != userDetail.id &&
                userBargainStatusHelp == 1 ? (
                  <View className="bargainDetail-content-position-detailView-bargainView">
                    <View className="bargainDetail-content-position-detailView-bargainView-note">
                      <Text>{Taro.T._("youhavesuccessfully")}</Text>
                    </View>
                  </View>
                ) : null}
                {lessPrice > 0 &&
                bargainCase.customer_id &&
                bargainCase.customer_id != userDetail.id &&
                userBargainStatusHelp == 0 ? (
                  <View className="bargainDetail-content-position-detailView-bargainView">
                    <View className="bargainDetail-content-position-detailView-bargainView-note">
                      <Text>{Taro.T._("helpthefriendsuccessfully")}</Text>
                    </View>
                  </View>
                ) : null}
                {lessPrice == 0 && bargainCase.customer_id == userDetail.id ? (
                  <View className="bargainDetail-content-position-detailView-bargainView">
                    <View className="bargainDetail-content-position-detailView-bargainView-note">
                      <Text>
                        {Taro.T._("congratulationyourbargainsuccessfully")}
                      </Text>
                    </View>
                    <View
                      className="bargainDetail-content-position-detailView-bargainView-btn"
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/about-order/bargain-order/bargain-order?bargainId=${bargainDetailData.id}&bargainCaseId=${bargainCase.id}&active_type=1`,
                        });
                      }}
                    >
                      <Text>{Taro.T._("paynow")}</Text>
                    </View>
                    <View
                      className="bargainDetail-content-position-detailView-bargainView-moreProductBtn"
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/about-order/bargain-list/bargain-list`,
                        });
                      }}
                    >
                      <Text>{Taro.T._("btogetmorebargains")}</Text>
                    </View>
                  </View>
                ) : null}
                {bargainCase.customer_id &&
                userDetail.id &&
                bargainCase.customer_id == userDetail.id ? (
                  createdBargain == 1 && lessPrice != 0 && helpMeBargain ? (
                    <View className="bargainDetail-content-position-detailView-bargainView">
                      <View
                        className="bargainDetail-content-position-detailView-bargainView-btn"
                        onClick={() => this.helpOurselfBargain()}
                      >
                        <Text>{Taro.T._("helpourselfbargain")}</Text>
                      </View>
                    </View>
                  ) : (
                    <View className="bargainDetail-content-position-detailView-bargainView">
                      <View
                        className="bargainDetail-content-position-detailView-bargainView-gayBtn"
                        onClick={() => this.gotoLogin()}
                      >
                        <Text>{Taro.T._("helpourselfbargain")}</Text>
                      </View>
                    </View>
                  )
                ) : (
                  ""
                )}

                {(!userDetail.id && bargainCase.customer_id) ||
                (bargainCase.customer_id &&
                  userDetail.id &&
                  bargainCase.customer_id != userDetail.id) ? (
                  <View className="bargainDetail-content-position-detailView-bargainView">
                    <View
                      className="bargainDetail-content-position-detailView-bargainView-btn"
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/about-order/bargain-list/bargain-list`,
                        });
                      }}
                    >
                      <Text>{Taro.T._("joininit")}</Text>
                    </View>
                  </View>
                ) : null}
                <View className="bargainDetail-content-position-lock"></View>
              </View>
              <View className="bargainDetail-content-position-helpView">
                <View className="bargainDetail-content-position-helpView-title">
                  <View className="bargainDetail-content-position-helpView-title-imageLeft">
                    <Image src={require("./../assets/left.png")} />
                  </View>
                  <View className="bargainDetail-content-position-helpView-title-text">
                    <Text>{Taro.T._("bargainhelplist")}</Text>
                  </View>
                  <View className="bargainDetail-content-position-helpView-title-imageRight">
                    <Image src={require("./../assets/left.png")} />
                  </View>
                </View>
                {bargainHelpUserList && bargainHelpUserList.length > 0 ? (
                  <View className="bargainDetail-content-position-helpView-listView">
                    {bargainHelpUserList.map((item, idx) => {
                      return (
                        <View
                          className="bargainDetail-content-position-helpView-listView-item"
                          key={"bargainhelp" + idx}
                        >
                          <View className="bargainDetail-content-position-helpView-listView-item-avatar">
                            <Image src={item.avatar} />
                          </View>
                          <View className="bargainDetail-content-position-helpView-listView-item-name">
                            <View className="bargainDetail-content-position-helpView-listView-item-name-user">
                              <Text>{item.username}</Text>
                            </View>
                            <View className="bargainDetail-content-position-helpView-listView-item-name-time">
                              <Text>{item.created_at}</Text>
                            </View>
                          </View>
                          <View className="bargainDetail-content-position-helpView-listView-item-price">
                            <Text>
                              {Taro.T._("chopoff")}{" "}
                              {bargainDetailData.currency &&
                              bargainDetailData.currency.symbol
                                ? bargainDetailData.currency.symbol
                                : ""}
                              {parseFloat(item.price).toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : null}

                <View className="bargainDetail-content-position-lock"></View>
              </View>
              <View className="bargainDetail-content-position-productContent">
                <View className="bargainDetail-content-position-productContent-title">
                  <Text>{Taro.T._("productdetail")}</Text>
                </View>
                <View>
                  <View
                    dangerouslySetInnerHTML={{
                      __html: bargainDetailData.content,
                    }}
                  ></View>
                </View>
                <View className="bargainDetail-content-position-lock"></View>
              </View>
              <View className="bargainDetail-content-position-rule">
                <View className="bargainDetail-content-position-rule-title">
                  <Text>{Taro.T._("bargainrule")}</Text>
                </View>
                <View>
                  <Text>{bargainDetailData.rule}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default connect(({ shop, cart }) => ({ shop, cart: cart.cart }))(
  BargainDetail
);
