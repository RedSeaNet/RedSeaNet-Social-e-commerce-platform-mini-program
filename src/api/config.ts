import Taro from "@tarojs/taro";

const BASE_URL = "https://xxxxxxx.com/api/rpc/";
const constType = "application/json";

export function axios(data, method = "POST", url = BASE_URL) {
  return new Promise(async (resolve, reject) => {
    console.log(data);
    //Taro.showNavigationBarLoading();
    try {
      const res = await Taro.request({
        url,
        method,
        data,
        header: {
          "content-type": constType,
        },
      });
      Taro.hideNavigationBarLoading();
      console.log("网络请求结果", res);
      console.log("网络请求结果data:", res.data);
      if (res.data.statusCode == "200") {
        resolve(res.data.data);
      } else {
        console.log(res.data.message);
        Taro.showToast({
          title: res.data.message,
          icon: "none",
          duration: 5000,
        });
        reject(new Error(res.data.message));
      }
    } catch (error) {
      Taro.hideNavigationBarLoading();
      reject(new Error("网络请求出错"));
      Taro.showToast({
        title: "网络开小差",
        icon: "none",
        duration: 5000,
      });
    }
  });
}
