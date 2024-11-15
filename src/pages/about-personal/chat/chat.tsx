import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import {
  View,
  Input,
  Button,
  Text,
  ScrollView,
  Image,
} from "@tarojs/components";
import { AtInput, AtToast, AtAvatar } from "taro-ui";
import { startWorkermanChat } from "./../../../api/request";
import "./chat.scss";
import Navbar from "../../../component/navbarTitle/index";
import { connect } from "react-redux";
import CustomSocket from "../../../utils/customSocket";
import { USER } from "../../../utils/constant";
class Chat extends Component {
  current = getCurrentInstance();
  constructor(props) {
    super(props);
  }

  state = {
    message: "",
    to: {},
    toastIsOpened: false,
    toastText: "",
    records: [],
    user: {},
  };
  async componentDidMount() {
    let user = Taro.getStorageSync(USER);
    this.setState({ user });
    console.log("this.current.router.params.customerId");
    console.log(this.current.router.params.customerId);
    let prepareChat = await startWorkermanChat(
      this.current.router.params.customerId
    );
    console.log("prepareChat:");
    console.log(prepareChat);
    if (
      prepareChat.sessionid &&
      prepareChat.sessions &&
      prepareChat.sessions.length > 0
    ) {
      prepareChat.sessions &&
        prepareChat.sessions.map((session) => {
          if (prepareChat.sessionid == session.id) {
            this.setState({ to: session });
          }
        });
      if (prepareChat.records && prepareChat.records.length > 0) {
        this.setState({ records: prepareChat.records });
      }
    }
    let websock = new CustomSocket();
    websock.onSocketMessage(this.onMessage);
    //websock.onSocketOpen(this.onOpen);
    this.websock = websock;
    //this.pingTimeout = setTimeout(this.ping, 60000, this);
  }
  componentDidShow() {}
  componentWillUnmount() {
    this.websock.closeSocket();
  }
  ping = () => {
    this.websock.sendSocketMessage('{"type":"pong"}');
    clearTimeout(this.pingTimeout);
    this.pingTimeout = setTimeout(this.ping, 60000, this);
  };
  handleMessageChange(value) {
    this.setState({
      message: value,
    });
  }
  sendMessage = () => {
    let { message, to, user } = this.state;
    if (message == "") {
      Taro.showToast({
        title: Taro.T._("pleaseentermessage"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    let sendData = {};
    sendData.session = to.id;
    sendData.content = message;
    sendData.contenttype = "text";
    sendData.type = "say";
    sendData.sender = user.id;
    console.log(sendData);
    this.websock.sendSocketMessage(JSON.stringify(sendData));
    this.setState({ message: "" });
  };
  onMessage = (message) => {
    console.log("onMessage:");
    console.log(message);
    let { records, user, to } = this.state;
    //if (message.session == to.id) {
    records.push(message);
    this.setState({ records });
    if (message.type == "connect") {
      this.onOpen();
    }
    //}
  };
  onOpen = () => {
    let { user } = this.state;
    let openString =
      '{"type":"login","to_client_id":"all","content":"welcome ------","uid":"' +
      user.id +
      '","client_name":"' +
      user.username +
      '","group_list":""}';
    console.log("socket opening string:" + openString);
    this.websock.sendSocketMessage(openString);
  };
  render() {
    let { message, to, toastIsOpened, toastText, records, user } = this.state;
    return (
      <ScrollView className="chat">
        <View className="chat-history">
          <Navbar title={to.name} />
          <View>
            {records.map((record) => {
              return (
                <View>
                  {record.sender == user.id ? (
                    <View className="chat-history-self">
                      <AtAvatar
                        size="small"
                        circle
                        image={user.avatar}
                        text={user.username}
                      />
                      <Text className="chat-history-self-msg">
                        {record.content}
                      </Text>
                    </View>
                  ) : (
                    <View className="chat-history-other">
                      <Text className="chat-history-other-msg">
                        {record.content}
                      </Text>
                      <AtAvatar
                        size="small"
                        circle
                        image={to.avatar}
                        text={to.name}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
        <View className="chat-footer">
          <View className="chat-footer-view">
            <AtInput
              name="message"
              type="text"
              placeholder={Taro.T._("pleaseentermessage")}
              value={message}
              onChange={this.handleMessageChange.bind(this)}
              className="chat-footer-view-input"
            >
              <Image
                src={require("./../assets/send.png")}
                className="chat-footer-view-input-image"
                onClick={() => this.sendMessage()}
              />
            </AtInput>
          </View>
        </View>
        <AtToast
          isOpened={toastIsOpened}
          text={toastText}
          icon={"check-circle"}
          onClose={() => {
            this.setState({ toastIsOpened: false });
          }}
        ></AtToast>
      </ScrollView>
    );
  }
}
const mapStateToProps = ({ cart }) => ({
  cart: cart,
});

export default connect(mapStateToProps)(Chat);
