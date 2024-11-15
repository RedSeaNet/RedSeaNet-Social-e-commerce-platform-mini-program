import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./item.scss";
import { AtIcon, AtTag, AtAvatar } from "taro-ui";
import { connect } from "react-redux";
import { forumLikePost } from "./../../../../api/request";
import { useState } from "react";
const Item = (props) => {
  const [liked, setLiked] = useState(props.liked ? parseInt(props.liked) : 0);
  const [like, setLike] = useState(props.like ? parseInt(props.like) : 0);
  const goToPost = (postId) => {
    console.log("postId:" + postId);
    Taro.navigateTo({
      url: `/pages/about-find/find-detail/find-detail?postId=${postId}`,
    });
  };
  const goToCustomer = (customerId) => {
    console.log("customerId:" + customerId);
    Taro.navigateTo({
      url: `/pages/about-find/customer-space/customer-space?spaceId=${props.customer_id}`,
    });
  };
  const goToLike = (postId) => {
    setLiked(1);
    setLike(like + 1);
    forumLikePost(postId).then((data) => {});
    return false;
  };
  return (
    <View key={props.id} className="container">
      <View className="container-customer">
        <View className="container-customer-avatar">
          <Image
            src={props.customer_avatar}
            className="container-customer-avatar-img"
            mode="widthFix"
            onClick={() => goToCustomer(props.customer_id)}
          />
        </View>
        <View className="container-customer-right">
          <Text
            className="container-customer-right-username"
            onClick={() => goToCustomer(props.customer_id)}
          >
            {props.customer_name}
          </Text>
          <Text className="container-customer-right-date">
            {props.created_at_string}
          </Text>
        </View>
      </View>
      <View className="container-title">
        <Text onClick={() => goToPost(props.id)}>{props.title}</Text>
      </View>
      <View className="container-images" onClick={() => goToPost(props.id)}>
        {props.images && props.images.length > 0
          ? props.images.map((image) => {
              return <image src={image} mode="widthFix" />;
            })
          : null}
      </View>
      {props.tags ? (
        <View className="container-bottom">
          {props.tags.split(",").map((tag, ldx) => {
            return (
              <AtTag type="primary" circle size="small">
                {tag}
              </AtTag>
            );
          })}
        </View>
      ) : null}
      <View className="container-bottom">
        <AtIcon
          value="edit"
          size="12"
          color="#707070"
          onClick={() => props.layoutOpenAction(props.id)}
        ></AtIcon>
        <Text>{props.reviews} </Text>
        {liked > 0 ? (
          <AtIcon
            value="heart-2"
            size="12"
            color="#d62c75"
            id={props.id}
          ></AtIcon>
        ) : (
          <AtIcon
            value="heart"
            size="12"
            color="#707070"
            id={props.id}
            onClick={() => goToLike(props.id)}
          ></AtIcon>
        )}
        <Text>{like}</Text>
      </View>
    </View>
  );
};
const mapStateToProps = ({ user, forumCategory, forumPostInfo }) => ({
  user: user,
  forumCategory,
  forumPostInfo,
});
export default connect(mapStateToProps)(Item);
