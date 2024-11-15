import { Component } from "react";
import Taro from "@tarojs/taro";
import { Image, Swiper, SwiperItem } from "@tarojs/components";
import { connect } from "react-redux";
import "./find-detail-swiper.scss";
class FindDetailSwiper extends Component {
  render() {
    const images = this.props.images;
    console.log("swiper images:", images);
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
            <SwiperItem className="container-item">
              <Image src={item} mode="heightFix" />
            </SwiperItem>
          );
        })}
      </Swiper>
    );
  }
}
const mapStateToProps = ({ user }) => ({
  user: user,
});
export default connect(mapStateToProps)(FindDetailSwiper);
