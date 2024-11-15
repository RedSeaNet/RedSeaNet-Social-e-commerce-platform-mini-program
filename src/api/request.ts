import Taro from "@tarojs/taro";
import { axios } from "./config";
import { TOKEN, USER, LOCALEID, CURRENCY } from "../utils/constant";
import JsenCrypt from "jsencrypt";
import configStore from "../store";
const store = configStore();
import { requestCart } from "../store/actions/cart";
const USERNAME = "xxxxxx";
const PASSWORD = "xxxx";
const PUBLIC_KEY = "xxxxxx";

/**
 * 获取token
 */
export async function getToken() {
  let tokenData = Taro.getStorageSync(TOKEN);
  const currentDate = new Date();
  const currentTimestamp = parseInt(currentDate.getTime() / 1000);
  console.log("---tokenData-----");
  console.log(tokenData);
  console.log(currentTimestamp);
  console.log(parseInt(tokenData.time));
  if (
    tokenData &&
    tokenData.id &&
    tokenData.token &&
    parseInt(tokenData.time) > currentTimestamp - 5000
  ) {
    return tokenData;
  } else {
    let data = {
      id: "1",
      method: "getToken",
      params: [USERNAME, PASSWORD, "denny-test-devices"],
    };
    let result = await axios(data);
    Taro.setStorage({ key: TOKEN, data: result });
    return result;
  }
}

/**
 * 用户登录
 * @param username
 * @param password
 */
export async function login(username, password) {
  let token = await getToken();
  let encrypt = new JsenCrypt();
  encrypt.setPublicKey(PUBLIC_KEY);
  let data = {
    id: "1",
    method: "customerValid",
    params: [token.id, token.token, username, encrypt.encrypt(password)],
  };
  let result = await axios(data);
  console.log("-----login result------");
  console.log(result);
  Taro.setStorageSync(USER, result);
  store.dispatch(requestCart());
  Taro.navigateBack();
}

/**
 * 获取产品分类
 * @returns {Promise<any>}
 */
export async function getCategoryByMenu() {
  let token = await getToken();
  let data = {
    id: 1,
    method: "getCategory",
    params: [token.id, token.token, 1, { include_in_menu: 1 }],
  };
  let result = await axios(data);
  return result;
}

/**
 * 获取产品列表
 * @param categories 分类id数组
 * @param page 页码
 * @param limit 返回个数
 */
export async function getProductByCategoryIds(
  categories,
  page = 0,
  limit = 10,
  status = 1
) {
  let token = await getToken();
  let currency = Taro.getStorageSync(CURRENCY);
  let language = Taro.getStorageSync(LOCALEID);
  let data = {
    id: 1,
    method: "getProductByCategoryIds",
    params: [
      token.id,
      token.token,
      {
        categories: categories,
        page: page,
        limit: limit,
        status: status,
      },
      language,
      currency.code,
    ],
  };
  let result = await axios(data);
  return result;
}

/**
 * 获取产品详情
 * @param productId
 * @returns {Promise<any>}
 */
export async function getProductDetailById(productId) {
  let token = await getToken();
  let currency = Taro.getStorageSync(CURRENCY);
  let language = Taro.getStorageSync(LOCALEID);
  console.log(currency);
  let data = {
    id: 1,
    method: "getProductById",
    params: [token.id, token.token, productId, language, currency.code],
  };
  let result = await axios(data);
  return result;
}

/**
 * 添加到购物车
 * @param productId 产品id
 * @param quantity 数量
 * @param sku 产品编码
 */
export async function addProductToCart(productId, quantity, sku, options = []) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let language = Taro.getStorageSync(LOCALEID);
  if (!user) {
    // Taro.navigateTo({
    //     url: `/pages/user-login/user-login`
    // })
    return false;
  }
  let data = {
    id: 1,
    method: "addItemToCart",
    params: [
      token.id,
      token.token,
      user.id,
      {
        product_id: productId,
        qty: quantity,
        warehouse_id: 1,
        sku,
        options,
      },
      language,
      currency.code,
    ],
  };
  let result = await axios(data);
  return result;
}

/**
 * 获取购物车信息
 */

export async function getCartsInfo() {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let language = Taro.getStorageSync(LOCALEID);
  if (!user) {
    Taro.navigateTo({
      url: `/pages/about-personal/user-login/user-login`,
    });
    return false;
  }
  let data = {
    id: 1,
    method: "cartInfo",
    params: [token.id, token.token, user.id, "true", language, currency.code],
  };
  let result = await axios(data);
  console.log("123", result);
  return result;
}

/**
 * 修改购物车数量
 * @param id 购物车信息中的id
 * @param quantity 数量
 * @returns {Promise<*>}
 */
export async function changeProductQuantity(id, quantity) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let language = Taro.getStorageSync(LOCALEID);
  if (!user) {
    Taro.navigateTo({
      url: `/pages/about-personal/user-login/user-login`,
    });
    return false;
  }
  let data = {
    id: 1,
    method: "cartChangeItemQty",
    params: [
      token.id,
      token.token,
      user.id,
      id,
      quantity,
      language,
      currency.code,
    ],
  };
  let result = await axios(data);
  return result;
}
/**
 * 删除购物车产品
 * @param ids 购物车信息中的id
 * @returns {Promise<*>}
 */
export async function removeProductInCart(ids = []) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let language = Taro.getStorageSync(LOCALEID);
  if (!user) {
    Taro.navigateTo({
      url: `/pages/about-personal/user-login/user-login`,
    });
    return false;
  }
  let data = {
    id: 1,
    method: "cartRemoveItem",
    params: [token.id, token.token, user.id, ids, language, currency.code],
  };
  let result = await axios(data);
  return result;
}
/**
 * 修改购物车产品状态
 * @param ids
 * @param actionType
 * @returns {Promise<*>}
 */
export async function changeStatusCart(ids, actionType = 1) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let language = Taro.getStorageSync(LOCALEID);
  if (!user) {
    Taro.navigateTo({
      url: `/pages/about-personal/user-login/user-login`,
    });
    return false;
  }
  let data = {
    id: 1,
    method: "cartChangeItemStatus",
    params: [
      token.id,
      token.token,
      user.id,
      ids,
      actionType,
      language,
      currency.code,
    ],
  };
  let result = await axios(data);
  return result;
}
/**
 * 获取收货地址
 * @returns {Promise<any>}
 */
export async function getAddress() {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let language = Taro.getStorageSync(LOCALEID);
  let data = {
    id: 1,
    method: "addressList",
    params: [token.id, token.token, user.id, language],
  };
  let result = await axios(data);
  return result;
}

/**
 * 配送方式信息
 * @param storeIds 店铺ID array [1,2,3], when null only get default shipping
 */
export async function getShippingMethod(storeIds) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let language = Taro.getStorageSync(LOCALEID);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "getShippingMethod",
    params: [
      token.id,
      token.token,
      user.id,
      storeIds,
      0,
      language,
      currency.code,
    ],
  };
  console.log("getShippingMethod:");
  console.log(data);
  let result = await axios(data);
  console.log(result);
  return result;
}

/**
 * 生成订单
 * @param data 生成订单的数椐
 * ["payment_method":"alipay_direct_pay","shipping_address_id":"91",
 * "billing_address_id":"91","shipping_method":{"1":"free_shipping"}]
 */
export async function placeOrder(sendData) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "placeOrder",
    params: [token.id, token.token, user.id, sendData],
  };
  console.log("网络请求", data);
  let result = await axios(data);
  console.log("fdsfsd", result);
  return result;
}

/**
 * 支付信息信息
 */
export async function getPaymentMethod() {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let language = Taro.getStorageSync(LOCALEID);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "getPaymentMethod",
    params: [token.id, token.token, user.id, language, currency.code],
  };
  let result = await axios(data);
  return result;
}

/**
 * 社区分类
 */
export async function getForumCategory(condition = {}) {
  let token = await getToken();
  let language = 1;
  let data = {
    id: 1,
    method: "getForumCategory",
    params: [token.id, token.token, condition, language],
  };
  let result = await axios(data);
  return result;
}
/**
 * 社区贴子列表
 *
 */
export async function getForumPostList(condition = {}, page = 1, limit = 20) {
  let token = await getToken();
  let language = 1;
  let user = Taro.getStorageSync(USER);
  condition.status = 1;
  condition.is_draft = 0;
  let data = {
    id: 1,
    method: "getForumPostList",
    params: [
      token.id,
      token.token,
      condition,
      language,
      page,
      limit,
      user.id ? user.id : "",
    ],
  };
  let result = await axios(data);
  return result;
}
/**
 * 根据id获取帖子的详情
 * @param postId 帖子id
 * @returns {Promise<unknown>}
 */
export async function getForumPostById(postId) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let language = 1;
  let data = {
    id: 1,
    method: "getForumPostById",
    params: [token.id, token.token, postId, language, user.id ? user.id : ""],
  };
  let result = await axios(data);
  return result;
}

/**
 * 发验证码email
 * @param to string, mobilephone number
 * @param template string, template code in server
 * @param params array, [code]
 */
export async function sendEmailUserTemplate(to, template, params) {
  console.log("sendEmailUserTemplate-----");
  let token = await getToken();
  let language = 1;
  let data = {
    id: 1,
    method: "sendEmailUserTemplate",
    params: [token.id, token.token, to, template, params, language],
  };
  console.log(data);
  let result = await axios(data);
  console.log(result);
  return result;
}
export async function signup(signupData) {
  let token = await getToken();
  let encrypt = new JsenCrypt();
  encrypt.setPublicKey(PUBLIC_KEY);
  let data = {
    id: "1",
    method: "customerCreate",
    params: [
      token.id,
      token.token,
      {
        username: signupData.username,
        email: signupData.email,
        cel: signupData.cel,
        password: encrypt.encrypt(signupData.password),
        motto: signupData.motto,
        referer: signupData.referer,
        avatar: signupData.avatar,
        zone: signupData.zone ? signupData.zone : "",
      },
    ],
  };
  console.log(data);
  let userInfo = await axios(data);
  console.log(userInfo);
  return userInfo;
}
/**
 * 更新顾客数椐
 * @param updateData array
 */
export async function customerUpdate(updateData) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "customerUpdate",
    params: [token.id, token.token, user.id, updateData],
  };
  let customerData = await axios(data);
  console.log(customerData);
  Taro.setStorageSync(USER, customerData);
  Taro.showToast({
    title: "update user information successfully!",
    icon: "none",
    duration: 2000,
  });
  return customerData;
}
/**
 * 发验证码短信
 * @param to mobilephone number
 * @param template template code in server
 * @param code vaild code
 */
export async function sendSmsCodeForCusotmer(to, template, code) {
  let token = await getToken();
  let data = {
    id: 1,
    method: "sendSmsCodeForCusotmer",
    params: [token.id, token.token, to, template, code],
  };
  let result = await axios(data);
  return result;
}

/**
 * 取订单列表
 * @param conditions 生成订单的数椐 array
 */
export async function getOrder(
  page,
  statusId = "",
  limit = 20,
  desc = "created_at"
) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let language = Taro.getStorageSync(LOCALEID);
  let currency = Taro.getStorageSync(CURRENCY);
  let conditionData = {};
  conditionData["limit"] = limit;
  conditionData["page"] = page;
  conditionData["customer_id"] = user.id;
  if (statusId != "") {
    conditionData["status_id"] = statusId;
  }
  conditionData["desc"] = desc;
  let data = {
    id: 1,
    method: "getOrder",
    params: [token.id, token.token, conditionData, language, currency.code],
  };
  console.log(data);
  let result = await axios(data);
  console.log(result);
  return result;
}
/**
 * 取订单列表
 * @param orderId 订单id
 */
export async function getOrderById(orderId) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "getOrderById",
    params: [token.id, token.token, orderId, language, currency.code],
  };
  console.log(data);
  let result = await axios(data);
  console.log(result);
  return result;
}

/**
 * 拿优惠券信息
 */
export async function getCoupons(page = 1) {
  let token = await getToken();
  let data = {
    id: 1,
    method: "getCoupons",
    params: [token.id, token.token],
    page: page,
  };
  console.log(data);
  let result = await axios(data);
  console.log(result);
  return result;
}

/**
 * 添加收货地址
 */
export async function addressSave(
  name,
  phone,
  detailAddress,
  countryId,
  provinceId,
  cityId,
  regionId,
  is_default = 0,
  id = ""
) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "addressSave",
    params: [
      token.id,
      token.token,
      user.id,
      {
        is_default: is_default,
        address: detailAddress,
        city: cityId,
        country: countryId,
        name: name,
        tel: phone,
        postcode: null,
        region: provinceId,
        county: regionId,
        id: id,
      },
    ],
  };
  console.log(data);
  let result = await axios(data);
  console.log(result);
  return result;
}

/**
 * 删除收货地址
 * @param addressId
 * @returns {Promise<any>}
 */
export async function addressDelete(addressId) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "addressDelete",
    params: [token.id, token.token, user.id, addressId],
  };
  console.log(data);
  let result = await axios(data);
  console.log(result);
  return result;
}
/**
 * 取收货地址
 * @param addressId
 * @returns {Promise<any>}
 */
export async function addressInfo(addressId) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "addressInfo",
    params: [token.id, token.token, user.id, addressId],
  };
  console.log(data);
  let result = await axios(data);
  console.log(result);
  return result;
}
/**
 * 获取国家，省份,城市，区列表
 * @param {condition 省份id,}
 * @param condition 省份id
 * @returns {Promise<any>}
 */
export async function getLocateInfo(condition, countryCode = "") {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let data = {
    id: 1,
    method: "getLocateInfo",
    params: [token.id, token.token, condition, countryCode, language],
  };
  console.log(data);
  let result = await axios(data);
  console.log(result);
  return result;
}
/**
 * 添加收藏夹
 * @param itemData 产品数椐
 */
export async function addWishlistItem(itemData) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  if (!user) {
    Taro.redirectTo({
      url: `/pages/about-personal/user-login/user-login`,
    });
    return false;
  }
  let language = Taro.getStorageSync(LOCALEID);
  let data = {
    id: 1,
    method: "addWishlistItem",
    params: [token.id, token.token, user.id, itemData, language],
  };
  console.log(data);
  let result = await axios(data);
  return result;
}
/**
 * 获取收藏夹
 * @param productId 产品id
 * @param quantity 数量
 */
export async function getWishlist(page = 1, limit = 20) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  if (!user) {
    Taro.redirectTo({
      url: `/pages/about-personal/user-login/user-login`,
    });
    return false;
  }
  let language = Taro.getStorageSync(LOCALEID);
  let data = {
    id: 1,
    method: "getWishlist",
    params: [token.id, token.token, user.id, page, limit, language],
  };
  let result = await axios(data);
  return result;
}
/**
 * 获取货
 * @returns {Promise<any>}
 */
export async function getCurrencies() {
  let token = await getToken();
  let data = {
    id: 1,
    method: "getCurrencies",
    params: [token.id, token.token],
  };
  console.log(data);
  let result = await axios(data);
  console.log(result);
  return result;
}
/**
 * 搜索产品
 * @returns {Promise<any>}
 */
export async function getProductByKeyword(
  keyword = "",
  page = 1,
  limit = 20,
  status = 1
) {
  let token = await getToken();
  let currency = Taro.getStorageSync(CURRENCY);
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "getProductByKeyword",
    params: [
      token.id,
      token.token,
      {
        q: keyword,
        page: page,
        limit: limit,
        status: status,
      },
      language,
      currency.code,
    ],
  };
  console.log(data);
  let result = await axios(data);
  console.log(result);
  return result;
}
/**
 * 浏览历史
 * @returns {Promise<any>}
 */
export async function getProductsVisitHistoryList(page = 1, limit = 20) {
  let token = await getToken();
  let currency = Taro.getStorageSync(CURRENCY);
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "getProductsVisitHistoryList",
    params: [
      token.id,
      token.token,
      user.id,
      language,
      page,
      limit,
      currency.code,
    ],
  };
  console.log(data);
  let result = await axios(data);
  console.log("-----getProductsVisitHistoryList-----");
  console.log(result);
  return result;
}

/**
 * 浏览历史
 * @returns {Promise<any>}
 */
export async function getRewardPointsList(condition, page = 1, limit = 20) {
  let token = await getToken();
  let currency = Taro.getStorageSync(CURRENCY);
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "getRewardPointsList",
    params: [token.id, token.token, user.id, condition, language, page, limit],
  };
  console.log(data);
  let result = await axios(data);
  console.log("-----getRewardPointsList-----");
  console.log(result);
  return result;
}
/**
 * 发布帖子
 * @returns {Promise<any>}
 */
export async function addForumPost(
  categoryId,
  title,
  content,
  images,
  poll = {},
  links = [],
  videos = "",
  tags
) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  if (!user) {
    Taro.redirectTo({
      url: `/pages/about-personal/user-login/user-login`,
    });
    return false;
  }
  let data = {
    id: 1,
    method: "addForumPost",
    params: [
      token.id,
      token.token,
      user.id,
      {
        title,
        content,
        description: "",
        images,
        category_id: categoryId,
        openid: user.openid,
        poll: poll,
        links: links,
        videos: videos,
        tags,
      },
      language,
    ],
  };
  console.log("-----require addForumPost-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----addForumPost-----");
  console.log(result);
  return result;
}
/**
 * 点赞帖子
 * @param postId 帖子id
 * @returns {Promise<any>}
 */
export async function forumLikePost(postId) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  if (!user.id) {
    Taro.navigateTo({
      url: `/pages/about-personal/user-login/user-login`,
    });
    return false;
  }
  let data = {
    id: 1,
    method: "forumLikePost",
    params: [token.id, token.token, user.id, postId],
  };
  console.log("-----require forumLikePost-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----forumLikePost-----");
  console.log(result);
  return result;
}
/**
 * 留言帖子
 * @param postId 帖子id
 * @param reviewData
 * @returns {Promise<any>}
 */
export async function forumPostReviewSave(postId, reviewData) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let language = Taro.getStorageSync(LOCALEID);
  if (!user) {
    Taro.navigateTo({
      url: `/pages/about-personal/user-login/user-login`,
    });
    return false;
  }
  reviewData.openid = user.openid;
  let data = {
    id: 1,
    method: "forumPostReviewSave",
    params: [token.id, token.token, user.id, postId, reviewData, language],
  };
  console.log("-----require forumPostReviewSave-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----forumPostReviewSave-----");
  console.log(result);
  return result;
}
/**
 * 删除帖子
 * @param postId 帖子id
 * @returns {Promise<any>}
 */
export async function forumDeletePost(postId) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "forumDeletePost",
    params: [token.id, token.token, user.id, postId],
  };
  console.log("-----require forumDeletePost-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----forumDeletePost-----");
  console.log(result);
  return result;
}
/**
 * 获取帖子留言列表
 * @param postId 帖子id
 * @returns {Promise<any>}
 */
export async function forumPostReviewList(
  condition = {},
  page = 1,
  limit = 20
) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "forumPostReviewList",
    params: [token.id, token.token, condition, page, limit],
  };
  console.log("-----require forumPostReviewList-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----forumPostReviewList-----");
  console.log(result);
  return result;
}
/**
 * 帖子留言回复列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export async function forumPostReplyList(page = 1, limit = 20) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "forumPostReplyList",
    params: [token.id, token.token, user.id, page, limit],
  };
  console.log("-----require forumPostReplyList-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----forumPostReplyList-----");
  console.log(result);
  return result;
}
/**
 * 我的点赞列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export async function getMyLiked(page = 1, limit = 20) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "getMyLiked",
    params: [token.id, token.token, user.id, page, limit],
  };
  console.log("-----require getMyLiked-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----getMyLiked-----");
  console.log(result);
  return result;
}
/**
 * 被点赞列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export async function getBeLikes(page = 1, limit = 20) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "getBeLikes",
    params: [token.id, token.token, user.id, page, limit],
  };
  console.log("-----require getBeLikes-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----getBeLikes-----");
  console.log(result);
  return result;
}
/**
 * 关注列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export async function getFollow(page = 1, limit = 20) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "getFollow",
    params: [token.id, token.token, user.id, page, limit],
  };
  console.log("-----require getFollow-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----getFollow-----");
  console.log(result);
  return result;
}
/**
 * 被关注列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export async function getFans(page = 1, limit = 20) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "getFans",
    params: [token.id, token.token, user.id, page, limit],
  };
  console.log("-----require getFans-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----getFans-----");
  console.log(result);
  return result;
}
/**
 * 被关收藏列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export async function getBeCollected(page = 1, limit = 20) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "getBeCollected",
    params: [token.id, token.token, user.id, page, limit],
  };
  console.log("-----require getBeCollected-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----getBeCollected-----");
  console.log(result);
  return result;
}
/**
 * 收藏列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export async function getFavoritedWithPosts(page = 1, limit = 20) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "getFavoritedWithPosts",
    params: [token.id, token.token, user.id, page, limit],
  };
  console.log("-----require getFavoritedWithPosts-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----getFavoritedWithPosts-----");
  console.log(result);
  return result;
}
/**
 * 关注用户
 * @param toLikeCustomerId
 * @returns {Promise<any>}
 */
export async function forumToLikeCustomer(toLikeCustomerId) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "forumToLikeCustomer",
    params: [token.id, token.token, user.id, toLikeCustomerId],
  };
  console.log("-----require forumToLikeCustomer-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----forumToLikeCustomer-----");
  console.log(result);
  return result;
}
/**
 * 收藏帖子
 * @param postId 帖子id
 * @returns {Promise<any>}
 */
export async function forumFavoritePost(postId) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "forumFavoritePost",
    params: [token.id, token.token, user.id, postId],
  };
  console.log("-----require forumFavoritePost-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----forumFavoritePost-----");
  console.log(result);
  return result;
}
/**
 * 个人主页数椐
 * @param customerId
 * @returns {Promise<any>}
 */
export async function forumSpaceData(customerId) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "forumSpaceData",
    params: [token.id, token.token, customerId, user.id ? user.id : ""],
  };
  console.log("-----require forumSpaceData-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----forumSpaceData-----");
  console.log(result);
  return result;
}

/**
 * 余额列表
 * @returns {Promise<any>}
 */
export async function balanceList(condition, page, limit) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "balanceList",
    params: [
      token.id,
      token.token,
      user.id,
      condition,
      page,
      limit,
      language,
      currency.code,
    ],
  };
  console.log("-----require balanceList-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----balanceList-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function wechatCodeToOpenId(code) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let data = {
    id: 1,
    method: "wechatCodeToOpenId",
    params: [token.id, token.token, code],
  };
  console.log("-----require wechatCodeToOpenId-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----wechatCodeToOpenId-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function wechatMiniprogramLogin(code, username, password) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let encrypt = new JsenCrypt();
  encrypt.setPublicKey(PUBLIC_KEY);
  let data = {
    id: 1,
    method: "wechatMiniprogramLogin",
    params: [token.id, token.token, code, username, encrypt.encrypt(password)],
  };
  console.log("-----require wechatMiniprogramLogin-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----wechatMiniprogramLogin-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function oauthLogin(openId, customerData) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let data = {
    id: 1,
    method: "oauthLogin",
    params: [token.id, token.token, "wechat", openId, customerData],
  };
  console.log("-----require oauthLogin-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----oauthLogin-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function bulkList(condition) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "bulkList",
    params: [
      token.id,
      token.token,
      condition,
      user.id ? user.id : "",
      language,
      currency.code,
    ],
  };
  console.log("-----require bulkList-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----bulkList-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function bulkSalesList(productId, actionOnly = 0) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "bulkSalesList",
    params: [
      token.id,
      token.token,
      productId,
      user.id ? user.id : "",
      actionOnly,
      language,
      currency.code,
    ],
  };
  console.log("-----require bulkSalesList-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----bulkSalesList-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function getShippingMethodByItems(items, shipping_address_id) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "getShippingMethodByItems",
    params: [
      token.id,
      token.token,
      items,
      shipping_address_id,
      language,
      currency.code,
    ],
  };
  console.log("-----require getShippingMethodByItems-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----getShippingMethodByItems-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function bulkApply(productId, bulkId, postData) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let currency = Taro.getStorageSync(CURRENCY);
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "bulkApply",
    params: [
      token.id,
      token.token,
      productId,
      user.id,
      bulkId,
      postData,
      language,
      currency.code,
    ],
  };
  console.log("-----require bulkApply-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----bulkApply-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function getPaymentMethodByCondition(conditon = {}) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "getPaymentMethodByCondition",
    params: [token.id, token.token, conditon, language, currency.code],
  };
  console.log("-----require getPaymentMethodByCondition-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----getPaymentMethodByCondition-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function bargainList(condition) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "bargainList",
    params: [
      token.id,
      token.token,
      condition,
      user.id ? user.id : "",
      language,
      currency.code,
    ],
  };
  console.log("-----require bargainList-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----bargainList-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function getBargain(bargainId, bargainCaseId = "") {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "getBargain",
    params: [
      token.id,
      token.token,
      bargainId,
      user.id ? user.id : "",
      bargainCaseId,
      language,
      currency.code,
    ],
  };
  console.log("-----require getBargain-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----getBargain-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function startBargain(bargainId) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "startBargain",
    params: [
      token.id,
      token.token,
      bargainId,
      user.id ? user.id : "",
      language,
      currency.code,
    ],
  };
  console.log("-----require startBargain-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----startBargain-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function helpBargain(bargainId, bargainCaseId) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "helpBargain",
    params: [
      token.id,
      token.token,
      bargainId,
      user.id ? user.id : "",
      bargainCaseId,
      language,
      currency.code,
    ],
  };
  console.log("-----require helpBargain-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----helpBargain-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function bargainOrder(bargainId, bargainCaseId, bargainData) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "bargainOrder",
    params: [
      token.id,
      token.token,
      user.id ? user.id : "",
      bargainId,
      bargainCaseId,
      bargainData,
      language,
      currency.code,
    ],
  };
  console.log("-----require bargainOrder-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----bargainOrder-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function prepareWorkermanChat(from) {
  let token = await getToken();
  let data = {
    id: 1,
    method: "prepareWorkermanChat",
    params: [token.id, token.token, from],
  };
  console.log("-----require prepareWorkermanChat-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----prepareWorkermanChat-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function startWorkermanChat(to) {
  let token = await getToken();
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "startWorkermanChat",
    params: [token.id, token.token, user.id, to],
  };
  console.log("-----require startWorkermanChat-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----startWorkermanChat-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function chargeBalanceOrder(amount, paymentMethod) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let orderData = {};
  orderData.amount = amount;
  orderData.customer_id = user.id;
  orderData.payment_method = paymentMethod;
  let data = {
    id: 1,
    method: "chargeBalanceOrder",
    params: [token.id, token.token, orderData, language, currency.code],
  };
  console.log("-----require chargeBalanceOrder-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----chargeBalanceOrder-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function selectPayment(orderData) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "selectPayment",
    params: [
      token.id,
      token.token,
      user.id,
      orderData,
      language,
      currency.code,
    ],
  };
  console.log("-----require selectPayment-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----selectPayment-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function selectShipping(orderData) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let currency = Taro.getStorageSync(CURRENCY);
  let data = {
    id: 1,
    method: "selectShipping",
    params: [
      token.id,
      token.token,
      user.id,
      orderData,
      language,
      currency.code,
    ],
  };
  console.log("-----require selectShipping-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----selectShipping-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function getNotificationsList(conditions = [], lastId = 0) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let user = Taro.getStorageSync(USER);
  let data = {
    id: 1,
    method: "getNotificationsList",
    params: [token.id, token.token, user.id, conditions, lastId, language],
  };
  console.log("-----require getNotificationsList-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----getNotificationsList-----");
  console.log(result);
  return result;
}
/**
 *
 * @returns {Promise<any>}
 */
export async function getBannerByCode(code, limit = 8) {
  let token = await getToken();
  let language = Taro.getStorageSync(LOCALEID);
  let data = {
    id: 1,
    method: "getBannerByCode",
    params: [token.id, token.token, code, limit, language],
  };
  console.log("-----require getBannerByCode-----");
  console.log(data);
  let result = await axios(data);
  console.log("-----getBannerByCode-----");
  console.log(result);
  return result;
}
