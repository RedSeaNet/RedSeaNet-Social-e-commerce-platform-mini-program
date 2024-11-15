import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./item.scss";
import { AtIcon } from "taro-ui";
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
    <View key={props.id} className="containeritem">
      <View className="containeritem-customer">
        <View className="containeritem-customer-avatar">
          <image
            src={props.avatar}
            onClick={() => goToCustomer(props.customer_id)}
          />
        </View>
        <View className="containeritem-customer-right">
          <Text
            className="containeritem-customer-right-username"
            onClick={() => goToCustomer(props.customer_id)}
          >
            {props.author}
          </Text>
          <Text className="containeritem-customer-right-date">
            {props.created_at}
          </Text>
        </View>
      </View>
      <View className="containeritem-title">
        <Text onClick={() => goToPost(props.id)}>{props.title}</Text>
      </View>
      <View className="containeritem-images" onClick={() => goToPost(props.id)}>
        {props.images && props.images.length > 0
          ? props.images.map((image) => {
              return <image src={image} mode="widthFix" />;
            })
          : null}
      </View>
      <View className="containeritem-bottom">
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
