import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./cart-item.scss";
import { AtIcon } from "taro-ui";
import { connect } from "react-redux";
import {
  requestChangeQtyCart,
  requestRemoveCart,
  requestChangeStatusCart,
} from "../../../../store/actions/cart";

const CartItem = (props) => {
  const add = async () => {
    props.dispatch(requestChangeQtyCart(props.id, parseInt(props.qty) + 1));
  };
  const min = async () => {
    if (props.qty > 1) {
      props.dispatch(requestChangeQtyCart(props.id, parseInt(props.qty) - 1));
    } else {
      return false;
    }
  };
  const deleteItem = async () => {
    props.dispatch(requestRemoveCart([props.id]));
  };
  const goToProduct = (productId) => {
    Taro.navigateTo({
      url: `/pages/about-product/product-detail/product-detail?productId=${productId}`,
    });
  };
  const handleSelect = () => {
    let status = 1;
    if (parseInt(props.status) == 1) {
      status = 0;
    }
    console.log(props.id);
    props.dispatch(requestChangeStatusCart([props.id], status));
  };
  return (
    <View className="cart-item">
      {props.selected ? (
        <AtIcon
          value="check-circle"
          size="20"
          color="#d62c75"
          onClick={handleSelect}
        />
      ) : (
        <AtIcon
          value="close-circle"
          size="20"
          color="#707070"
          onClick={handleSelect}
        />
      )}
      <Image
        className="cart-item-image"
        src={props.image}
        onClick={() => goToProduct(props.product_id)}
      />
      <View className="cart-item-cartInfo">
        <Text
          className="cart-item-cartInfo-name"
          onClick={() => goToProduct(props.product_id)}
        >
          {props.product_name}
        </Text>
        <View className="cart-item-cartInfo-other">
          <Text className="cart-item-cartInfo-other-price">
            {props.currency.symbol + parseFloat(props.price).toFixed(2)}
          </Text>
          <Text className="cart-item-cartInfo-other-text">
            {Taro.T._("quantity")}
          </Text>
          <AtIcon
            value="subtract"
            size="20"
            color="#bfbfbf"
            className="cart-item-cartInfo-other-icon"
            onClick={min}
          />
          <Text className="cart-item-cartInfo-other-num">
            {parseInt(parseInt(props.qty).toFixed(0))}
          </Text>
          <AtIcon
            value="add"
            size="20"
            color="#bfbfbf"
            className="cart-item-cartInfo-other-icon"
            onClick={add}
          />
        </View>
        <View className="cart-item-cartInfo-option">
          <Text>{props.options_name}</Text>
          <AtIcon
            value="trash"
            size="20"
            color="#bfbfbf"
            onClick={deleteItem}
          />
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = ({ cart }) => ({
  cart: cart,
});
export default connect(mapStateToProps)(CartItem);
