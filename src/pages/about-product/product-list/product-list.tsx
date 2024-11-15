import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView, Text } from "@tarojs/components";
import { connect } from "react-redux";
import { requestProductList } from "../../../store/actions/product";
import ProductLists from "./product-list-item/product-list-item";
import Navbar from "../../../component/navbarTitle/index";
class ProductList extends Component {
  current = getCurrentInstance();
  config = {
    navigationBarTitleText: "产品列表",
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark",
  };
  state = {
    page: 1,
    categoryId: "",
    categoryName: "",
  };
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    let { page } = this.state;
    this.props.dispatch(
      requestProductList([this.current.router.params.categoryId], page)
    );
    this.setState({
      categoryId: this.current.router.params.categoryId,
      categoryName: this.current.router.params.categoryName,
    });
  }

  onPullDownRefresh = () => {
    let { categoryId, page } = this.state;
    this.props.dispatch(requestProductList([categoryId], 1));
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };
  loadMore = () => {
    let { categoryId, page } = this.state;
    this.props.dispatch(requestProductList([categoryId], page + 1));
    this.setState({ page: page + 1 });
  };

  render() {
    let { categoryName } = this.state;
    return (
      <View style={{ position: "relative", overflow: "hidden" }}>
        <Navbar
          title={categoryName != "" ? categoryName : Taro.T._("products")}
        />
        <ProductLists loadMore={this.loadMore} />
      </View>
    );
  }
}

const mapStateToProps = ({ productInfo }) => ({
  productList: productInfo.productList,
});
export default connect(mapStateToProps)(ProductList);
