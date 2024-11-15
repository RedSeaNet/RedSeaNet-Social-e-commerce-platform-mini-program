import Taro from "@tarojs/taro";

class CustomSocket {
  public socketOpen: boolean = false;
  public socketMsgQueue: string[] = [];
  private lockReConnect: boolean = false;
  private timer: any = null;
  private limit: number = 0;

  constructor() {
    this.connectSocket();
    console.log("init customSocket");
  }
  connectSocket() {
    const _this = this;
    console.log("start connectSocket");
    Taro.connectSocket({
      url: `wss://store.redseanet.com:7272`,
      success: (response: any) => {
        console.log("connectSocket success:", response);
        _this.initSocketEvent();
      },
      fail: (e: any) => {
        console.log("connectSocket fail:", e);
      },
    });
  }

  initSocketEvent() {
    const _this = this;
    Taro.onSocketOpen(() => {
      console.log("onSocketOpen");
      _this.socketOpen = true;
      for (const item of _this.socketMsgQueue) {
        _this.sendSocketMessage(item);
      }
      _this.socketMsgQueue = [];
    });
    Taro.onSocketError((e: any) => {
      console.log("WebSocket error", e);
    });
    Taro.onSocketClose(() => {
      console.log("WebSocket close！");
      _this.reconnectSocket();
    });
    // Taro.onSocketMessage((response: any) => {
    //   console.log("onSocketMessage response:", response);
    //   const message: any = JSON.parse(response.data);
    //   if (message.type === "chat") {
    //     console.log("type chat-----");
    //   }
    //   console.log("onSocketMessage:", message);
    // });
  }

  reconnectSocket() {
    const _this = this;
    console.log("reconnectSocket:-------");
    if (_this.lockReConnect) {
      return;
    }
    _this.lockReConnect = true;
    clearTimeout(_this.timer);
    if (_this.limit < 10) {
      _this.timer = setTimeout(() => {
        _this.connectSocket();
        _this.lockReConnect = false;
      }, 5000);
      _this.limit = _this.limit + 1;
    }
  }

  public sendSocketMessage(
    messgage: string,
    errorCallback: (any) => void = () => {}
  ) {
    const _this = this;
    console.log("-------sendSocketMessage-------");
    if (_this.socketOpen) {
      Taro.sendSocketMessage({
        data: messgage,
        success: () => {
          console.log("sendSocketMessage succ", messgage);
        },
        fail: (e: any) => {
          console.log("sendSocketMessage fail", e);
          errorCallback && errorCallback(true);
        },
      });
    } else {
      _this.socketMsgQueue = [];
    }
  }

  public onSocketMessage(callback: (string) => void) {
    Taro.onSocketMessage((response: any) => {
      console.log("onSocketMessage response:", response);
      const message: any = JSON.parse(response.data);
      callback(message);
      console.log("onSocketMessage:", message);
    });
  }

  public closeSocket() {
    if (this.socketOpen) {
      Taro.closeSocket();
    }
  }
  public onSocketOpen(callback: (string) => void) {
    console.log("------socket opening----");
    Taro.onSocketOpen(callback);
  }
  // public ping() {
  //   const _this = this;
  //   _this.sendSocketMessage('{"type":"pong"}');
  //   clearTimeout(_this.pingTimeout);
  //   _this.pingTimeout = setTimeout(_this.ping, 60000, _this);
  // }
}

export default CustomSocket;
