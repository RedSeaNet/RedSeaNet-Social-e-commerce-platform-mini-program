import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Button, Picker, Text } from "@tarojs/components";
import { AtInput, AtSwitch } from "taro-ui";
import "./update-address.scss";
import {
  getLocateInfo,
  addressSave,
  addressInfo,
} from "./../../../../api/request";
import Navbar from "../../../../component/navbarTitle/index";
import { requestAddress } from "../../../../store/actions/order";
import { connect } from "react-redux";
class UpdateAddress extends Component {
  current = getCurrentInstance();
  constructor(props) {
    super(props);
    this.state = {
      recipients: "",
      phone: "",
      countryList: [],
      selectedCountryCheckedName: "",
      selectedCountryCheckedId: "",
      countryNameList: [],

      regionList: [],
      selectedRegionCheckedName: "",
      selectedRegionCheckedId: "",
      regionNameList: [],

      cityList: [],
      selectedCityCheckedName: "",
      selectedCityCheckedId: "",
      cityNameList: [],

      countyList: [],
      selectedCountyCheckedName: "",
      selectedCountyCheckedId: "",
      countyNameList: [],
      addressdetail: "",
      is_default: 0,
    };
  }
  async componentDidMount() {
    Taro.setNavigationBarTitle({ title: Taro.T._("addnewaddress") });
    let currentAddress = {};
    if (this.current.router.params.id) {
      currentAddress = await addressInfo(this.current.router.params.id);
    } else {
      Taro.navigateBack();
    }

    getLocateInfo({}, "").then((data) => {
      let countryName = [];
      let selectedCountryCheckedName = "";
      for (let i = 0; i < data.length; i++) {
        countryName.push(data[i].label);
        if (data[i].value == currentAddress.country) {
          selectedCountryCheckedName = data[i].label;
        }
      }
      this.setState({
        countryList: data,
        countryNameList: countryName,
        selectedCountryCheckedId: currentAddress.country,
        selectedRegionCheckedId: currentAddress.region,
        selectedRegionCheckedName: currentAddress.region,
        selectedCityCheckedId: currentAddress.city,
        selectedCityCheckedName: currentAddress.city,
        selectedCountyCheckedId: currentAddress.county,
        selectedCountyCheckedName: currentAddress.county,
        recipients: currentAddress.name,
        addressdetail: currentAddress.address,
        is_default: currentAddress.is_default,
        phone: currentAddress.tel,
        selectedCountryCheckedName: selectedCountryCheckedName,
      });

      getLocateInfo({ region: currentAddress.country }, "").then((region) => {
        console.log("====getLocationList region=====", region);
        let regionName = [];
        if (region.length > 0) {
          let selectedRegionCheckedName = "";
          for (let i = 0; i < region.length; i++) {
            regionName.push(region[i].label);
            if (region[i].value == currentAddress.region) {
              selectedRegionCheckedName = region[i].label;
            }
          }
          this.setState({
            regionList: region,
            regionNameList: regionName,
            selectedRegionCheckedName: selectedRegionCheckedName,
          });
          getLocateInfo({ city: currentAddress.region }, "").then((city) => {
            console.log("====getLocationList city=====", city);
            if (city.length > 0) {
              let cityName = [];
              for (let i = 0; i < city.length; i++) {
                cityName.push(city[i].label);
              }
              this.setState({
                cityList: city,
                cityNameList: cityName,
                selectedCityCheckedId: city[0].value,
                selectedCityCheckedName: city[0].label,
              });
              getLocateInfo({ county: city[0].value }, data[0].value).then(
                (county) => {
                  console.log("====getLocationList county=====", county);
                  if (county.length > 0) {
                    let countyName = [];
                    for (let i = 0; i < county.length; i++) {
                      countyName.push(county[i].label);
                    }
                    this.setState({
                      countyList: county,
                      countyNameList: countyName,
                      selectedCountyCheckedId: county[0].value,
                      selectedCountyCheckedName: county[0].label,
                    });
                  } else {
                    this.setState({
                      countyList: [],
                      countyName: [],
                    });
                  }
                }
              );
            } else {
              this.setState({
                cityNameList: [],
                cityList: [],
                countyList: [],
                countyName: [],
              });
            }
          });
        } else {
          this.setState({
            regionList: [],
            regionNameList: [],
            cityNameList: [],
            cityList: [],
            countyList: [],
            countyName: [],
          });
        }
      });
    });
  }

  componentDidShow() {}
  onCountryChange = (e) => {
    let { countryList } = this.state;
    console.log("countryList[e.detail.value]");
    console.log(countryList[e.detail.value]);
    this.setState({
      selectedCountryCheckedName: countryList[e.detail.value].label,
      selectedCountryCheckedId: countryList[e.detail.value].value,
    });
    getLocateInfo(
      { region: countryList[e.detail.value].value },
      countryList[e.detail.value].code
    ).then((region) => {
      console.log("====getLocationList region=====", region);
      let regionName = [];
      if (region.length > 0) {
        for (let i = 0; i < region.length; i++) {
          regionName.push(region[i].label);
        }
        this.setState({
          regionList: region,
          regionNameList: regionName,
          selectedRegionCheckedId: region[0].value,
          selectedRegionCheckedName: region[0].label,
        });
        getLocateInfo(
          { city: region[0].value },
          countryList[e.detail.value].value
        ).then((city) => {
          console.log("====getLocationList city=====", city);
          if (city.length > 0) {
            let cityName = [];
            for (let i = 0; i < city.length; i++) {
              cityName.push(city[i].label);
            }
            this.setState({
              cityList: city,
              cityNameList: cityName,
              selectedCityCheckedId: city[0].value,
              selectedCityCheckedName: city[0].label,
            });

            getLocateInfo(
              { county: city[0].value },
              countryList[e.detail.value].value
            ).then((county) => {
              console.log("====getLocationList county=====", county);
              if (county.length > 0) {
                let countyName = [];
                for (let i = 0; i < county.length; i++) {
                  countyName.push(county[i].label);
                }
                this.setState({
                  countyList: county,
                  countyNameList: countyName,
                  selectedCountyCheckedId: county[0].value,
                  selectedCountyCheckedName: county[0].label,
                });
              } else {
                this.setState({
                  countyList: [],
                  countyName: [],
                  selectedCountyCheckedId: "",
                  selectedCountyCheckedName: "",
                });
              }
            });
          } else {
            this.setState({
              cityNameList: [],
              cityList: [],
              selectedCityCheckedId: "",
              selectedCityCheckedName: "",
              countyList: [],
              countyName: [],
              selectedCountyCheckedId: "",
              selectedCountyCheckedName: "",
            });
          }
        });
      } else {
        this.setState({
          regionList: [],
          regionNameList: [],
          selectedRegionCheckedId: "",
          selectedRegionCheckedName: "",
          cityNameList: [],
          cityList: [],
          selectedCityCheckedId: "",
          selectedCityCheckedName: "",
          countyList: [],
          countyName: [],
          selectedCountyCheckedId: "",
          selectedCountyCheckedName: "",
        });
      }
    });
  };
  onRegionChange = (e) => {
    let { regionList, selectedCountryCheckedId } = this.state;
    this.setState({
      selectedRegionCheckedName: regionList[e.detail.value].label,
      selectedRegionCheckedId: regionList[e.detail.value].value,
    });

    getLocateInfo(
      { city: regionList[e.detail.value].value },
      selectedCountryCheckedId
    ).then((city) => {
      console.log("====getLocationList city=====", city);
      if (city.length > 0) {
        let cityName = [];
        for (let i = 0; i < city.length; i++) {
          cityName.push(city[i].label);
        }
        this.setState({
          cityList: city,
          cityNameList: cityName,
          selectedCityCheckedId: city[0].value,
          selectedCityCheckedName: city[0].label,
        });

        getLocateInfo({ county: city[0].value }, selectedCountryCheckedId).then(
          (county) => {
            console.log("====getLocationList county=====", county);
            if (county.length > 0) {
              let countyName = [];
              for (let i = 0; i < county.length; i++) {
                countyName.push(county[i].label);
              }
              this.setState({
                countyList: county,
                countyNameList: countyName,
                selectedCountyCheckedId: county[0].value,
                selectedCountyCheckedName: county[0].label,
              });
            } else {
              this.setState({
                countyList: [],
                countyName: [],
                selectedCountyCheckedId: "",
                selectedCountyCheckedName: "",
              });
            }
          }
        );
      } else {
        this.setState({
          cityNameList: [],
          cityList: [],
          selectedCityCheckedId: "",
          selectedCityCheckedName: "",
          countyList: [],
          countyName: [],
          selectedCountyCheckedId: "",
          selectedCountyCheckedName: "",
        });
      }
    });
  };
  onCityChange = (e) => {
    let { cityList, selectedCountryCheckedId } = this.state;
    this.setState({
      selectedCityCheckedName: cityList[e.detail.value].label,
      selectedCityCheckedId: cityList[e.detail.value].value,
    });

    getLocateInfo(
      { county: cityList[e.detail.value].value },
      selectedCountryCheckedId
    ).then((county) => {
      console.log("====getLocationList county=====", county);
      if (county.length > 0) {
        let countyName = [];
        for (let i = 0; i < county.length; i++) {
          countyName.push(county[i].label);
        }
        this.setState({
          countyList: county,
          countyNameList: countyName,
          selectedCountyCheckedId: county[0].value,
          selectedCountyCheckedName: county[0].label,
        });
      } else {
        this.setState({
          countyList: [],
          countyName: [],
          selectedCountyCheckedId: "",
          selectedCountyCheckedName: "",
        });
      }
    });
  };
  onCountyChange = (e) => {
    let { countyList } = this.state;
    this.setState({
      selectedCountyCheckedName: countyList[e.detail.value].label,
      selectedCountyCheckedId: countyList[e.detail.value].value,
    });
  };
  handleSave = () => {
    console.log("handleSave------");
    let {
      recipients,
      phone,
      addressdetail,
      selectedCountryCheckedId,
      selectedRegionCheckedId,
      selectedCityCheckedId,
      selectedCountyCheckedId,
      is_default,
    } = this.state;
    if (recipients == "") {
      Taro.showToast({
        title: Taro.T._("pleaseentershippingmessage"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    if (phone == "") {
      Taro.showToast({
        title: Taro.T._("pleaseenterphone"),
        icon: "none",
        duration: 2000,
      });
      return false;
    }
    addressSave(
      recipients,
      phone,
      addressdetail,
      selectedCountryCheckedId,
      selectedRegionCheckedId,
      selectedCityCheckedId,
      selectedCountyCheckedId,
      is_default,
      this.current.router.params.id
    ).then((data) => {
      Taro.showToast({
        title: "加入成功！",
        icon: "none",
        duration: 2000,
      });
      console.log(data);
      this.props.dispatch(requestAddress());
      Taro.navigateBack();
    });
  };
  render() {
    let {
      recipients,
      phone,
      countryList,
      countryNameList,
      regionNameList,
      regionList,
      cityNameList,
      countyList,
      countyNameList,
      addressdetail,
      is_default,
      selectedCountryCheckedName,
      selectedRegionCheckedId,
      selectedRegionCheckedName,
      selectedCityCheckedId,
      selectedCityCheckedName,
      selectedCountyCheckedId,
      selectedCountyCheckedName,
    } = this.state;
    return (
      <View className="update-address">
        <Navbar title={Taro.T._("updateaddress")} />
        <View className="update-address-item">
          <AtInput
            name="recipients"
            type="text"
            className="update-address-item-input"
            value={recipients}
            placeholder={Taro.T._("recipients")}
            placeholderClass="update-address-item-input-placeholder"
            onChange={(value) => {
              this.setState({ recipients: value });
            }}
          />
        </View>
        <View className="update-address-item">
          <AtInput
            name="phone"
            type="text"
            className="update-address-item-input"
            value={phone}
            placeholder={Taro.T._("phone")}
            placeholderClass="update-address-item-input-placeholder"
            onChange={(value) => {
              this.setState({ phone: value });
            }}
          />
        </View>
        <View className="update-address-item">
          <Picker
            mode="selector"
            range={countryNameList}
            onChange={this.onCountryChange}
            className="update-address-item-picker"
          >
            <View className="picker">{selectedCountryCheckedName}</View>
          </Picker>
        </View>
        {regionNameList && regionNameList.length > 0 ? (
          <View className="update-address-item">
            <Picker
              mode="selector"
              range={regionNameList}
              onChange={this.onRegionChange}
              className="update-address-item-picker"
            >
              <View className="picker">
                {this.state.selectedRegionCheckedName}
              </View>
            </Picker>
          </View>
        ) : (
          <View className="update-address-item">
            <AtInput
              name="region"
              type="text"
              className="update-address-item-input"
              value={selectedRegionCheckedName}
              placeholder={Taro.T._("province")}
              placeholderClass="update-address-item-input-placeholder"
              onChange={(value) => {
                this.setState({
                  selectedRegionCheckedName: value,
                  selectedRegionCheckedId: value,
                });
              }}
            />
          </View>
        )}
        {cityNameList && cityNameList.length > 0 ? (
          <View className="update-address-item">
            <Picker
              mode="selector"
              range={cityNameList}
              onChange={this.onCityChange}
              className="update-address-item-picker"
            >
              <View className="picker">{selectedCityCheckedName}</View>
            </Picker>
          </View>
        ) : (
          <View className="update-address-item">
            <AtInput
              name="city"
              type="text"
              className="update-address-item-input"
              value={selectedCityCheckedName}
              placeholder={Taro.T._("city")}
              placeholderClass="update-address-item-input-placeholder"
              onChange={(value) => {
                this.setState({
                  selectedCityCheckedName: value,
                  selectedCityCheckedId: value,
                });
              }}
            />
          </View>
        )}
        {countyNameList && countyNameList.length > 0 ? (
          <View className="update-address-item">
            <Picker
              mode="selector"
              range={countyNameList}
              onChange={this.onCountyChange}
              className="update-address-item-picker"
            >
              <View className="picker">{selectedCountyCheckedName}</View>
            </Picker>
          </View>
        ) : (
          <View className="update-address-item">
            <AtInput
              name="city"
              type="text"
              className="update-address-item-input"
              value={selectedCountyCheckedName}
              placeholder={Taro.T._("district")}
              placeholderClass="update-address-item-input-placeholder"
              onChange={(value) => {
                this.setState({
                  selectedCountyCheckedName: value,
                  selectedCountyCheckedId: value,
                });
              }}
            />
          </View>
        )}

        <View className="update-address-item">
          <AtInput
            name="addressdetail"
            type="text"
            className="update-address-item-input"
            value={this.state.addressdetail}
            placeholder={Taro.T._("detailaddressplacehander")}
            placeholderClass="update-address-item-input-placeholder"
            onChange={(value) => {
              this.setState({ addressdetail: value });
            }}
          />
        </View>
        <View className="update-address-item">
          <AtSwitch
            title={Taro.T._("defaultaddress")}
            checked={is_default == 1 ? true : false}
            color="#d62c75"
            onChange={(e) => {
              if (e) {
                this.setState({ is_default: 1 });
              } else {
                this.setState({ is_default: 0 });
              }
            }}
          />
        </View>
        <View className="update-address-button" onClick={this.handleSave}>
          <Text>{Taro.T._("save")}</Text>
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({ order, cart }) => ({
  order,
  cart: cart,
});
export default connect(mapStateToProps)(UpdateAddress);
