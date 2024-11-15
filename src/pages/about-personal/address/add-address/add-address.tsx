import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Button, Picker, Text } from "@tarojs/components";
import { AtInput, AtSwitch } from "taro-ui";
import "./add-address.scss";
import { getLocateInfo, addressSave } from "./../../../../api/request";
import Navbar from "../../../../component/navbarTitle/index";
import { requestAddress } from "../../../../store/actions/order";
import { connect } from "react-redux";
class AddAddress extends Component {
  config = {
    navigationBarTitleText: "Add Address",
  };

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
  componentDidMount() {
    Taro.setNavigationBarTitle({ title: Taro.T._("addnewaddress") });
    this.setState({
      selectedCountryCheckedName: Taro.T._("country"),
      selectedRegionCheckedName: Taro.T._("province"),
      selectedCityCheckedName: Taro.T._("city"),
      selectedCountyCheckedName: Taro.T._("district"),
    });
    getLocateInfo({}, "").then((data) => {
      let countryName = [];
      for (let i = 0; i < data.length; i++) {
        countryName.push(data[i].label);
      }
      this.setState({
        countryList: data,
        countryNameList: countryName,
        selectedCountryCheckedId: data[0].value,
        selectedCountryCheckedName: data[0].label,
      });

      getLocateInfo({ region: data[0].value }, data[0].code).then((region) => {
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
          getLocateInfo({ city: region[0].value }, data[0].value).then(
            (city) => {
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
            }
          );
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
      is_default
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
      <View className="add-address">
        <Navbar title={Taro.T._("addnewaddress")} />
        <View className="add-address-item">
          <AtInput
            name="recipients"
            type="text"
            className="add-address-item-input"
            value={recipients}
            placeholder={Taro.T._("recipients")}
            placeholderClass="add-address-item-input-placeholder"
            onChange={(value) => {
              this.setState({ recipients: value });
            }}
          />
        </View>
        <View className="add-address-item">
          <AtInput
            name="phone"
            type="text"
            className="add-address-item-input"
            value={phone}
            placeholder={Taro.T._("phone")}
            placeholderClass="add-address-item-input-placeholder"
            onChange={(value) => {
              this.setState({ phone: value });
            }}
          />
        </View>
        <View className="add-address-item">
          <Picker
            mode="selector"
            range={countryNameList}
            onChange={this.onCountryChange}
            className="add-address-item-picker"
          >
            <View className="picker">{selectedCountryCheckedName}</View>
          </Picker>
        </View>
        {regionNameList && regionNameList.length > 0 ? (
          <View className="add-address-item">
            <Picker
              mode="selector"
              range={regionNameList}
              onChange={this.onRegionChange}
              className="add-address-item-picker"
            >
              <View className="picker">{selectedRegionCheckedName}</View>
            </Picker>
          </View>
        ) : (
          <View className="add-address-item">
            <AtInput
              name="region"
              type="text"
              className="add-address-item-input"
              value={selectedRegionCheckedName}
              placeholder={Taro.T._("province")}
              placeholderClass="add-address-item-input-placeholder"
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
          <View className="add-address-item">
            <Picker
              mode="selector"
              range={cityNameList}
              onChange={this.onCityChange}
              className="add-address-item-picker"
            >
              <View className="picker">{selectedCityCheckedName}</View>
            </Picker>
          </View>
        ) : (
          <View className="add-address-item">
            <AtInput
              name="city"
              type="text"
              className="add-address-item-input"
              value={selectedCityCheckedName}
              placeholder={Taro.T._("city")}
              placeholderClass="add-address-item-input-placeholder"
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
          <View className="add-address-item">
            <Picker
              mode="selector"
              range={countyNameList}
              onChange={this.onCountyChange}
              className="add-address-item-picker"
            >
              <View className="picker">{selectedCountyCheckedName}</View>
            </Picker>
          </View>
        ) : (
          <View className="add-address-item">
            <AtInput
              name="city"
              type="text"
              className="add-address-item-input"
              value={selectedCountyCheckedName}
              placeholder={Taro.T._("district")}
              placeholderClass="add-address-item-input-placeholder"
              onChange={(value) => {
                this.setState({
                  selectedCountyCheckedName: value,
                  selectedCountyCheckedId: value,
                });
              }}
            />
          </View>
        )}
        <View className="add-address-item">
          <AtInput
            name="addressdetail"
            type="text"
            className="add-address-item-input"
            value={addressdetail}
            placeholder={Taro.T._("detailaddressplacehander")}
            placeholderClass="add-address-item-input-placeholder"
            onChange={(value) => {
              this.setState({ addressdetail: value });
            }}
          />
        </View>
        <View className="add-address-item">
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
        <View className="add-address-button" onClick={this.handleSave}>
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
export default connect(mapStateToProps)(AddAddress);
