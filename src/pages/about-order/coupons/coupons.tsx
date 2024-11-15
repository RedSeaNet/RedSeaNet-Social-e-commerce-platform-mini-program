import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Button, Text } from "@tarojs/components";
import { AtInput } from "taro-ui";
import "./coupons.scss";
import { requestCoupons } from "../../../store/actions/coupons";
import { connect } from "react-redux";
import Navbar from "../../../component/navbarTitle/index";
class Coupons extends Component {
  config = {
    navigationBarTitleText: "Coupons",
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
  }

  componentDidShow() {
    Taro.setNavigationBarTitle({ title: Taro.T._("coupon") });
  }
  async componentDidMount() {
    this.props.dispatch(requestCoupons(this.state.page));
  }
  render() {
    let coupons = this.props;
    console.log("coupons.coupons view:");
    console.log(coupons.coupons);
    return (
      <View className="coupons">
        <Navbar title={Taro.T._("coupon")} />
        {coupons.coupons && coupons.coupons.length > 0
          ? coupons.coupons.map((item, idx) => {
              return (
                <View className="coupons-item">
                  <View>
                    <View>
                      <Text>{parseFloat(item.price).toFixed(2)}</Text>
                    </View>
                    <View>
                      <Text>{item.name}</Text>
                      <Text>{item.description}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          : null}
      </View>
    );
  }
}
const mapStateToProps = ({ coupons }) => ({
  coupons: coupons.coupons,
});
export default connect(mapStateToProps)(Coupons);
