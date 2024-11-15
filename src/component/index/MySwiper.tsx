import { memo } from "react";
import Taro from "@tarojs/taro";
import { Swiper, SwiperItem, Image } from "@tarojs/components";
import { connect } from "react-redux";

const MySwiper = (props) => {
  return (
    <Swiper
      style="height:200px"
      indicatorColor="#999"
      indicatorActiveColor="#333"
      circular
      indicatorDots
      autoplay
    >
      {props.banner&&props.banner.banner&&props.banner.banner.miniprogramhome?props.banner.banner.miniprogramhome.map((item,key)=>{
        return (item.mini_program_url?<SwiperItem onClick={() => {
          Taro.navigateTo({
            url: item.mini_program_url,
          });
        }}><Image src={item.image}
          style="width:100%"
          mode="widthFix"
        />
        </SwiperItem>:<SwiperItem><Image src={item.image}
          style="width:100%"
          mode="widthFix"
        />
        </SwiperItem>)
      }):null}
    </Swiper>
  );
};
//export default memo(MySwiper);
export default memo(connect(
  ({
    banner
  }) => ({
    banner
  })
)(MySwiper));