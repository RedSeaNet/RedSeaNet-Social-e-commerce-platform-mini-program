import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Text,PickerView,PickerViewColumn } from '@tarojs/components'
import './index.scss'
import PropTypes from 'prop-types';
export default class HalfPicker extends Component {

    
    constructor(props) {
        super(props);
        this.state = {
            pickVal: [],
            range: {},
            checkObj: {},
            values:this.props.value
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
        let strReg = /^\d{4}-\d{2}-\d{2} [\u4e00-\u9fa5]{2}$/, example;
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
        let daysLen = disabledAfter ? ((year * 1 < curYear || month * 1 < curMonth) ? totalDays : curDay) : totalDays;
        let sectionFlag = disabledAfter ? ((year * 1 < curYear || month * 1 < curMonth || day * 1 < curDay) == true ? false : true) : (curHour > 12 == true ? true : false);
        sections = ["上午", "下午"];
        for (let month = 1; month <= monthsLen; month++) {
            months.push(this.formatNum(month));
        };
        for (let day = 1; day <= daysLen; day++) {
            days.push(this.formatNum(day));
        }
        if (sectionFlag) {
            sections = ["上午"];
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
        let curDate = this.getCurrenDate();
        let curYear = curDate.curYear;
        let curMonthdays = curDate.curMonthdays;
        let curMonth = curDate.curMonth;
        let curDay = curDate.curDay;
        let curHour = curDate.curHour;
        let defaultDate = this.getDefaultDate();
        let startYear = this.getStartDate().getFullYear();
        let endYear = this.getEndDate().getFullYear();
        let years = [], months = [], days = [], sections = [];
        let year = dVal[0] * 1;
        let month = dVal[1] * 1;
        let day = dVal[2] * 1;
        let monthsLen = disabledAfter ? (year < curYear ? 12 : curDate.curMonth) : 12;
        let daysLen = disabledAfter ? ((year < curYear || month < curMonth) ? defaultDate.defaultDays : curDay) : (curFlag ? curMonthdays : defaultDate.defaultDays);
        let sectionFlag = disabledAfter ? ((year * 1 < curYear || month * 1 < curMonth || day * 1 < curDay) == true ? false : true) : (curHour > 12 == true ? true : false);
        for (let year = startYear; year <= (disabledAfter ? curYear : endYear); year++) {
            years.push(year.toString())
        }
        for (let month = 1; month <= monthsLen; month++) {
            months.push(this.formatNum(month));
        }
        for (let day = 1; day <= daysLen; day++) {
            days.push(this.formatNum(day));
        }
        if (sectionFlag) {
            sections = ["下午"];
        } else {
            sections = ["上午", "下午"];
        }
        return {
            years,
            months,
            days,
            sections
        }
    }

    getCurrenDate = () => {
        let curDate = new Date();
        let curYear = curDate.getFullYear();
        let curMonth = curDate.getMonth() + 1;
        let curMonthdays = new Date(curYear, curMonth, 0).getDate();
        let curDay = curDate.getDate();
        let curHour = curDate.getHours();
        let curSection = "上午";
        if (curHour >= 12) {
            curSection = "下午";
        }
        return {
            curDate,
            curYear,
            curMonth,
            curMonthdays,
            curDay,
            curHour,
            curSection
        }
    }

    getDefaultDate = () => {
        let value = this.props.value;
        let reg = /-/g;
        let defaultDate = value ? new Date(value.split(" ")[0].replace(reg, "/")) : new Date();
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

    getStartDate = () => {
        let start = this.props.startYear;
        let startDate = "";
        let reg = /-/g;
        if (start) {
            startDate = new Date(start + "/01/01");
        } else {
            startDate = new Date("1970/01/01");
        }
        return startDate;
    }

    getEndDate = () => {
        let end = this.props.endYear;
        let reg = /-/g;
        let endDate = "";
        if (end) {
            endDate = new Date(end + "/12/31");
        } else {
            endDate = new Date();
        }
        return endDate;
    }

    getDval = () => {
        let value = this.props.value;
        let dVal = null;
        let aDate = new Date();
        let year = this.formatNum(aDate.getFullYear());
        let month = this.formatNum(aDate.getMonth() + 1);
        let day = this.formatNum(aDate.getDate());
        let hour = aDate.getHours();
        let section = "上午";
        if (hour >= 12) section = "下午";
        if (value) {
            let flag = this.checkValue(value);
            if (!flag) {
                dVal = [year, month, day, section]
            } else {
                let v = value.split(" ");
                dVal = [...v[0].split("-"), v[1]];
            }
        } else {
            dVal = [year, month, day, section]
        }
        return dVal;
    }

    initData = () => {
        let startDate, endDate, startYear, endYear, startMonth, endMonth, startDay, endDay;
        let years = [], months = [], days = [], sections = [];
        let dVal = [], pickVal = [];
        let value = this.props.value;
        let reg = /-/g;
        let range = {};
        let result = "", full = "", year, month, day, section, obj = {};
        let defaultDate = this.getDefaultDate();
        let defaultYear = defaultDate.defaultYear;
        let defaultMonth = defaultDate.defaultMonth;
        let defaultDay = defaultDate.defaultDay;
        let defaultDays = defaultDate.defaultDays;
        let curFlag = this.props.current;
        let disabledAfter = this.props.disabledAfter;
        let curDate = this.getCurrenDate();
        let curYear = curDate.curYear;
        let curMonth = curDate.curMonth;
        let curMonthdays = curDate.curMonthdays;
        let curDay = curDate.curDay;
        let curSection = curDate.curSection;
        let dateData = [];
        dVal = this.getDval();
        startDate = this.getStartDate();
        endDate = this.getEndDate();
        startYear = startDate.getFullYear();
        startMonth = startDate.getMonth();
        startDay = startDate.getDate();
        endYear = endDate.getFullYear();
        endMonth = endDate.getMonth();
        endDay = endDate.getDate();
        dateData = this.getData(dVal);
        years = dateData.years;
        months = dateData.months;
        days = dateData.days;
        sections = dateData.sections;
        pickVal = disabledAfter ? [
            dVal[0] && years.indexOf(dVal[0]) != -1 ? years.indexOf(dVal[0]) : 0,
            dVal[1] && months.indexOf(dVal[1]) != -1 ? months.indexOf(dVal[1]) : 0,
            dVal[2] && days.indexOf(dVal[2]) != -1 ? days.indexOf(dVal[2]) : 0,
            dVal[3] && sections.indexOf(dVal[3]) != -1 ? sections.indexOf(dVal[3]) : 0
        ] : (curFlag ? [
            years.indexOf(curYear + ''),
            months.indexOf(this.formatNum(curMonth)),
            days.indexOf(this.formatNum(curDay)),
            sections.indexOf(curSection),
        ] : [
                dVal[0] && years.indexOf(dVal[0]) != -1 ? years.indexOf(dVal[0]) : 0,
                dVal[1] && months.indexOf(dVal[1]) != -1 ? months.indexOf(dVal[1]) : 0,
                dVal[2] && days.indexOf(dVal[2]) != -1 ? days.indexOf(dVal[2]) : 0,
                dVal[3] && sections.indexOf(dVal[3]) != -1 ? sections.indexOf(dVal[3]) : 0
            ]);
        range = { years, months, days, sections };
        year = dVal[0] ? dVal[0] : years[0];
        month = dVal[1] ? dVal[1] : months[0];
        day = dVal[2] ? dVal[2] : days[0];
        section = dVal[3] ? dVal[3] : sections[0];
        result = full = `${year + '-' + month + '-' + day + ' ' + section}`;
        obj = {
            year,
            month,
            day,
            section
        }
        this.setState({
            range,
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
        let year = "", month = "", day = "", section = "";
        let result = "", full = "", obj = {};
        let months = null, days = null, sections = null;
        let disabledAfter = this.props.disabledAfter;
        let range = Object.assign({}, this.state.range);
        year = (arr[0] || arr[0] == 0) ? data.years[arr[0]] || data.years[data.years.length - 1] : "";
        month = (arr[1] || arr[1] == 0) ? data.months[arr[1]] || data.months[data.months.length - 1] : "";
        day = (arr[2] || arr[2] == 0) ? data.days[arr[2]] || data.days[data.days.length - 1] : "";
        section = (arr[3] || arr[3] == 0) ? data.sections[arr[3]] || data.sections[data.sections.length - 1] : "";
        result = full = `${year + '-' + month + '-' + day + ' ' + section}`;
        let resetData = this.resetData(year, month, day);
        if (this.props.disabledAfter) {
            months = resetData.months;
            days = resetData.days;
            sections = resetData.sections;
        } else {
            if (year % 4 == 0 || (month != this.state.checkObj.month)) {
                days = resetData.days;
            }
        }
        if (months) range.months = months;
        if (days) range.days = days;
        if (sections) range.sections = sections;
        obj = {
            year,
            month,
            day,
            section
        }
        this.setState({
            range,
            checkObj: obj,
            pickVal:e.detail.value
        })
        this.props.change({
            result: result,
            value: full,
            obj: obj
        })
    }

    render() {
        const { pickVal,range } = this.state
        return (
            <View className='w-picker-view'>
                <PickerView className="d-picker-view" indicatorStyle={this.props.itemHeight} value={pickVal} onChange={this.handlerChange}>
                    <PickerViewColumn>
                        {
                            range.years.map((item, index) => {
                                return (<View className="w-picker-item" key={index}>{item}年</View>)
                            })
                        }
                    </PickerViewColumn>
                    <PickerViewColumn>
                        {
                            range.months.map((item, index) => {
                                return (<View className="w-picker-item" key={index}>{item}月</View>)
                            })
                        }
                    </PickerViewColumn>
                    <PickerViewColumn>
                        {
                            range.days.map((item, index) => {
                                return (<View className="w-picker-item" key={index}>{item}日</View>)
                            })
                        }
                    </PickerViewColumn>
                    <PickerViewColumn>
                        {
                            range.sections.map((item, index) => {
                                return (<View className="w-picker-item" key={index}>{item}</View>)
                            })
                        }
                    </PickerViewColumn>
                </PickerView>
            </View>
        )
    }
}
HalfPicker.PropTypes = {
    itemHeight: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.number
    ]),
    current: PropTypes.bool,
    startYear: PropTypes.oneOfType([
        PropTypes.string,
    ]),
    endYear: PropTypes.oneOfType([
        PropTypes.string,
    ]),
    disabledAfter: PropTypes.bool
}
HalfPicker.defaultProps = {
    itemHeight: "44px",
    value: "",
    current: false,
    startYear: "",
    endYear: "",
    disabledAfter: false
}
