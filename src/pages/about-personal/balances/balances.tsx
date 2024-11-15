import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView, Text, Image } from "@tarojs/components";
import { connect } from "react-redux";
import Navbar from "../../../component/navbarTitle/index";
import "./balances.scss";
import { USER } from "../../../utils/constant";
import { requestBalance } from "../../../store/actions/balance";
class Balances extends Component {
  current = getCurrentInstance();
  config = {
    navigationBarTitleText: "mybalance",
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
  };
  state = {
    page: 1,
    user: {},
  };
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let { page } = this.state;
    this.props.dispatch(requestBalance({ status: 1 }, page, 20));
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.setState({ user: userData });
    }
  }

  onPullDownRefresh = () => {
    let { page } = this.state;
    this.props.dispatch(requestBalance({ status: 1 }, page, 20));
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  loadMore = () => {
    console.log("load more");
    let { page, list } = this.state;
    this.props.dispatch(requestBalance({ status: 1 }, page + 1, 20));
    this.setState({ page: page + 1 });
  };

  render() {
    const height = Taro.getSystemInfoSync().windowHeight;
    const { user } = this.state;
    let { balance } = this.props.balance;
    return (
      <View style={{ position: "relative", overflow: "hidden" }}>
        <Navbar title={Taro.T._("mybalance")} />
        <ScrollView
          scrollY
          scrollTop="0"
          style={{ height: height + "px" }}
          lowerThreshold="20"
          upperThreshold="20"
          onScrollToLower={() => {
            this.loadMore();
          }}
        >
          <View className="container">
            <View className="container-header">
              <Text>{Taro.T._("total")}: </Text>
              <Text className="container-header-total">
                {balance.total ? parseFloat(balance.total).toFixed(2) : 0.0}
              </Text>
            </View>
            {balance.list && balance.list.length > 0
              ? balance.list.map((item, idx) => {
                  return (
                    <View className="container-item" key={item.id}>
                      <View className="container-item-left">
                        <Text className="container-item-left-comment">
                          {item.comment_string}
                        </Text>
                        <Text className="container-item-left-date">
                          {Taro.T._("status") + ":" + item.status_string}
                        </Text>
                        <Text className="container-item-left-date">
                          {item.created_at}
                        </Text>
                      </View>
                      <View className="container-item-right">
                        <View className="container-item-right-amount">
                          <Text>{parseInt(item.amount)}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ user, balance }) => ({
  user: user,
  balance: balance,
});
export default connect(mapStateToProps)(Balances);
