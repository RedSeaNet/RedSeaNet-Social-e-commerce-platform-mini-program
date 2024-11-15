import Taro, { Config} from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import './index.scss'
import TaroCropper from './cropper';
import { Component } from "react";
interface IndexProps {

}
interface IndexState {
  src: string,
  cutImagePath: string,
}

export default class Index extends Component<IndexProps, IndexState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页',
  };

  constructor(props) {
    super(props);
    this.catTaroCropper = this.catTaroCropper.bind(this);
    this.state = {
      src: '',
      cutImagePath: '',
    }
  }

  taroCropper: TaroCropper;

  catTaroCropper(node: TaroCropper) {
    this.taroCropper = node;
  }

  async imgToBase64(url) {
    let res = "";
    try {
      // 获取图片信息(本地图片链接)
      const successCallback = await Taro.getImageInfo({
        src: url
      });
      const { path, type } = successCallback;
      if (!path) {
        return res;
      }
      // 本地图片转Base64
      const base64 = await Taro.getFileSystemManager().readFileSync(path, "base64");
      res = `data:image/${type};base64,${base64}`;
      return res;
    } catch (error) {
      console.warn("=> utilssearch.ts error imgToBase64", error);
      throw error;
    } finally {
      return res;
    }
  }

  render() {
    const {
      src,
      cutImagePath
    } = this.state;
    return (
      <View className='index'>
        <TaroCropper
          height={1000} 
          src={src}
          cropperWidth={400}
          cropperHeight={400}
          ref={this.catTaroCropper}
          // themeColor={'#f00'}
          // hideFinishText
          onCut={res => {
            this.setState({
              cutImagePath: res
            });
            this.taroCropper && this.taroCropper.cut()
            .then(res => {
              this.setState({
                cutImagePath: res.filePath
              });

              // let base64 =
              // "data:image/png;base64,";
              //   Taro.request({
              //     url: res.filePath,
              //     responseType: "arraybuffer",
              //     success: async (res) => {
              //        base64 = base64+Taro.arrayBufferToBase64(new Uint8Array(res.data));
              //        this.props.handleCropper(base64);
              //     },
              //   });
              this.imgToBase64(res.filePath).then(base64=>{
                this.props.handleCropper(base64);
              });
            })
            .catch(err => {
              console.log(err);
            });
          }}
          hideCancelText={false}
          onCancel={() => {
            Taro.showToast({
              icon: 'none',
              title: '点击取消'
            });
          this.props.handleCancel()
          }}
        />
        <View>
        <Button onClick={() => {
          Taro.chooseImage({
            count: 1
          })
            .then(res => {
              // console.log(res);
              this.setState({
                src: res.tempFilePaths[0]
              });
            })
        }}>选择图片</Button>
        <Button onClick={() => {
          this.taroCropper && this.taroCropper.cut()
            .then(res => {
              this.setState({
                cutImagePath: res.filePath
              });
              // let base64 =
              // "data:image/png;base64,";
                // Taro.request({
                //   url: res.filePath,
                //   responseType: "arraybuffer",
                //   success: async (res) => {
                //      base64 = base64+Taro.arrayBufferToBase64(new Uint8Array(res.data));
                //      this.props.handleCropper(base64);
                //   },
                // });
              this.imgToBase64(res.filePath).then(base64=>{
                this.props.handleCropper(base64);
              });
            })
            .catch(err => {
              console.log(err);
            });
        }}>
          裁剪
        </Button>
        </View>
      </View>
    )
  }
}
