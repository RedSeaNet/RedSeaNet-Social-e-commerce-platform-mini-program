import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, PickerView, PickerViewColumn } from '@tarojs/components'
import './index.scss'
import PropTypes from 'prop-types';

export default class TimePicker extends Component {

    state = {
        pickVal: [],
        range: {},
        checkObj: {},
        values:null
    }
    componentWillMount() {
        this.initData();
    }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.value!==this.state.values){
            // this.initData();
            this.setState({
                values:prevProps.value,
            },()=>{
                this.initData();
            })
        }
    }

    formatNum = (n) => {
        return (Number(n) < 10 ? '0' + Number(n) : Number(n) + '');
    }

    checkValue = (value) => {
        let strReg = /^\d{2}:\d{2}:\d{2}$/, example = "18:00:05";
        if (!strReg.test(value)) {
            console.log(new Error("请传入与mode、fields匹配的value值，例value=" + example + ""))
        }
        return strReg.test(value);
    }

    resetData = (year, month, day, hour, minute) => {
        let curDate = this.getCurrenDate();
        let curFlag = this.props.current;
        let curHour = curDate.curHour;
        let curMinute = curDate.curMinute;
        let curSecond = curDate.curSecond;
        for (let hour = 0; hour < 24; hour++) {
            hours.push(this.formatNum(hour));
        }
        for (let minute = 0; minute < 60; minute++) {
            minutes.push(this.formatNum(minute));
        }
        for (let second = 0; second < 60; second++) {
            seconds.push(this.formatNum(second));
        }
        return {
            hours,
            minutes,
            seconds
        }
    }
    getData = (curDate) => {
        //用来处理初始化数据
        let hours = [], minutes = [], seconds = [];
        let curFlag = this.props.current;
        let disabledAfter = this.props.disabledAfter;
        let fields = this.props.fields;
        let curHour = curDate.curHour;
        let curMinute = curDate.curMinute;
        let curSecond = curDate.curSecond;
        for (let hour = 0; hour < 24; hour++) {
            hours.push(this.formatNum(hour));
        }
        for (let minute = 0; minute < 60; minute++) {
            minutes.push(this.formatNum(minute));
        }
        for (let second = 0; second < 60; second++) {
            seconds.push(this.formatNum(second));
        }
        return this.props.second ? {
            hours,
            minutes,
            seconds
        } : {
                hours,
                minutes
            }
    }

    getCurrenDate = () => {
        let curDate = new Date();
        let curHour = curDate.getHours();
        let curMinute = curDate.getMinutes();
        let curSecond = curDate.getSeconds();
        return this.props.second ? {
            curHour,
            curMinute,
            curSecond
        } : {
                curHour,
                curMinute,
            }
    }

    getDval = () => {
        let value = this.props.value;
        let fields = this.props.fields;
        let dVal = null;
        let aDate = new Date();
        let hour = this.formatNum(aDate.getHours());
        let minute = this.formatNum(aDate.getMinutes());
        let second = this.formatNum(aDate.getSeconds());
        if (value) {
            let flag = this.checkValue(value);
            if (!flag) {
                dVal = [hour, minute, second]
            } else {
                dVal = value ? value.split(":") : [];
            }
        } else {
            dVal = this.props.second ? [hour, minute, second] : [hour, minute]
        }
        return dVal;
    }

    initData=()=>{
        let curDate = this.getCurrenDate();
        let dateData = this.getData(curDate);
        let pickVal = [], obj = {}, full = "", result = "", hour = "", minute = "", second = "";
        let dVal = this.getDval();
        let curFlag = this.props.current;
        let disabledAfter = this.props.disabledAfter;
        let hours = dateData.hours;
        let minutes = dateData.minutes;
        let seconds = dateData.seconds;
        let defaultArr = this.props.second ? [
            dVal[0] && hours.indexOf(dVal[0]) != -1 ? hours.indexOf(dVal[0]) : 0,
            dVal[1] && minutes.indexOf(dVal[1]) != -1 ? minutes.indexOf(dVal[1]) : 0,
            dVal[2] && seconds.indexOf(dVal[2]) != -1 ? seconds.indexOf(dVal[2]) : 0
        ] : [
                dVal[0] && hours.indexOf(dVal[0]) != -1 ? hours.indexOf(dVal[0]) : 0,
                dVal[1] && minutes.indexOf(dVal[1]) != -1 ? minutes.indexOf(dVal[1]) : 0
            ];
        pickVal = disabledAfter ? defaultArr : (curFlag ? (this.props.second ? [
            hours.indexOf(this.formatNum(curDate.curHour)),
            minutes.indexOf(this.formatNum(curDate.curMinute)),
            seconds.indexOf(this.formatNum(curDate.curSecond)),
        ] : [
                hours.indexOf(this.formatNum(curDate.curHour)),
                minutes.indexOf(this.formatNum(curDate.curMinute))
            ]) : defaultArr);
        this.setState({
            range:dateData,
            checkObj:obj   
        })
        hour = dVal[0] ? dVal[0] : hours[0];
        minute = dVal[1] ? dVal[1] : minutes[0];
        if (this.props.second) second = dVal[2] ? dVal[0] : seconds[0];
        result = this.props.second ? `${hour + ':' + minute + ':' + second}` : `${hour + ':' + minute}`;
        full = this.props.second ? `${hour + ':' + minute + ':' + second}` : `${hour + ':' + minute + ':00'}`;
        Taro.nextTick(() => {
            this.setState({
                pickVal   
            })
        });
        // EventChannel.$emit("change", {
        //     result: result,
        //     value: full,
        //     obj: obj
        // })
        this.props.change({
            result: result,
            value: full,
            obj: obj
        })
    }

    handlerChange=(e)=>{
        let arr=[...e.detail.value];
        let data=this.state.range;
        let hour="",minute="",second="",result="",full="",obj={};
        hour=(arr[0]||arr[0]==0)?data.hours[arr[0]]||data.hours[data.hours.length-1]:"";
        minute=(arr[1]||arr[1]==0)?data.minutes[arr[1]]||data.minutes[data.minutes.length-1]:"";
        if(this.props.second)second=(arr[2]||arr[2]==0)?data.seconds[arr[2]]||data.seconds[data.seconds.length-1]:"";
        obj=this.props.second?{
            hour,
            minute,
            second
        }:{
            hour,
            minute
        };
        this.setState({
            checkObj: obj,
            pickVal:e.detail.value
        })
        result=this.props.second?`${hour+':'+minute+':'+second}`:`${hour+':'+minute}`;
        full=this.props.second?`${hour+':'+minute+':'+second}`:`${hour+':'+minute+':00'}`;
        this.props.change({
            result: result,
            value: full,
            obj: obj
        })
    }

    render() {
        const { pickVal, range } = this.state
        return (
            <View className='w-picker-view'>
                <PickerView className="d-picker-view" indicatorStyle={this.props.itemHeight} value={pickVal} onChange={this.handlerChange}>
                    <PickerViewColumn>
                        {
                            range.hours.map((item, index) => {
                                return (<View className="w-picker-item" key={index}>{item}时</View>)
                            })
                        }
                    </PickerViewColumn>
                    <PickerViewColumn>
                        {
                            range.minutes.map((item, index) => {
                                return (<View className="w-picker-item" key={index}>{item}分</View>)
                            })
                        }
                    </PickerViewColumn>
                    {
                        this.props.second?(<PickerViewColumn>
                            {
                                range.seconds.map((item, index) => {
                                    return (<View className="w-picker-item" key={index}>{item}秒</View>)
                                })
                            }
                        </PickerViewColumn>):null
                    }
                </PickerView>
            </View>
        )
    }
}
TimePicker.propTypes = {
    itemHeight: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array
    ]),
    current: PropTypes.bool,
    second: PropTypes.bool
}
TimePicker.defaultProps = {
    itemHeight: "44px",
    value: "",
    current: false,
    second: true
};
