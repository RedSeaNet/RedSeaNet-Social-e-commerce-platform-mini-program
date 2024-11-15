import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, ScrollView, Canvas, CoverView } from "@tarojs/components";
import "./index.scss";
import { connect } from "react-redux";
import Navbar from "../../../component/navbarTitle/index";
import { USER, LOCALE } from "../../../utils/constant";
import React, { Component } from "react";
class BargainSharePost extends Component {
  current = getCurrentInstance();
  constructor(props) {
    super(props);
    this.currentLocale = Taro.getStorageSync(LOCALE);
    this.state = {
      imageTempPath: "",
    };
  }
  async componentWillMount() {}
  componentDidMount() {
    this.drawBall();
  }
  drawBall() {
    const screenHeight = Taro.getSystemInfoSync().windowHeight;
    const screenWidth = Taro.getSystemInfoSync().windowWidth;
    const canvasHeight = 550;
    const canvasWidth = 350;
    Taro.showLoading({
      title: Taro.T._("postergenerating") + "......",
      mask: true,
    });

    var context = Taro.createCanvasContext("shareCanvas", this.$scope);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvasWidth * 2, canvasHeight * 2);

    const imgBg =
      this.currentLocale === "en"
        ? "https://store.redseanet.com/pub/theme/blue/frontend/images/bargain-bg-en.png"
        : "https://store.redseanet.com/pub/theme/blue/frontend/images/bargain-bg-cn.png";
    const imgQr = this.current.router.params.mini_program_qr;
    const bargain_product_image =
      this.current.router.params.bargain_product_image;
    const bargain_title = this.current.router.params.title;
    const bargain_price = this.current.router.params.price;
    const less_price = this.current.router.params.less_price
      ? this.current.router.params.less_price
      : 0;
    const _this = this;
    console.log("------111--------");
    console.log(bargain_product_image);
    Taro.getImageInfo({
      src: imgBg,
      success: function (res) {
        console.log("-------context.width:" + context.width);
        console.log("-------res.width:" + res.width);
        context.drawImage(res.path, 0, 0, canvasWidth, canvasHeight);
        console.log("loading successfully.....");
        Taro.getImageInfo({
          src: bargain_product_image,
          success: function (res1) {
            let picturex = 0.1571; //商品图左上点
            let picturey = 0.2916;
            let picturebx = 0.6857; //商品图右下点
            let pictureby = 0.3916;
            context.drawImage(
              res1.path,
              canvasWidth * picturex,
              canvasHeight * picturey,
              canvasWidth * picturebx,
              canvasHeight * pictureby
            );
            Taro.getImageInfo({
              src: imgQr,
              success: function (res2) {
                console.log("loading res2 successfully......");
                let codex = 0.385; //二维码
                let codey = 0.77;
                let msgx = 0.1036; //msg
                let msgy = 0.2306;
                let labelx = 0.6606; //标签x
                let labely = 0.165; //标签y
                let pricex = 0.1857; //价格x
                let pricey = 0.18; //价格x
                context.drawImage(
                  res2.path,
                  canvasWidth * codex,
                  canvasHeight * codey,
                  90,
                  90
                );
                //标题
                const CONTENT_ROW_LENGTH = 30;
                let [contentLeng, contentArray, contentRows] =
                  _this.textByteLength(bargain_title, CONTENT_ROW_LENGTH);
                if (contentRows > 2) {
                  contentRows = 2;
                  let textArray = contentArray.slice(0, 2);
                  textArray[textArray.length - 1] += "…";
                  contentArray = textArray;
                }
                context.setTextAlign("left");
                context.setFillStyle("#000");
                console.log(contentArray);
                if (contentArray.length < 2) {
                  context.setFontSize(22);
                } else {
                  context.setFontSize(20);
                }
                let contentHh = 8;

                for (let m = 0; m < contentArray.length; m++) {
                  if (m) {
                    context.fillText(
                      contentArray[m],
                      20,
                      35 + contentHh * m + 18,
                      1100
                    );
                    console.log("111");
                  } else {
                    context.fillText(contentArray[m], 20, 35, 1100);
                  }
                }
                // 标签内容
                context.setTextAlign("left");
                context.setFontSize(16);
                context.setFillStyle("#FFF");
                context.fillText(
                  Taro.T._("nowprice"),
                  canvasWidth * labelx,
                  canvasHeight * labely
                );
                // 价格
                context.setFillStyle("red");
                context.setFontSize(26);
                context.fillText(
                  bargain_price,
                  canvasWidth * pricex,
                  canvasHeight * pricey
                );
                // msg
                context.setFillStyle("#333");
                context.setFontSize(16);
                context.fillText(
                  Taro.T._("lessbargain") +
                    less_price +
                    Taro.T._("canbarginsuccessfully"),
                  canvasWidth * msgx,
                  canvasHeight * msgy
                );
                // console.log('before canvasToTempFilePath')
                context.draw(false, () => {
                  Taro.canvasToTempFilePath({
                    canvasId: "shareCanvas",
                    success: function (res) {
                      // console.log('canvasToTempFilePath.success: '+res)
                      Taro.hideLoading();
                      // 获得图片临时路径
                      _this.setState({
                        imageTempPath: res.tempFilePath,
                      });
                    },
                    fail: function (resErr) {
                      // console.log('canvasToTempFilePath.fail: '+resErr)
                    },
                    complete: function (resDone) {
                      // console.log('canvasToTempFilePath.complete: '+resDone)
                    },
                  });
                });
                // console.log('after canvasToTempFilePath')
              },
              fail: function (res2) {
                //失败回调
                Taro.hideLoading();
                console.log("loading image  imgQr fail......");
                //Taro.navigateBack();
              },
            });
          },
          fail: function (res1) {
            //失败回调
            Taro.hideLoading();
            console.log("loading image bargain_product_image fail......");
            //Taro.navigateBack();
          },
        });
      },
      fail: function (res) {
        //失败回调
        Taro.hideLoading();
        console.log("loading image imgBg fail......");
        //Taro.navigateBack();
      },
    });
  }
  saveImage() {
    // 查看是否授权
    let { imageTempPath } = this.state;
    let that = this;
    Taro.getSetting({
      success(res) {
        //未授权
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          Taro.authorize({
            scope: "scope.writePhotosAlbum",
            success: function () {
              //同意授权
              that._saveImage(imageTempPath);
            },
            //拒绝授权引导手动开启
            fail() {
              Taro.showModal({
                title: "提示",
                confirmText: "确认",
                cancelText: "取消",
                content: "是否开启相册权限",
                success(res) {
                  if (res.confirm) {
                    Taro.openSetting();
                  } else if (res.cancel) {
                  }
                },
              });
            },
          });
          //已授权
        } else {
          that._saveImage(imageTempPath);
        }
      },
    });
  }
  _LongPress = (e) => {
    let that = this;
    Taro.showActionSheet({
      itemList: ["保存到系统相册", "取消"],
      success(res) {
        //保存到系统相册
        if (res.tapIndex == 0) {
          that._saveImageAuthorize(e.target.dataset.url);
        } else {
          console.log("取消保存");
        }
      },
    });
  };

  _saveImageAuthorize(url) {
    let that = this;
    Taro.getSetting({
      success(res) {
        //未授权
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          Taro.authorize({
            scope: "scope.writePhotosAlbum",
            success: function () {
              //同意授权
              that._saveImage(url);
            },
            //拒绝授权引导手动开启
            fail() {
              Taro.showModal({
                title: "提示",
                confirmText: "确认",
                cancelText: "取消",
                content: "是否开启相册权限",
                success(res) {
                  if (res.confirm) {
                    Taro.openSetting();
                  } else if (res.cancel) {
                    console.log("authorize cancel--");
                  }
                },
              });
            },
          });
          //已授权
        } else {
          that._saveImage(url);
        }
      },
    });
  }

  _saveImage(url) {
    console.log(url);
    Taro.getImageInfo({
      src: url,
      success(res) {
        Taro.saveImageToPhotosAlbum({
          filePath: res.path,
          success() {
            Taro.showToast({
              title: "海报已经保存到你的相册了！",
              icon: "none",
              duration: 3000,
            });
          },
          fail() {
            Taro.showToast({
              title: "海报保存到你的相册失败！",
              icon: "none",
              duration: 3000,
            });
          },
        });
      },
    });
  }
  // 文字换行
  fillTextWrap(ctx, text, x, y, maxWidth, lineHeight) {
    // 设定默认最大宽度
    const systemInfo = Taro.getSystemInfoSync();
    const deciveWidth = systemInfo.screenWidth;
    // 默认参数
    maxWidth = maxWidth || deciveWidth;
    lineHeight = lineHeight || 20;
    // 校验参数
    if (
      typeof text !== "string" ||
      typeof x !== "number" ||
      typeof y !== "number"
    ) {
      return;
    }
    // 字符串分割为数组
    const arrText = text.split("");
    // 当前字符串及宽度
    let currentText = "";
    let currentWidth;
    ctx.font = "normal 11px sans-serif";
    ctx.setFontSize(16);
    ctx.setFillStyle("#3A3A3A");
    ctx.setTextAlign("justify");
    for (let letter of arrText) {
      currentText += letter;
      currentWidth = ctx.measureText(currentText).width;
      if (currentWidth > maxWidth) {
        ctx.fillText(currentText, x, y);
        currentText = "";
        y += lineHeight;
      }
    }
    if (currentText) {
      ctx.fillText(currentText, x, y);
    }
  }
  textByteLength(text, num) {
    let strLength = 0;
    let rows = 1;
    let str = 0;
    let arr = [];
    for (let j = 0; j < text.length; j++) {
      if (text.charCodeAt(j) > 255) {
        strLength += 2;
        if (strLength > rows * num) {
          strLength++;
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      } else {
        strLength++;
        if (strLength > rows * num) {
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      }
    }
    arr.push(text.slice(str, text.length));
    return [strLength, arr, rows]; //  [处理文字的总字节长度，每行显示内容的数组，行数]
  }
  onShareAppMessage = (res) => {
    return {
      title:
        "你的好友" +
        this.current.router.params.user_name +
        "邀请你帮他砍" +
        this.current.router.params.title,
      path: `/pages/about-order/bargain-detail/bargain-detail?bargain_id=${this.current.router.params.bargain_id}&bargain_user_id=${this.current.router.params.bargain_case_id}`,
      imageUrl: this.current.router.params.bargain_product_image,
    };
  };
  onShareTimeline = (res) => {
    return {
      title:
        "你的好友" +
        this.current.router.params.user_name +
        "邀请你帮他砍" +
        this.current.router.params.title,
      path: `/pages/about-order/bargain-detail/bargain-detail?bargain_id=${this.current.router.params.bargain_id}&bargain_case_id=${this.current.router.params.bargain_case_id}`,
      imageUrl: this.current.router.params.bargain_product_image,
    };
  };
  render() {
    return (
      <View className="sharePost">
        <Navbar title={Taro.T._("bargain")}></Navbar>
        <View className="sharePost-title" onClick={this.saveImage.bind(this)}>
          <Text>{Taro.T._("shareposterdownloadnote")}</Text>
        </View>
        <View style="position: relative;">
          <Canvas
            style="width: 96vw; height: 560px;background:#fff;margin:2vw;"
            canvas-id="shareCanvas"
            canvasId="shareCanvas"
            id="shareCanvas"
          >
            <CoverView
              style="position: absolute;top: 0;left: 0;width: 96vw; height: 560px;"
              onClick={this.saveImage.bind(this)}
            ></CoverView>
          </Canvas>
        </View>
        <View className="sharePost-title" onClick={this.saveImage.bind(this)}>
          <Text>{Taro.T._("shareposterdownloadnote")}</Text>
        </View>
      </View>
    );
  }
}
export default connect(({ shop, cart }) => ({ shop, cart: cart.cart }))(
  BargainSharePost
);
