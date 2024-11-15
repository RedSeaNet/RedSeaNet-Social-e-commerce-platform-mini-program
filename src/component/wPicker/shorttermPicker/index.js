import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, PickerView, PickerViewColumn } from '@tarojs/components'
import './index.scss'
import PropTypes from 'prop-types';

export default class ShorttermPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pickVal: [],
            range: {},
            checkObj: {},
            values: null
        }
    }
    componentWillMount() {
        this.initData();
    }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.value !== this.state.values) {
            // this.initData();
            this.setState({
                values: prevProps.value,
            }, () => {
                this.initData();
            })
        }
    }

    formatNum = (n) => {
        return (Number(n) < 10 ? '0' + Number(n) : Number(n) + '');
    }

    checkValue = (value) => {
        let strReg = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/, example = "2019-12-12 18:05:00或者2019-12-12 18:05";
        if (!strReg.test(value)) {
            console.log(new Error("请传入与mode、fields匹配的value值，例value=" + example + ""))
        }
        return strReg.test(value);
    }

    resetData = (year, month, day) => {
        let curDate = this.getCurrenDate();
        let curFlag = this.props.current;
        let curYear = curDate.curYear;
        let curMonth = curDate.curMonth;
        let curDay = curDate.curDay;
        let curHour = curDate.curHour;
        let months = [], days = [], sections = [];
        let disabledAfter = this.props.disabledAfter;
        let monthsLen = disabledAfter ? (year * 1 < curYear ? 12 : curMonth) : 12;
        let totalDays = new Date(year, month, 0).getDate();//计算当月有几天;
        for (let month = 1; month <= monthsLen; month++) {
            months.push(this.formatNum(month));
        };
        for (let day = 1; day <= daysLen; day++) {
            days.push(this.formatNum(day));
        }
        return {
            months,
            days,
            sections
        }
    }

    getData = (dVal) => {
        //用来处理初始化数据
        let curFlag = this.props.current;
        let disabledAfter = this.props.disabledAfter;
        let dates = [], hours = [], minutes = [];
        let curDate = new Date();
        let curYear = curDate.getFullYear();
        let curMonth = curDate.getMonth();
        let curDay = curDate.getDate();
        let aDate = new Date(curYear, curMonth, curDay);
        for (let i = 0; i < this.props.expand * 1; i++) {
            aDate = new Date(curYear, curMonth, curDay + i);
            let year = aDate.getFullYear();
            let month = aDate.getMonth() + 1;
            let day = aDate.getDate();
            let label = year + "-" + this.formatNum(month) + "-" + this.formatNum(day);
            switch (i) {
                case 0:
                    label = "今天";
                    break;
                case 1:
                    label = "明天";
                    break;
                case 2:
                    label = "后天";
                    break
            }
            dates.push({
                label: label,
                value: year + "-" + this.formatNum(month) + "-" + this.formatNum(day)
            })
        };
        for (let i = 0; i < 24; i++) {
            hours.push({
                label: this.formatNum(i),
                value: this.formatNum(i)
            })
        }
        for (let i = 0; i < 60; i++) {
            minutes.push({
                label: this.formatNum(i),
                value: this.formatNum(i)
            })
        }
        return {
            dates,
            hours,
            minutes
        }
    }

    getDefaultDate = () => {
        let value = this.props.value;
        let reg = /-/g;
        let defaultDate = value ? new Date(value.replace(reg, "/")) : new Date();
        let defaultYear = defaultDate.getFullYear();
        let defaultMonth = defaultDate.getMonth() + 1;
        let defaultDay = defaultDate.getDate();
        let defaultDays = new Date(defaultYear, defaultMonth, 0).getDate() * 1;
        return {
            defaultDate,
            defaultYear,
            defaultMonth,
            defaultDay,
            defaultDays
        }
    }

    getDval = () => {
        let value = this.props.value;
        let dVal = null;
        let aDate = new Date();
        let year = this.formatNum(aDate.getFullYear());
        let month = this.formatNum(aDate.getMonth() + 1);
        let day = this.formatNum(aDate.getDate());
        let date = this.formatNum(year) + "-" + this.formatNum(month) + "-" + this.formatNum(day);
        let hour = aDate.getHours();
        let minute = aDate.getMinutes();
        if (value) {
            let flag = this.checkValue(value);
            if (!flag) {
                dVal = [date, hour, minute]
            } else {
                let v = value.split(" ");
                dVal = [v[0], ...v[1].split(":")];
            }
        } else {
            dVal = [date, hour, minute]
        }
        return dVal;
    }

    initData() {
        let startDate, endDate, startYear, endYear, startMonth, endMonth, startDay, endDay;
        let dates = [], hours = [], minutes = [];
        let dVal = [], pickVal = [];
        let value = this.props.value;
        let reg = /-/g;
        let range = {};
        let result = "", full = "", date, hour, minute, obj = {};
        let defaultDate = this.getDefaultDate();
        let defaultYear = defaultDate.defaultYear;
        let defaultMonth = defaultDate.defaultMonth;
        let defaultDay = defaultDate.defaultDay;
        let defaultDays = defaultDate.defaultDays;
        let curFlag = this.props.current;
        let disabledAfter = this.props.disabledAfter;
        let dateData = [];
        dVal = this.getDval();
        console.log(dVal)
        dateData = this.getData(dVal);
        console.log(dateData)
        dates = dateData.dates;
        hours = dateData.hours;
        minutes = dateData.minutes;
        pickVal = [
            dates.findIndex(n => n.value == dVal[0]) != -1 ? dates.findIndex(n => n.value == dVal[0]) : 0,
            hours.findIndex(n => n.value == dVal[1]) != -1 ? hours.findIndex(n => n.value == dVal[1]) : 0,
            minutes.findIndex(n => n.value == dVal[2]) != -1 ? minutes.findIndex(n => n.value == dVal[2]) : 0,
        ];
        range = { dates, hours, minutes };
        console.log(range)
        date = dVal[0] ? dVal[0] : dates[0].label;
        hour = dVal[1] ? dVal[1] : hours[0].label;
        minute = dVal[2] ? dVal[2] : minutes[0].label;
        result = full = `${date + ' ' + hour + ':' + minute}`;
        obj = {
            date,
            hour,
            minute
        }
        this.setState({
            range: range,
            checkObj: obj
        })
        Taro.nextTick(() => {
            this.setState({
                pickVal
            })
        });
        this.props.change({
            result: result,
            value: full,
            obj: obj
        })
    }

    handlerChange = (e) => {
        let arr = [...e.detail.value];
        let data = this.state.range;
        let date = "", hour = "", minute = "";
        let result = "", full = "", obj = {};
        let disabledAfter = this.props.disabledAfter;
        date = (arr[0] || arr[0] == 0) ? data.dates[arr[0]] || data.dates[data.dates.length - 1] : "";
        hour = (arr[1] || arr[1] == 0) ? data.hours[arr[1]] || data.hours[data.hours.length - 1] : "";
        minute = (arr[2] || arr[2] == 0) ? data.minutes[arr[2]] || data.minutes[data.minutes.length - 1] : "";
        result = full = `${date.label + ' ' + hour.label + ':' + minute.label + ':00'}`;
        obj = {
            date,
            hour,
            minute
        }
        this.setState({
            checkObj: obj,
            pickVal: e.detail.value
        })
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
                            range.dates.map((item, index) => {
                                return (<View className="w-picker-item" key={index}>{item.label}</View>)
                            })
                        }
                    </PickerViewColumn>
                    <PickerViewColumn>
                        {
                            range.hours.map((item, index) => {
                                return (<View className="w-picker-item" key={index}>{item.label}时</View>)
                            })
                        }
                    </PickerViewColumn>
                    <PickerViewColumn>
                        {
                            range.minutes.map((item, index) => {
                                return (<View className="w-picker-item" key={index}>{item.label}分</View>)
                            })
                        }
                    </PickerViewColumn>
                </PickerView>
            </View>
        )
    }
}
ShorttermPicker.propTypes = {
    itemHeight: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array
    ]),
    current: PropTypes.bool,
    expand: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
}
ShorttermPicker.defaultProps = {
    itemHeight: "44px",
    value: "",
    current: false,
    expand: 30
};
