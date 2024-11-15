import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import TimePicker from "./timePicker/index"
import ShorttermPicker from "./shorttermPicker/index"
import SelectorPicker from "./selectorPicker/index"
import RegionPicker from "./regionPicker/index"
import RangePicker from "./rangePicker/index"
import LinkagePicker from "./linkagePicker/index"
import HalfPicker from "./halfPicker/index"
import DatePicker from "./datePicker/index"
import PropTypes from 'prop-types';
import './index.scss'
let defaultTime = new Date().getFullYear()
export default class WPicker extends Component {
    state = {
        itemHeight: `height: 88rpx;`,
        visible: false,
        result: {},
        confirmFlag: true,
        createKey: null
    }
    componentWillMount() {
        this.props.onRef(this)
        this.setState({
            createKey: Math.random() * 1000
        })
    }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    touchStart = () => {
        if (this.props.timeout) {
            this.setState({
                confirmFlag: false
            })
        }
    }
    touchEnd = () => {
        if (this.props.timeout) {
            setTimeout(() => {
                this.setState({
                    confirmFlag: true
                })
            }, 500)
        }
    }
    handlerChange = (res) => {
        this.setState({
            result: { ...res }
        })
    }
    show = () => {
        this.setState({
            visible: true
        })
    }
    hide = () => {
        this.setState({
            visible: false
        })
    }

    onCancel = (res) => {
        this.setState({
            visible: false
        })
        this.props.cancel();
    }

    pickerConfirm = () => {
        if (!this.state.confirmFlag) {
            return;
        };
        this.props.confirm(this.state.result);
        this.setState({
            visible: false
        })
    }

    render() {
        const { itemHeight, visible, confirmFlag, createKey } = this.state
        return (
            <View class="w-picker" key={createKey} data-key={createKey}>
                <View class={'mask' + (visible ? ' visible' : '')} onTap={this.onCancel} catchtouchmove={true}></View>
                <View class={'w-picker-cnt' + (visible ? ' visible' : '')}>
                    <View class="w-picker-header" catchtouchmove={true}>
                        <Text onTap={this.onCancel}>取消</Text>
                        {this.props.children}
                        <Text style={'color:' + this.props.themeColor} onTap={this.pickerConfirm}>确定</Text>
                    </View>

                    <View>{this.props.mode == 'time' ? (<TimePicker
                        class="w-picker-wrapper"
                        value={this.props.value}
                        itemHeight={itemHeight}
                        current={this.props.current}
                        disabledAfter={this.props.disabledAfter}
                        second={this.props.second}
                        change={this.handlerChange}
                        touchstart={this.touchStart}
                        touchend={this.touchEnd}>
                    </TimePicker>) : null}</View>

                    <View>{this.props.mode == 'shortTerm' ? (<ShorttermPicker
                        class="w-picker-wrapper"
                        startYear={this.props.startYear}
                        endYear={this.props.endYear}
                        value={this.props.value}
                        itemHeight={itemHeight}
                        current={this.props.current}
                        disabledAfter={this.props.disabledAfter}
                        change={this.handlerChange}
                        touchstart={this.touchStart}
                        touchend={this.touchEnd}
                        expand={60}>
                    </ShorttermPicker>) : null}</View>

                    <View>{this.props.mode == 'selector' ? (<SelectorPicker
                        class="w-picker-wrapper"
                        value={this.props.value}
                        itemHeight={itemHeight}
                        options={this.props.options}
                        defaultType={this.props.defaultType}
                        defaultProps={this.props.defaultProps}
                        change={this.handlerChange}
                        touchstart={this.touchStart}
                        touchend={this.touchEnd}>
                    </SelectorPicker>) : null}</View>

                    <View>{this.props.mode == 'region' ? (<RegionPicker
                        class="w-picker-wrapper"
                        value={this.props.value}
                        hideArea={this.props.hideArea}
                        itemHeight={itemHeight}
                        defaultType={this.props.defaultType}
                        change={this.handlerChange}
                        touchstart={this.touchStart}
                        touchend={this.touchEnd}>
                    </RegionPicker>) : null}</View>

                    <View>{this.props.mode == 'range' ? (<RangePicker
                        class="w-picker-wrapper"
                        startYear={this.props.startYear}
                        endYear={this.props.endYear}
                        value={this.props.value}
                        itemHeight={itemHeight}
                        current={this.props.current}
                        change={this.handlerChange}
                        touchstart={this.touchStart}
                        touchend={this.touchEnd}>
                    </RangePicker>) : null}</View>

                    <View>{this.props.mode == 'linkage' ? (<LinkagePicker
                        class="w-picker-wrapper"
                        value={this.props.value}
                        options={this.props.options}
                        level={this.props.level}
                        defaultType={this.props.defaultType}
                        defaultProps={this.props.defaultProps}
                        itemHeight={itemHeight}
                        change={this.handlerChange}
                        touchstart={this.touchStart}
                        touchend={this.touchEnd}>
                    </LinkagePicker>) : null}</View>
                    
                    <View>{this.props.mode == 'half' ? (<HalfPicker
                        class="w-picker-wrapper"
                        startYear={this.props.startYear}
                        endYear={this.props.endYear}
                        value={this.props.value}
                        itemHeight={itemHeight}
                        current={this.props.current}
                        disabledAfter={this.props.disabledAfter}
                        change={this.handlerChange}
                        touchstart={this.touchStart}
                        touchend={this.touchEnd}>
                    </HalfPicker>) : null}</View>

                    <View>{this.props.mode == 'date' ? (<DatePicker
                        class="w-picker-wrapper"
                        startYear={this.props.startYear}
                        endYear={this.props.endYear}
                        value={this.props.value}
                        fields={this.props.fields}
                        itemHeight={itemHeight}
                        current={this.props.current}
                        disabledAfter={this.props.disabledAfter}
                        change={this.handlerChange}
                        touchstart={this.touchStart}
                        touchend={this.touchEnd}>
                    </DatePicker>) : null}</View>

                </View>
            </View >
        )
    }
}
WPicker.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array
    ]),//默认值
    current: PropTypes.bool,//是否默认显示当前时间，如果是，传的默认值将失效
    second: PropTypes.bool,//time-picker是否显示秒
    mode: PropTypes.string,
    themeColor: PropTypes.string,//确认按钮主题颜色
    fields: PropTypes.string,//日期颗粒度:year、month、day、hour、minute、second
    disabledAfter: PropTypes.bool,//是否禁用当前之后的日期
    options: PropTypes.oneOfType([//selector,region数据源
        PropTypes.array,
        PropTypes.object,
    ]),
    defaultProps: PropTypes.object,//selector,linkagle字段转换配置
    defaultType: PropTypes.string,
    hideArea: PropTypes.bool,//mode=region时，是否隐藏区县列
    level: PropTypes.oneOfType([//多级联动层级，表示几级联动,区间2-4;
        PropTypes.string,
        PropTypes.number,
    ]),
    timeout: PropTypes.bool,//是否开启点击延迟,当快速滚动 还没有滚动完毕点击关闭时得到的值是不准确的
    expand: PropTypes.oneOfType([//mode=shortterm 默认往后拓展天数
        PropTypes.string,
        PropTypes.number,
    ]),
    startYear: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    endYear: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ])
}
WPicker.defaultProps = {
    value: "",
    current: false,
    second: true,
    mode: "date",
    themeColor: "#f5a200",
    fields: "date",
    disabledAfter: false,
    options: [],
    defaultProps: {
        label: "label",
        value: "value",
        children: "children"
    },
    defaultType: "label",
    hideArea: false,
    level: 2,
    timeout: false,
    expand: 30,
    startYear: 1970,
    endYear: defaultTime
};

