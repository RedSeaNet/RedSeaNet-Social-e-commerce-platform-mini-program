import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { connect } from "react-redux";
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import ProductDetailBottom from "./bulk-detail-bottom/bulk-detail-bottom";
import ProductDetailSwiper from "./bulk-detail-swiper/bulk-detail-swiper";
import { getProductDetailById } from "../../../api/request";
import {
  requestCart,
  requestAddProductCart,
} from "../../../store/actions/cart";
import { CURRENCY, USER } from "../../../utils/constant";
import Navbar from "../../../component/navbarTitle/index";
import "./bulk-detail.scss";
import {
  AtFloatLayout,
  AtInputNumber,
  AtButton,
  AtToast,
  AtIcon,
  AtProgress,
  AtSteps,
} from "taro-ui";
import { bulkSalesList } from "./../../../api/request";
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
    isBulk: false,
    user: {},
    productCount: 0,
    currency: {},
    toastopened: false,
    toasttext: "",
    salesList: [],
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
    bulkSalesList(productId, 1).then((saledata) => {
      this.setState({ salesList: saledata });
    });
  }

  handleClick = () => {
    this.setState({ isOpenedCart: true, isBulk: false });
  };
  handleBulkClick = () => {
    this.setState({ isOpenedCart: true, isBulk: true });
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
            console.log(
              optionValueData[detail.options[i].id] +
                "------" +
                detail.options[i].value[v].id
            );
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
  addToCartOrBulk = async () => {
    let {
      detail,
      quantity,
      optionValue,
      isBulk,
      optionName,
      user,
      optionValueImg,
    } = this.state;
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
      let optionNameArray = [];
      Object.keys(optionName).map((option) => {
        optionNameArray.push(option + ":" + optionName[option]);
      });
      if (isBulk) {
        Taro.navigateTo({
          url: `/pages/about-order/bulk-order/bulk-order?product_id=${
            detail.id
          }&options=${JSON.stringify(
            optionValue
          )}&options_name=${optionNameArray.join(
            ","
          )}&options_image=${optionValueImg}&quantity=${quantity}`,
        });
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
  joinToBulk = async (
    bulkId,
    quantity,
    optionValue,
    optionName,
    optionValueImg,
    size
  ) => {
    let { detail, user } = this.state;
    console.log(user);
    if (user.id) {
      Taro.navigateTo({
        url: `/pages/about-order/bulk-order/bulk-order?product_id=${
          detail.id
        }&options=${JSON.stringify(
          optionValue
        )}&options_name=${optionName}&options_image=${optionValueImg}&quantity=${quantity}&bulkId=${bulkId}&size=${size}`,
      });
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
      isBulk,
      productCount,
      currency,
      toastopened,
      toasttext,
      salesList,
    } = this.state;
    const items = [
      { title: Taro.T._("newjoinbulk"), desc: "" },
      { title: Taro.T._("invitefriends"), desc: "" },
      { title: Taro.T._("finishshipments"), desc: "" },
    ];
    return (
      <ScrollView className="product-detail-container">
        <Navbar title={detail.name ? detail.name : Taro.T._("products")} />
        {detail.images ? <ProductDetailSwiper images={detail.images} /> : null}
        <View className="product-detail-container-title">
          <Text>{detail.name}</Text>
        </View>
        <View className="product-detail-container-price">
          <View>
            <Text className="product-detail-container-price-msrp">
              {currency.symbol}
              {parseFloat(price).toFixed(2)}
            </Text>
          </View>
          <Text className="product-detail-container-price-sales">
            {Taro.T._("sold")}： 0
          </Text>
        </View>
        <View className="product-detail-container-price">
          {detail.bulk_price
            ? Object.keys(detail.bulk_price).map((bulknumber) => {
                return (
                  <View>
                    <Text className="product-detail-container-price-current">
                      {currency.symbol}
                      {parseFloat(detail.bulk_price[bulknumber]).toFixed(2)}
                    </Text>
                    <Text className="product-detail-container-price-people">
                      {" "}
                      /{bulknumber + Taro.T._("bulkpeople")}
                    </Text>
                  </View>
                );
              })
            : null}
        </View>
        <View className="product-detail-container-step">
          <AtSteps items={items} current={0} />
        </View>
        <View className="product-detail-container-soldc">
          {salesList.sales && salesList.sales.length > 0
            ? salesList.sales.map((sale) => {
                console.log(sale);
                return (
                  <View
                    className="product-detail-container-soldc-item"
                    onClick={() =>
                      this.joinToBulk(
                        sale.id,
                        sale.qty,
                        sale.options,
                        sale.options_name,
                        sale.options_image,
                        sale.size
                      )
                    }
                  >
                    <View className="product-detail-container-soldc-item-title">
                      <Text>
                        {sale.sale_text}
                        {sale.options_name ? "(" + sale.options_name + ")" : ""}
                      </Text>
                      <Text>
                        {sale.count}/{sale.size}
                      </Text>
                    </View>
                    <View>
                      <AtProgress percent={sale.progress} color="#FF4949" />
                    </View>
                    <View className="product-detail-container-soldc-item-action">
                      <Text className="product-detail-container-soldc-item-action-button">
                        {Taro.T._("joinbulk")}
                      </Text>
                    </View>
                  </View>
                );
              })
            : null}
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
            handleBulkClick={() => this.handleBulkClick()}
            productCount={productCount}
          />
        </View>
        <AtFloatLayout
          title={detail.name}
          isOpened={isOpenedCart}
          className="product-detail-container-option"
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
            <AtButton type="primary" onClick={() => this.addToCartOrBulk()}>
              {isBulk ? Taro.T._("newbulk") : Taro.T._("addtocart")}
            </AtButton>
          </View>
        </AtFloatLayout>
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
