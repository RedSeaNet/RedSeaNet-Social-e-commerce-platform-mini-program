import { memo } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";

function HomeCategory(props) {
  const { list } = props;
  const handleClick = (id, name) => {
    Taro.navigateTo({
      url: `/pages/about-product/product-list/product-list?categoryId=${id}&categoryName=${name}`,
    });
  };
  return (
    <View className="home-category">
      <View className="home-category-item">
        <Image
          src={require("./../../../assets/bulk-icon.png")}
          className="home-category-item-img"
          mode="widthFix"
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/about-order/bulk-list/index`,
            });
          }}
        />
        <Text className="home-category-item-name">{Taro.T._("bulk")}</Text>
      </View>
      <View className="home-category-item">
        <Image
          src={require("./../../../assets/bargain-icon.png")}
          className="home-category-item-img"
          mode="widthFix"
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/about-order/bargain-list/bargain-list`,
            });
          }}
        />
        <Text className="home-category-item-name">{Taro.T._("bargain")}</Text>
      </View>
      {list && list.length > 0
        ? list.map((item, idx) => {
            const { imageuri, name } = item;
            return (
              <View
                className="home-category-item"
                onClick={() => handleClick(item.id, name)}
              >
                <Image
                  src={imageuri}
                  className="home-category-item-img"
                  mode="widthFix"
                />
                <Text className="home-category-item-name">{name}</Text>
              </View>
            );
          })
        : null}
    </View>
  );
}
export default memo(HomeCategory);
