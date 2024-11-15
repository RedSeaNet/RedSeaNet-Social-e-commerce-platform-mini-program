import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./index.scss";
import { AtActionSheet, AtActionSheetItem } from "taro-ui";
import { connect } from "react-redux";
const ConfirmOrderItem = (props) => {
  console.log("currency:");
  console.log(props);
  return (
    <View className="confirm-order-item-detail">
      <Image src={props.image} className="confirm-order-item-detail-image" />
      <View className="confirm-order-item-detail-info">
        <Text className="confirm-order-item-detail-info-name">
          {props.product_name}
        </Text>
        <View className="confirm-order-item-detail-info-option">
          <Text>{props.options_name}</Text>
        </View>
        <View className="confirm-order-item-detail-info-end">
          <Text style="color:#D62C75;font-weight: bold;margin-right:auto;">
            {props.currency.symbol + parseFloat(props.price).toFixed(2)}
          </Text>
          <Text style="font-size: small;">
            {"x " + parseInt(props.qty).toFixed(0)}
          </Text>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = ({ cart }) => ({
  cart: cart,
});
export default connect(mapStateToProps)(ConfirmOrderItem);
