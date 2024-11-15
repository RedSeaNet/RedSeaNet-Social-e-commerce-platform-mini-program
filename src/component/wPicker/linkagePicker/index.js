import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Text,PickerView,PickerViewColumn} from '@tarojs/components'
import './index.scss'
import PropTypes from 'prop-types';
export default class LinkagePicker extends Component {

    state = {
        pickVal: [],
        range: [],
        checkObj: {},
        value2: null,
        options2: null
    }

    componentWillMount() {
        if (this.props.options.length != 0) {
            this.initData();
        }
    }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.value != this.state.value2) {
            this.setState({
                value2: prevProps.value,
            }, () => {
                if (this.props.options.length != 0) {
                    this.initData();
                }
            })
        }
        if (prevProps.options != this.state.options2) {
            this.setState({
                options2: prevProps.options,
            }, () => {
                this.initData();
            })
        }
    }


    nodeKey = () => {
        return this.props.defaultProps.label;
    }

    nodeVal = () => {
        return this.props.defaultProps.value;
    }

    nodeChild = () => {
        return this.props.defaultProps.children;
    }

    getData = () => {
        //用来处理初始化数据
        let options = this.props.options;
        let col1 = {}, col2 = {}, col3 = {}, col4 = {};
        let arr1 = options, arr2 = [], arr3 = [], arr4 = [];
        let col1Index = 0, col2Index = 0, col3Index = 0, col4Index = 0;
        let a1 = "", a2 = "", a3 = "", a4 = "";
        let dVal = [], obj = {};
        let value = this.props.value;
        let data = [];
        a1 = value[0];
        a2 = value[1];
        if (this.props.level > 2) {
            a3 = value[2];
        }
        if (this.props.level > 3) {
            a4 = value[3];
        };
        /*第1列*/
        col1Index = arr1.findIndex((v) => {
            return v[this.props.defaultType] == a1
        });
        col1Index = value ? (col1Index != -1 ? col1Index : 0) : 0;
        col1 = arr1[col1Index];

        /*第2列*/
        arr2 = arr1[col1Index][this.nodeChild()];
        col2Index = arr2.findIndex((v) => {
            return v[this.props.defaultType] == a2
        });
        col2Index = value ? (col2Index != -1 ? col2Index : 0) : 0;
        col2 = arr2[col2Index];

        /*第3列*/
        if (this.props.level > 2) {
            arr3 = arr2[col2Index][this.nodeChild()];
            col3Index = arr3.findIndex((v) => {
                return v[this.props.defaultType] == a3;
            });
            col3Index = value ? (col3Index != -1 ? col3Index : 0) : 0;
            col3 = arr3[col3Index];
        };


        /*第4列*/
        if (this.props.level > 3) {
            arr4 = arr3[col4Index][this.nodeChild()];
            col4Index = arr4.findIndex((v) => {
                return v[this.props.defaultType] == a4;
            });
            col4Index = value ? (col4Index != -1 ? col4Index : 0) : 0;
            col4 = arr4[col4Index];
        };
        switch (this.props.level * 1) {
            case 2:
                dVal = [col1Index, col2Index];
                obj = {
                    col1,
                    col2
                }
                data = [arr1, arr2];
                break;
            case 3:
                dVal = [col1Index, col2Index, col3Index];
                obj = {
                    col1,
                    col2,
                    col3
                }
                data = [arr1, arr2, arr3];
                break;
            case 4:
                dVal = [col1Index, col2Index, col3Index, col4Index];
                obj = {
                    col1,
                    col2,
                    col3,
                    col4
                }
                data = [arr1, arr2, arr3, arr4];
                break
        }
        return {
            data,
            dVal,
            obj
        }
    }

    initData = () => {
        let dataData = this.getData();
        let data = dataData.data;
        let arr1 = data[0];
        let arr2 = data[1];
        let arr3 = data[2] || [];
        let arr4 = data[3] || [];
        let obj = dataData.obj;
        let col1 = obj.col1, col2 = obj.col2, col3 = obj.col3 || {}, col4 = obj.col4 || {};
        let result = "", value = [];
        let range = [];
        switch (this.props.level) {
            case 2:
                value = [col1[this.nodeVal()], col2[this.nodeVal()]];
                result = `${col1[this.nodeKey()] + col2[this.nodeKey()]}`;
                range = [arr1, arr2];
                break;
            case 3:
                value = [col1[this.nodeVal()], col2[this.nodeVal()], col3[this.nodeVal()]];
                result = `${col1[this.nodeKey()] + col2[this.nodeKey()] + col3[this.nodeKey()]}`;
                range = [arr1, arr2, arr3];
                break;
            case 4:
                value = [col1[this.nodeVal()], col2[this.nodeVal()], col3[this.nodeVal()], col4[this.nodeVal()]];
                result = `${col1[this.nodeKey()] + col2[this.nodeKey()] + col3[this.nodeKey()] + col4[this.nodeKey()]}`;
                range = [arr1, arr2, arr3, arr4];
                break;
        }
        this.setState({
            range,
            checkObj: obj
        })
        Taro.nextTick(() => {
            this.setState({
                pickVal: dataData.dVal
            })
        });
        this.props.change({
            result: result,
            value: value,
            obj: obj
        })
    }

    handlerChange = (e) => {
        let arr = [...e.detail.value];
        let col1Index = arr[0], col2Index = arr[1], col3Index = arr[2] || 0, col4Index = arr[3] || 0;
        let arr1 = [], arr2 = [], arr3 = [], arr4 = [];
        let col1, col2, col3, col4, obj = {};
        let result = "", value = [];
        arr1 = this.props.options;
        arr2 = (arr1[col1Index] && arr1[col1Index][this.nodeChild()]) || arr1[arr1.length - 1][this.nodeChild()] || [];
        col1 = arr1[col1Index] || arr1[arr1.length - 1] || {};
        col2 = arr2[col2Index] || arr2[arr2.length - 1] || {};
        if (this.props.level > 2) {
            arr3 = (arr2[col2Index] && arr2[col2Index][this.nodeChild()]) || arr2[arr2.length - 1][this.nodeChild()];
            col3 = arr3[col3Index] || arr3[arr3.length - 1] || {};
        }
        if (this.props.level > 3) {
            arr4 = (arr3[col3Index] && arr3[col3Index][this.nodeChild()]) || arr3[arr3.length - 1][this.nodeChild()] || [];
            col4 = arr4[col4Index] || arr4[arr4.length - 1] || {};
        }
        switch (this.props.level) {
            case 2:
                obj = {
                    col1,
                    col2
                }
                this.setState({
                    range: [arr1, arr2]
                })
                result = `${(col1[this.nodeKey()] || '') + (col2[this.nodeKey()] || '')}`;
                value = [col1[this.nodeVal()] || '', col2[this.nodeVal()] || ''];
                break;
            case 3:
                obj = {
                    col1,
                    col2,
                    col3
                }
                this.setState({
                    range: [arr1, arr2, arr3]
                })
                result = `${(col1[this.nodeKey()] || '') + (col2[this.nodeKey()] || '') + (col3[this.nodeKey()] || '')}`;
                value = [col1[this.nodeVal()] || '', col2[this.nodeVal()] || '', col3[this.nodeVal()] || ''];
                break;
            case 4:
                obj = {
                    col1,
                    col2,
                    col3,
                    col4
                }
                this.setState({
                    range: [arr1, arr2, arr3, arr4],
                })
                result = `${(col1[this.nodeKey()] || '') + (col2[this.nodeKey()] || '') + (col3[this.nodeKey()] || '') + (col4[this.nodeKey()] || '')}`;
                value = [col1[this.nodeVal()] || '', col2[this.nodeVal()] || '', col3[this.nodeVal()] || '', col4[this.nodeVal()] || ''];
                break;
        }
        this.setState({
            pickVal: arr,
            checkObj: obj
        })
        this.props.change({
            result: result,
            value: value,
            obj: obj
        })
    }

    render() {
        const { pickVal,range } = this.state
        return (
            <View className='w-picker-view'>
                <PickerView className="d-picker-view" indicatorStyle={this.props.itemHeight} value={pickVal} onChange={this.handlerChange}>

                    {
                        range.map((group, gIndex) => {
                            return (<PickerViewColumn key={gIndex}>
                                {
                                    group.map((item, index) => {
                                        return (<View className="w-picker-item" key={index}>{item[this.nodeKey()]}</View>)
                                    })
                                }

                            </PickerViewColumn>)
                        })
                    }

                </PickerView>
            </View>

        )
    }
}

LinkagePicker.PropTypes = {
    itemHeight: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    defaultType: PropTypes.string,
    options: PropTypes.array,
    defaultProps: PropTypes.object,
    level: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
}
LinkagePicker.defaultProps = {
    itemHeight: "44px",
    value: "",
    defaultType: "label",
    options: [],
    defaultProps: {
        lable: "label",
        value: "value",
        children: "children"
    },
    level: 2
}