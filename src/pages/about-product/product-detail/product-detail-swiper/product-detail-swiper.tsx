import { Component } from "react";
import { Image, Swiper, SwiperItem } from "@tarojs/components";
import { connect } from "react-redux";
import "./product-detail-swiper.scss";
class ProductDetailSwiper extends Component {
  render() {
    const images = this.props.images;
    return (
      <Swiper
        className="container"
        // style={{height:'40%'}}
        indicatorColor="#999"
        indicatorActiveColor="#333"
        circular
        indicatorDots={false}
        autoplay
      >
        {images.map((item) => {
          return (
            <SwiperItem style={{ height: "500px" }}>
              <Image src={item.src} mode="heightFix" />
            </SwiperItem>
          );
        })}
      </Swiper>
    );
  }
}

const mapStateToProps = ({ productInfo }) => ({
  productDetail: productInfo.productDetail,
});

export default connect(mapStateToProps)(ProductDetailSwiper);
