import React, { Component } from "react";
import Taro from "@tarojs/taro";
import "./publish-post.scss";
import { View, Text } from "@tarojs/components";
import { connect } from "react-redux";
import { addForumPost, getToken } from "./../../../api/request";
import {
  AtIcon,
  AtButton,
  AtImagePicker,
  AtInput,
  AtForm,
  AtTextarea,
  AtToast,
  AtFloatLayout,
  AtInputNumber,
  AtTag,
} from "taro-ui";
import Navbar from "../../../component/navbarTitle/index";
import {
  requestFroumCategory,
  requestFroumPost,
} from "../../../store/actions/forum";
import { USER } from "../../../utils/constant";
import WPicker from "../../../component/wPicker/index";
class PublishPost extends Component {
  config = {
    navigationBarTitleText: "Publish post",
  };
  state = {
    page: 1,
    user: {},
    images: [],
    title: "",
    content: "",
    categoryId: "",
    loading: false,
    toastIsOpened: false,
    toastText: false,
    videos: [],
    openid: "",
    addLinkFloatLayoutOpened: false,
    addPollFloatLayoutOpened: false,
    links: [],
    polls: [],
    linktitle: "",
    linkurl: "",
    polltitle: "",
    polloptions: [],
    polloptiontitle: "",
    pollatmostoption: 1,
    pollexpiredate: "2023-01-01",
    video: "",
    addTagFloatLayoutOpened: false,
    tagname: "",
    tags: [],
  };
  async componentWillMount() {}
  componentDidMount() {
    this.props.dispatch(requestFroumCategory());
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.setState({ user: userData });
    }
    let dateObject = new Date();
    let todayString =
      dateObject.getFullYear() +
      "-" +
      (dateObject.getMonth() + 1) +
      "-" +
      dateObject.getDate();
    this.setState({ pollexpiredate: todayString });
  }
  componentWillUnmount() {}
  componentDidShow() {
    let userData = Taro.getStorageSync(USER);
    if (userData.id) {
      this.setState({ user: userData });
    } else {
      Taro.navigateTo({ url: "/pages/about-personal/user-login/user-login" });
      Taro.showToast({
        title: Taro.T._("pleaseloginforcontinue") + "!",
        icon: "none",
        duration: 2000,
      });
    }
  }

  componentDidHide() {}
  onImageChange(files) {
    this.setState({
      images: files,
    });
  }
  onImageFail(mes) {
    console.log(mes);
  }
  onImageClick(index, file) {
    console.log(index, file);
  }
  handleTitleChange(value) {
    this.setState({ title: value });
  }
  handleContentChange(value) {
    console.log("content:" + value);
    this.setState({ content: value });
  }

  publishAction = async () => {
    let that = this;
    let user = Taro.getStorageSync(USER);
    let {
      categoryId,
      title,
      content,
      images,
      polloptions,
      polltitle,
      pollatmostoption,
      pollexpiredate,
      links,
      video,
      tags,
    } = this.state;
    if (title == "") {
      Taro.showToast({
        title: Taro.T._("pleaseentertitle"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    if (content == "") {
      Taro.showToast({
        title: Taro.T._("pleaseentercontent"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    this.setState({ loading: true });
    let imagesBase64 = [];
    console.log(images);
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        if (process.env.TARO_ENV == "weapp") {
          //const base64 = 'data:image/jpeg;base64,'+ Taro.getFileSystemManager().readFilesSync(item.file.path,'base64')
          let base64 =
            "data:image/png;base64," +
            wx
              .getFileSystemManager()
              .readFileSync(images[i].file.path, "base64");
          imagesBase64.push(base64);
        } else {
          Taro.request({
            url: item.url,
            responseType: "arraybuffer",
            success: async (res) => {
              let base64 = Taro.arrayBufferToBase64(new Uint8Array(res.data));
              base64 = "data:image/png;base64," + base64;
              imagesBase64.push(base64);
            },
          });
        }
      }
    } else {
      Taro.showToast({
        title: Taro.T._("selectatleastoneimage"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    console.log(imagesBase64);
    let poll = {};
    if (polltitle != "" && polloptions.length > 0) {
      poll.title = polltitle;
      poll.description = polloptions;
      poll.max_choices = pollatmostoption;
      poll.expired_at = pollexpiredate;
    }
    let videos = "";
    if (video != "") {
      let token = await getToken();
      Taro.showLoading({
        title: "上传中",
        mask: true, //是否显示透明蒙层，防止触摸穿透
      });
      console.log(video);
      const uploadTask = Taro.uploadFile({
        url: "https://store.redseanet.com/forum/post/uploadVideo/",
        filePath: video,
        name: "video",
        header: {
          "content-type": "multipart/form-data",
        },
        formData: {
          id: token.id,
          token: token.token,
        }, // HTTP 请求中其他额外的 form data
        success(res) {
          console.log(res);
          let dataRes = JSON.parse(res.data);
          console.log("---------dataRes----------");
          console.log(dataRes);
          console.log("---------dataRes video----------");
          console.log(dataRes.data.video);
          Taro.hideLoading();
          if (res.statusCode == 200) {
            addForumPost(
              categoryId,
              title,
              content,
              imagesBase64,
              poll,
              links,
              dataRes.data.video,
              tags.join(",")
            ).then((data) => {
              that.setState({
                loading: false,
                toastIsOpened: true,
                toastText: Taro.T._("publishthepostsuccessfully"),
              });
              that.props.dispatch(requestFroumPost());
              console.log(data);
              Taro.redirectTo({
                url: `/pages/about-find/my-post/my-post`,
              });
            });
          } else {
            Taro.showToast({
              title: "上传失败",
              icon: "none",
            });
          }
        },
        fail: function () {
          Taro.hideLoading();
          Taro.showToast({
            title: "上传失败",
            icon: "none",
          });
        },
      });
      //监听上传进度变化事件
      uploadTask.onProgressUpdate((res) => {
        wx.showLoading({
          title: "上传中",
          mask: true, //是否显示透明蒙层，防止触摸穿透
        });
        console.log("上传进度", res.progress);
      });
    } else {
      addForumPost(
        categoryId,
        title,
        content,
        imagesBase64,
        poll,
        links,
        videos,
        tags.join(",")
      ).then((data) => {
        this.setState({
          loading: false,
          toastIsOpened: true,
          toastText: Taro.T._("publishthepostsuccessfully"),
        });
        this.props.dispatch(requestFroumPost());
        console.log(data);
        Taro.redirectTo({
          url: `/pages/about-find/my-post/my-post`,
        });
      });
    }
  };
  handleAddLinkFloatLayoutClose = () => {
    this.setState({ addLinkFloatLayoutOpened: false });
  };
  handleLinkTitleChange(value) {
    this.setState({ linktitle: value });
  }
  handleLinkUrlChange(value) {
    this.setState({ linkurl: value });
  }
  handleAddLink = () => {
    let { linktitle, linkurl, links } = this.state;
    if (linktitle == "") {
      Taro.showToast({
        title: Taro.T._("pleaseenterlinktitle") + "!",
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    if (linkurl == "" || linkurl.indexOf(".") == -1) {
      Taro.showToast({
        title: Taro.T._("pleaseenterlinkurl") + "! Ex: redseanet.com",
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    links.push({ name: linktitle, link: linkurl });
    this.setState({ links: links, linktitle: "", linkurl: "" });
  };
  handleAddPollFloatLayoutClose = () => {
    this.setState({ addPollFloatLayoutOpened: false });
  };
  handlePollTitleChange(value) {
    this.setState({ polltitle: value });
  }
  handlePollOptionChange = (e) => {
    this.setState({ polloptiontitle: e });
  };
  addPollOptionAction = () => {
    const { polloptiontitle, polloptions } = this.state;
    if (polloptiontitle == "") {
      Taro.showToast({
        title: "Please enter poll title!",
        icon: "none",
        duration: 2000,
      });
      return false;
    } else {
      polloptions.push(polloptiontitle);
      this.setState({ polloptiontitle: "", polloptions: polloptions });
      return false;
    }
  };
  handleAtPollOptionChange = (e) => {
    this.setState({ pollatmostoption: e });
  };
  onWPickerRef = (ref) => {
    this.WPicker = ref;
  };
  onWPickerConfirm = (type, e) => {
    console.log(e);
    this.setState({ pollexpiredate: e.value });
  };
  onWPickerCancel = () => {};
  handleExpireDateChange = (e) => {
    this.setState({ pollexpiredate: e });
  };
  onChooseVideo = () => {
    let that = this;
    Taro.chooseVideo({
      sourceType: ["album", "camera"], // album 从相册选视频，camera 使用相机拍摄 'album',
      maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
      camera: "front", //默认拉起的是前置或者后置摄像头，默认back, front = 前置摄像头
      compressed: true, //是否压缩所选择的视频文件
      success(res) {
        console.log(res);
        let tempFilePath = res.tempFilePath; //选择定视频的临时文件路径（本地路径）
        let duration = res.duration; //选定视频的时间长度
        let size = parseFloat(res.size / 1024 / 1024); //选定视频的数据量大小
        console.log(
          "大小==",
          res.size,
          "高度==",
          res.height,
          "宽度==",
          res.width
        );
        console.log("視頻大小", size);
        console.log(tempFilePath);
        // that.data.duration = duration
        if (parseFloat(size) > 15) {
          Taro.showToast({
            title: Taro.T._("vodeoerrorcomment"),
            icon: "none",
          });
        } else {
          console.log(tempFilePath);
          that.setState({ video: tempFilePath });
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      },
    });
  };
  handleAddTagsFloatLayoutClose = () => {
    this.setState({ addTagFloatLayoutOpened: false });
  };
  handleTagNameChange(value) {
    this.setState({ tagname: value });
  }
  handleAddTag = () => {
    let { tagname, tags } = this.state;
    if (tagname == "") {
      Taro.showToast({
        title: Taro.T._("pleaseentertagname") + "!",
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    tags.push(tagname);
    this.setState({ tags: tags, tagname: "" });
  };
  render() {
    let { forumCategory } = this.props;
    let {
      images,
      title,
      content,
      categoryId,
      loading,
      toastIsOpened,
      toastText,
      addLinkFloatLayoutOpened,
      addPollFloatLayoutOpened,
      links,
      polls,
      linkurl,
      linktitle,
      polltitle,
      polloptions,
      polloptiontitle,
      pollatmostoption,
      pollexpiredate,
      video,
      tagname,
      tags,
      addTagFloatLayoutOpened,
    } = this.state;
    return (
      <View className="find">
        <Navbar title={Taro.T._("publishpost")} />
        <View className="find-fromview">
          <AtForm>
            <View
              className="find-fromview-input"
              onClick={() => this.onChooseVideo()}
            >
              <Text>{Taro.T._("video")}: </Text>
              <AtIcon value="video" size="30" color="#F00"></AtIcon>
              <Text>
                {video != ""
                  ? Taro.T._("choosenvideoplaceholder")
                  : Taro.T._("choosevideoplaceholder")}
              </Text>
            </View>
            <View className="find-fromview-input">
              <Text>{Taro.T._("photos")}: </Text>
              <AtImagePicker
                length={5}
                files={images}
                onChange={this.onImageChange.bind(this)}
                onFail={this.onImageFail.bind(this)}
                onImageClick={this.onImageClick.bind(this)}
                showAddBtn={true}
                multiple={true}
                count={9}
              />
            </View>
            <View className="find-fromview-input">
              <AtInput
                name="title"
                title={Taro.T._("title")}
                type="text"
                placeholder={Taro.T._("pleaseentertitle")}
                value={title}
                onChange={this.handleTitleChange.bind(this)}
              />
            </View>
            <View className="find-fromview-input">
              <AtTextarea
                value={content}
                onChange={this.handleContentChange.bind(this)}
                maxLength={200}
                placeholder={Taro.T._("pleaseentercontent")}
              />
            </View>
            <View className="find-fromview-addtional">
              <View
                onClick={() => {
                  this.setState({ addLinkFloatLayoutOpened: true });
                }}
              >
                <AtIcon value="link" size="30" color="#F00"></AtIcon>
                <Text>{Taro.T._("addlink")}</Text>
              </View>
              <View
                onClick={() => {
                  this.setState({ addPollFloatLayoutOpened: true });
                }}
              >
                <AtIcon value="link" size="30" color="#F00"></AtIcon>
                <Text>{Taro.T._("addpoll")}</Text>
              </View>
              <View
                onClick={() => {
                  this.setState({ addTagFloatLayoutOpened: true });
                }}
              >
                <AtIcon value="link" size="30" color="#F00"></AtIcon>
                <Text>{Taro.T._("addtags")}</Text>
              </View>
            </View>
            <View className="find-fromview-category">
              <Text style={{ fontSize: "small" }}>
                {Taro.T._("categories")}：
              </Text>
              {forumCategory.forumCategoryList &&
              forumCategory.forumCategoryList.length > 0
                ? forumCategory.forumCategoryList.map((item, idx) => {
                    return (
                      <Text
                        className="find-fromview-category-texta"
                        onClick={() => {
                          if (categoryId != item.id) {
                            this.setState({ categoryId: item.id });
                          } else {
                            this.setState({ categoryId: "" });
                          }
                        }}
                        style={
                          categoryId == item.id
                            ? {
                                backgroundColor: "#d62c75",
                                border: "1px solid #d62c75",
                                color: "#ffffff",
                              }
                            : ""
                        }
                      >
                        {item.name}
                      </Text>
                    );
                  })
                : ""}
            </View>
            <View className="find-fromview-input">
              <AtButton
                type="primary"
                onClick={this.publishAction}
                loading={loading}
              >
                {Taro.T._("publish")}
              </AtButton>
            </View>
          </AtForm>
        </View>
        <AtToast
          isOpened={toastIsOpened}
          text={toastText}
          icon={"check-circle"}
        ></AtToast>
        <AtFloatLayout
          isOpened={addLinkFloatLayoutOpened}
          title={Taro.T._("addlink")}
          onClose={this.handleAddLinkFloatLayoutClose.bind(this)}
        >
          <View>
            <View>
              {links.length > 0 ? (
                links.map((link, ldx) => {
                  return (
                    <View>
                      <Text key={"link" + ldx}>
                        {link.name + ":" + link.link}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <View>
                  <Text>{Taro.T._("havenotlink")}</Text>
                </View>
              )}
            </View>
            <View>
              <View className="find-fromview-input">
                <AtInput
                  name="linktitle"
                  title={Taro.T._("linktitle")}
                  type="text"
                  placeholder={Taro.T._("pleaseenterlinktitle")}
                  value={linktitle}
                  onChange={this.handleLinkTitleChange.bind(this)}
                />
              </View>
              <View className="find-fromview-input">
                <AtInput
                  name="linkurl"
                  title={Taro.T._("linkurl")}
                  type="text"
                  placeholder={
                    Taro.T._("pleaseenterlinkurl") + "，EX: redseanet.com"
                  }
                  value={linkurl}
                  onChange={this.handleLinkUrlChange.bind(this)}
                />
              </View>
            </View>
            <View className="find-fromview-input">
              <AtButton type="primary" onClick={() => this.handleAddLink()}>
                {Taro.T._("add")}
              </AtButton>
            </View>
            <View className="find-fromview-input">
              <AtButton
                type="primary"
                onClick={() => {
                  this.setState({ addLinkFloatLayoutOpened: false });
                }}
              >
                {Taro.T._("addtocomplete")}
              </AtButton>
            </View>
          </View>
        </AtFloatLayout>
        <AtFloatLayout
          isOpened={addPollFloatLayoutOpened}
          title={Taro.T._("addpoll")}
          onClose={this.handleAddPollFloatLayoutClose.bind(this)}
        >
          <View>
            <View>
              <AtInput
                name="polltitle"
                title={Taro.T._("polltitle")}
                type="text"
                placeholder={Taro.T._("pleaseenterpolltitle")}
                value={polltitle}
                onChange={this.handlePollTitleChange.bind(this)}
              />
            </View>
            <View>
              <View>
                <Text>{Taro.T._("polloptions")}</Text>
              </View>
              <View>
                {polloptions.length > 0
                  ? polloptions.map((option, oidx) => {
                      return (
                        <View>
                          <Text>{option}</Text>
                        </View>
                      );
                    })
                  : null}
              </View>
              <View>
                <AtInput
                  name="polloptiontitle"
                  type="text"
                  placeholder={Taro.T._("pleaseenteroptiontitle")}
                  value={polloptiontitle}
                  onChange={this.handlePollOptionChange}
                >
                  <Text onClick={() => this.addPollOptionAction()}>
                    {Taro.T._("addpolloption")}
                  </Text>
                </AtInput>
              </View>
              <View>
                <Text>{Taro.T._("atmostoption")}:</Text>
                <AtInputNumber
                  name="atmostoption"
                  title={Taro.T._("atmostoption")}
                  value={pollatmostoption}
                  onChange={this.handleAtPollOptionChange.bind(this)}
                  min={1}
                  max={10}
                  step={1}
                  type="number"
                />
              </View>
            </View>
            <View>
              <AtInput
                title={Taro.T._("expiredate")}
                name="expiredate"
                type="text"
                placeholder={Taro.T._("pleaseenterexpiredate")}
                value={pollexpiredate}
                onChange={this.handleExpireDateChange.bind(this)}
              >
                <Text
                  onClick={() => {
                    this.WPicker.show();
                  }}
                >
                  {Taro.T._("choosedate")}
                </Text>
              </AtInput>
            </View>
            <View>
              <AtButton
                type="primary"
                onClick={() => {
                  this.setState({ addPollFloatLayoutOpened: false });
                }}
              >
                {Taro.T._("confirm")}
              </AtButton>
            </View>
          </View>
        </AtFloatLayout>
        <AtFloatLayout
          isOpened={addTagFloatLayoutOpened}
          title={Taro.T._("addtags")}
          onClose={this.handleAddTagsFloatLayoutClose.bind(this)}
        >
          <View>
            <View>
              {tags.length > 0 ? (
                tags.map((tag, ldx) => {
                  return (
                    <AtTag type="primary" circle>
                      {tag}
                    </AtTag>
                  );
                })
              ) : (
                <View>
                  <Text>{Taro.T._("havenottag")}</Text>
                </View>
              )}
            </View>
            <View>
              <View className="find-fromview-input">
                <AtInput
                  name="tag"
                  title={Taro.T._("tag")}
                  type="text"
                  placeholder={Taro.T._("pleaseentertag")}
                  value={tagname}
                  onChange={this.handleTagNameChange.bind(this)}
                />
              </View>
            </View>
            <View className="find-fromview-input">
              <AtButton type="primary" onClick={() => this.handleAddTag()}>
                {Taro.T._("add")}
              </AtButton>
            </View>
            <View className="find-fromview-input">
              <AtButton
                type="primary"
                onClick={() => {
                  this.setState({ addTagFloatLayoutOpened: false });
                }}
              >
                {Taro.T._("addtocomplete")}
              </AtButton>
            </View>
          </View>
        </AtFloatLayout>
        <WPicker
          mode="date"
          startYear="2022"
          endYear="2035"
          value="2022-12-11"
          current={true}
          fields="day"
          confirm={this.onWPickerConfirm.bind(this, "date")}
          cancel={this.onWPickerCancel}
          disabledAfter={false}
          onRef={this.onWPickerRef}
        ></WPicker>
      </View>
    );
  }
}
const mapStateToProps = ({ forumCategory }) => ({
  forumCategory,
});
export default connect(mapStateToProps)(PublishPost);
