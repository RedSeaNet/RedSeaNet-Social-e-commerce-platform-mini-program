import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { connect } from "react-redux";
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import ProductDetailBottom from "./product-detail-bottom/product-detail-bottom";
import ProductDetailSwiper from "./product-detail-swiper/product-detail-swiper";
import { getProductDetailById } from "./../../../api/request";
import { requestAddProductCart } from "../../../store/actions/cart";
import { CURRENCY, USER } from "../../../utils/constant";
import Navbar from "../../../component/navbarTitle/index";
import "./product-detail.scss";
import { AtInputNumber, AtButton, AtToast, AtIcon } from "taro-ui";
import { requestAddWishList } from "../../../store/actions/wishlist";
import { Popup } from "@nutui/nutui-react-taro";
class ProductDetail extends Component {
  current = getCurrentInstance();
  constructor(props) {
    super(props);
    this.productId = this.current.router.params.productId;
  }
  state = {
    detail: {},
    isOpenedCart: false,
    quantity: 1,
    optionValue: {},
    optionName: {},
    loading: false,
    price: 0,
    optionValueImg: "./../../assets/placeholder.png",
    isWish: false,
    user: {},
    productCount: 0,
    currency: {},
    toastopened: false,
    toasttext: "",
  };
  async componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
    });
  }
  handleMessage() {}
  async componentDidMount() {
    let productId = this.current.router.params.productId;
    getProductDetailById(productId).then((data) => {
      this.setState({ detail: data, price: data.price });
      if (data.images && data.images.length > 0) {
        this.setState({ optionValueImg: data.images[0].src });
      }
    });
    let user = await Taro.getStorageSync(USER);
    let productCount = this.props.cart.cart.productCount
      ? this.props.cart.cart.productCount
      : 0;

    this.setState({ user: user, productCount: productCount });
    let currency = Taro.getStorageSync(CURRENCY);
    this.setState({ currency });
  }

  handleClick = () => {
    let { detail } = this.state;
    console.log(detail.options);
    if (detail.options && detail.options.length > 0) {
      this.setState({ isOpenedCart: true, isWish: false });
    } else {
      this.setState({ isWish: false });
      this.addToCartOrWishlist();
    }
  };
  handleWishClick = () => {
    this.setState({ isOpenedCart: true, isWish: true });
  };
  handleQuantityChange(value) {
    this.setState({
      quantity: value,
    });
  }
  calculatePrice(optionValueData) {
    let { detail } = this.state;
    let tmpPrice = parseFloat(detail.price);
    if (optionValueData) {
      for (let i = 0; i < detail.options.length; i++) {
        if (optionValueData[detail.options[i].id]) {
          for (let v = 0; v < detail.options[i].value.length; v++) {
            if (
              optionValueData[detail.options[i].id] ==
              detail.options[i].value[v].id
            ) {
              console.log(
                "price:" +
                  parseFloat(detail.options[i].value[v].price).toFixed(2)
              );
              tmpPrice =
                parseFloat(tmpPrice) +
                parseFloat(detail.options[i].value[v].price);
            }
          }
        }
      }
    }
    console.log("tmpPrice:" + tmpPrice);
    this.setState({ price: tmpPrice });
  }
  addToCartOrWishlist = async () => {
    let { detail, quantity, optionValue, isWish, optionName, user } =
      this.state;
    console.log(user);
    if (user.id) {
      console.log(detail.options);
      for (let i = 0; i < detail.options.length; i++) {
        if (!optionValue[detail.options[i].id]) {
          this.setState({
            toastopened: true,
            toasttext: Taro.T._("pleasechoose") + detail.options[i].title,
          });
          return false;
        }
      }
      if (isWish) {
        let pushData = {};
        pushData["product_id"] = detail.id;
        pushData["qty"] = 1;
        pushData["sku"] = detail.sku;
        pushData["options"] = JSON.stringify(optionValue);
        pushData["options_name"] = JSON.stringify(optionName);
        pushData["product_name"] = detail.name;
        pushData["decription"] = detail.name;
        pushData["store_id"] = detail.store_id;
        if (
          detail.images &&
          detail.images != "undefined" &&
          detail.images[0] != "undefined" &&
          detail.images.length > 0 &&
          detail.images[0].real_name != "undefined"
        ) {
          pushData["image"] = detail.images[0].real_name;
        } else {
          pushData["image"] = "";
        }
        this.props.dispatch(requestAddWishList(pushData));
      } else {
        await this.props.dispatch(
          requestAddProductCart(
            detail.id,
            quantity,
            detail.sku,
            JSON.stringify(optionValue)
          )
        );
        let productCount = this.props.cart.cart.productCount
          ? this.props.cart.cart.productCount
          : 0;
        this.setState({ productCount: productCount });
      }

      this.setState({ isOpenedCart: false });
    } else {
      Taro.navigateTo({
        url: `/pages/about-personal/user-login/user-login`,
      });
    }
  };
  onShareAppMessage = (res) => {
    let { detail } = this.state;
    return {
      title: detail.name ? detail.name : "红海互联 RedSea Mall",
      imageUrl:
        detail.images && detail.images[0]
          ? detail.images && detail.images[0]
          : "https://store.redseanet.com/pub/theme/blue/frontend/images/logo.png",
      path: "pages/index/index",
      desc: detail.short_description
        ? detail.short_description
        : "红海互联多语言多货币社交电商系统",
    };
  };
  onShareTimeline = (res) => {
    return {
      title: detail.name ? detail.name : "红海互联 RedSea Mall",
      imageUrl:
        detail.images && detail.images[0]
          ? detail.images && detail.images[0]
          : "https://store.redseanet.com/pub/theme/blue/frontend/images/logo.png",
      path: "pages/index/index",
      desc: detail.short_description
        ? detail.short_description
        : "红海互联多语言多货币社交电商系统",
    };
  };
  render() {
    let {
      detail,
      isOpenedCart,
      quantity,
      optionValue,
      optionName,
      price,
      isWish,
      productCount,
      currency,
      toastopened,
      toasttext,
    } = this.state;
    return (
      <ScrollView className="product-detail-container">
        <Navbar title={detail.name ? detail.name : Taro.T._("products")} />

        {detail.images ? <ProductDetailSwiper images={detail.images} /> : null}
        <View className="product-detail-container-title">
          <Text>{detail.name}</Text>
        </View>
        <View className="product-detail-container-price">
          <View>
            <Text className="product-detail-container-price-current">
              {currency.symbol}
              {parseFloat(price).toFixed(2)}
            </Text>
            {detail.msrp && detail.msrp != "0" ? (
              <Text className="product-detail-container-price-msrp">
                {currency.symbol}
                {parseFloat(detail.msrp).toFixed(2)}
              </Text>
            ) : null}
          </View>
          <Text className="product-detail-container-price-sales">
            {Taro.T._("sold")}： 0
          </Text>
        </View>
        <View className="product-detail-container-share">
          <Button
            className="product-detail-container-share-button"
            open-type="share"
            onShareAppMessage={() => this.onShareAppMessage}
          >
            <AtIcon
              value="share"
              size="16"
              color="#707070"
              onClick={() => {
                this.onShareAppMessage;
              }}
            />
            <Text> {Taro.T._("sharetofriend")}</Text>
          </Button>
        </View>
        <View className="product-detail-container-description">
          {detail.descriptionimages && detail.descriptionimages.length > 0
            ? detail.descriptionimages.map((image) => {
                return <Image src={image} mode="widthFix" />;
              })
            : null}
        </View>
        <View className="product-detail-container-buttom">
          <ProductDetailBottom
            handleClick={() => this.handleClick()}
            handleWishClick={() => this.handleWishClick()}
            productCount={productCount}
            retailerManagerId={
              detail.retailer_manager && detail.retailer_manager.customer_id
                ? detail.retailer_manager.customer_id
                : ""
            }
          />
        </View>
        <Popup
          visible={isOpenedCart}
          position="bottom"
          onClose={() => {
            this.setState({ isOpenedCart: false });
          }}
        >
          <View className="product-detail-container-option-price">
            <Text>
              {Taro.T._("price")}: {currency.symbol}
              {parseFloat(price).toFixed(2)}
            </Text>
          </View>
          <View className="product-detail-container-option-optionview">
            {detail.options && detail.options.length > 0
              ? detail.options.map((option, oindex) => {
                  return (
                    <View className="product-detail-container-option-optionview-option">
                      <Text key={oindex}>{option.title}:</Text>
                      <View className="product-detail-container-option-optionview-option-value">
                        {option.value && option.value.length > 0
                          ? option.value.map((value, vindex) => {
                              return (
                                <Text
                                  key={vindex}
                                  style={
                                    optionValue[option.id] == value.id
                                      ? {
                                          backgroundColor: "#d62c75",
                                          border: "1px solid #d62c75",
                                          color: "#ffffff",
                                        }
                                      : ""
                                  }
                                  onClick={() => {
                                    let temp = { ...optionValue };
                                    temp[option.id] = value.id;
                                    let tempName = { ...optionName };
                                    tempName[option.title] = value.title;
                                    this.setState({
                                      optionValue: temp,
                                      optionName: tempName,
                                    });
                                    this.calculatePrice(temp);
                                  }}
                                >
                                  {value.title}
                                </Text>
                              );
                            })
                          : null}
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
          <View className="product-detail-container-option-quantity">
            <Text>{Taro.T._("quantity")}: </Text>
            <AtInputNumber
              min={0}
              max={10}
              step={1}
              value={quantity}
              onChange={this.handleQuantityChange.bind(this)}
            />
          </View>
          <View className="product-detail-container-option-optionaction">
            <AtButton type="primary" onClick={() => this.addToCartOrWishlist()}>
              {isWish ? Taro.T._("addtowishlist") : Taro.T._("addtocart")}
            </AtButton>
          </View>
        </Popup>
        <AtToast
          isOpened={toastopened}
          text={toasttext}
          icon="alert-circle"
        ></AtToast>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ productInfo, cart }) => ({
  productDetail: productInfo.productDetail,
  productList: productInfo.productList.products,
  cart: cart,
});

export default connect(mapStateToProps)(ProductDetail);
