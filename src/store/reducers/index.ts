import { combineReducers } from "redux";
import { category, productInfo, homeProduct, searchProduct } from "./product";
import { cart } from "./cart";
import { coupons } from "./coupons";
import { order } from "./order";
import { forumCategory, forumPostInfo } from "./forum";
import { wishlist } from "./wishlist";
import { currency } from "./currency";
import { balance } from "./balance";
import {
  systemNotification,
  unreadSystemNotification,
  myNotification,
  unreadMyNotification,
} from "./notification";
import { banner } from "./banner";
export default combineReducers({
  category,
  cart,
  coupons,
  productInfo,
  searchProduct,
  order,
  forumCategory,
  forumPostInfo,
  homeProduct,
  wishlist,
  currency,
  balance,
  systemNotification,
  unreadSystemNotification,
  myNotification,
  unreadMyNotification,
  banner,
});
