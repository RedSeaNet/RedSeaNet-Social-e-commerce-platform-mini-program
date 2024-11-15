import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, PickerView, PickerViewColumn } from '@tarojs/components'
import './index.scss'
import PropTypes from 'prop-types';

export default class SelectorPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickVal: [],
            value2: null,
            options2: null,
        }
    }
    
    componentWillMount() {
        if (this.props.options.length != 0) {
            this.initData();
        }
    }

    componentDidMount() {
    }

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
    nodeValue = () => {
        return this.props.defaultProps.value;
    }
    range = () => {
        return this.props.options
    }

    initData=()=>{
        let dVal=this.props.value||"";
        let data=this.range();
        let pickVal=[0];
        let cur=null;
        let label="";
        let value,idx;
        if(this.props.defaultType==this.nodeValue()){
            value=data.find((v)=>v[this.nodeValue()]==dVal);
            idx=data.findIndex((v)=>v[this.nodeValue()]==dVal);
        }else{
            value=data.find((v)=>v[this.nodeKey()]==dVal);
            idx=data.findIndex((v)=>v[this.nodeKey()]==dVal);
        }
        pickVal=[idx!=-1?idx:0];
        Taro.nextTick(() => {
            this.setState({
                pickVal   
            })
        });
        if(this.props.defaultType==this.nodeValue()){
            this.props.change({
                result:value?value[this.nodeKey()]:data[0][this.nodeKey()],
                value:dVal||data[0][this.nodeKey()],
                obj:value?value:data[0]
            })
        }else{
            this.props.change({
                result:dVal||data[0][this.nodeKey()],
                value:value?value[this.nodeValue()]:data[0][this.nodeValue()],
                obj:value?value:data[0]
            })
        }
        
    }
    handlerChange=(e)=>{
        let arr=[...e.detail.value];
        let pickVal=[arr[0]||0];
        let data=this.range();
        let cur=data[arr[0]];
        let label="";
        let value="";
        this.setState({
            pickVal   
        })
        Taro.nextTick(() => {
            this.setState({
                pickVal   
            })
        });
        this.props.change({
            result:cur['name'],
            value:cur['id'],
            obj:cur
        })
    }

    render() {
        const { pickVal }=this.state
        return (
            <View className='w-picker-view'>
                <PickerView className="d-picker-view" indicatorStyle={this.props.itemHeight} value={pickVal} onChange={this.handlerChange}>
                    <PickerViewColumn>
                        {
                            this.range().map((item, index) => {
                                return (<View className="w-picker-item" key={index}>{item[this.nodeKey()]}</View>)
                            })
                        }
                    </PickerViewColumn>
                </PickerView>
            </View>

        )
    }
}

SelectorPicker.propTypes = {
    itemHeight: PropTypes.string,
    options: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    value: PropTypes.string,
    defaultType: PropTypes.string,
    defaultProps: PropTypes.object
}
SelectorPicker.defaultProps = {
    itemHeight: "44px",
    options: [],
    value: "",
    defaultType: "label",
    defaultProps: {
        label: "label",
        value: "value"
    }
};

