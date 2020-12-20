import React, { Component } from "react";
import {
  IonRow,
  IonCol,
  IonModal,
  IonButton,
  IonGrid,
  IonContent,
  IonFooter,
  isPlatform,
  IonCheckbox,
  IonLabel,
} from "@ionic/react";
import { neighborhoods } from "../../data/hoods";
import unfoldArrow from "../../theme/images/unfoldArrow.png";

class SelectHoods extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      selectedHoods: [],
      gotData: false,
      allChecked: false
    };
  }

  componentDidUpdate = () => {
    if (
      !(Object.keys(this.props.appState.userData).length < 1) &&
      this.state.gotData === false
    ) {
      const hoodData = neighborhoods[this.props.appState.userData.citySearch];
      const regions = Object.keys(hoodData);
      let allHoods = [];
      regions.forEach(region => {
        allHoods = hoodData[region].concat(allHoods)
      })
      this.setState({
        selectedHoods: this.props.appState.userData.hoodSearch,
        gotData: true,
        allChecked: this.props.appState.userData.hoodSearch.length === allHoods.length,
        allHoods: allHoods
      });
    }

    if (this.props.cityChange){
      this.setState({
        gotData: false
      });
    }
  };


  checkAll = (e: any) => {
    console.log(e.target.value)
    const allHoods = [...this.state.allHoods];
    if (e.target.value === "all") {
      if (e.target.checked) {
        // console.log(e.target.checked);
        this.setState({
          selectedHoods: allHoods,
          allChecked: true
        });
      } else {
        this.setState({
          selectedHoods: [],
          allChecked: false
        });
      }
    } else {
      let theHoods = this.state.selectedHoods;
      if (e.target.checked) {
        theHoods.push(e.target.value);
        this.setState({
          selectedHoods: theHoods,
        });
      } else {
        this.removeItemOnce(theHoods, e.target.value);
        this.setState({
          selectedHoods: theHoods,
        });
      }
      // console.log(this.state.selectedHoods.length)
      // console.log(this.state.allHoods.length)
      if (this.state.selectedHoods.length === this.state.allHoods.length) {
        this.setState({
          allChecked: true
        })
      } else {
        this.setState({
          allChecked: false
        })
      }
    }
  };

  removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  

  unfold = (e: any) => {
    let node = e.currentTarget;
    const id = node.id;
    const hoodsToUnfold = document.getElementsByClassName(id);
    for (var i = 0; i < hoodsToUnfold.length; i++) {
      hoodsToUnfold[i].classList.toggle("ion-hide");
    }
    node.getElementsByTagName("img")[0].classList.toggle("arrowUnfolded");
  };

  render() {
    // console.log(this.state)
    const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    const inputClass = isPlatform("ios")
      ? "iosSignupInput"
      : "androidSignupInput";
    if (Object.keys(this.props.appState.userData).length < 1) {
      return <div></div>;
    } else {
      const hoodData = neighborhoods[this.props.appState.userData.citySearch];
      const regions = Object.keys(hoodData);
      // console.log(this.props.userData.neighborhoods)

      return (
        <IonModal isOpen={this.props.selectingHoods} cssClass="modalClass">
          <IonContent className="hoodModalWrapper all">
            <IonGrid>
              <div
                className={
                  isPlatform("iphone")
                    ? "iosModalHoodHeading"
                    : "androidModalHoodHeading"
                }
                style={{ display: "inline-block" }}
              >
                Neighborhoods
              </div>
              <IonRow>
                <IonCol style={{ marginLeft: "10px" }}>

                <div className="hoodItem">
                    <div className="hoodCheckboxDiv">
                      <IonCheckbox
                        className="hoodCheckbox"
                        value="all"
                        onClick={this.checkAll}
                        checked={this.state.allChecked}
                      />
                    </div>
                    <IonLabel>
                      <span
                        style={{ fontFamily: "Palanquin Bold", marginBottom: "16px" }}
                        className="hoodLabel"
                      >
                        ALL
                      </span>
                    </IonLabel>
                  </div>

                  {regions.map((region: string) => {
                    var regionNoSpace = region.replace(/ /g, "");
                    if (regions.indexOf(region) % 2 === 0) {
                      const hoods = hoodData[region];
                      return (
                        <div
                          key={regionNoSpace}
                          style={{ marginBottom: "10px" }}
                        >
                          <div id={regionNoSpace} onClick={this.unfold}>
                            <span className="hoodModalSubHeading">
                              {region}
                            </span>
                            &nbsp;
                            <img className="unfoldArrow" src={unfoldArrow} />
                          </div>
                          {hoods.map((hood) => {
                            let checked: boolean;
                            this.state.selectedHoods.includes(hood)
                              ? (checked = true)
                              : (checked = false);

                            return (
                              <div
                                key={hood}
                                className={`${regionNoSpace} hoodItem ion-hide`}
                              >
                                <div className="hoodCheckboxDiv">
                                  <IonCheckbox
                                    className="hoodCheckbox hoodOption"
                                    value={hood}
                                    checked={checked}
                                    onClick={this.checkAll}
                                  />
                                </div>
                                <IonLabel>
                                  <span className="hoodLabel">{hood}</span>
                                </IonLabel>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                  })}
                </IonCol>
                <IonCol style={{ marginRight: "10px" }}>
                  {regions.map((region: string) => {
                    var regionNoSpace = region.replace(/ /g, "");
                    if (regions.indexOf(region) % 2 === 1) {
                      const hoods = hoodData[region];
                      return (
                        <div
                          key={regionNoSpace}
                          style={{ marginBottom: "10px" }}
                        >
                          <div id={regionNoSpace} onClick={this.unfold}>
                            <span className="hoodModalSubHeading">
                              {region}
                            </span>
                            &nbsp;
                            <img className="unfoldArrow" src={unfoldArrow} />
                          </div>
                          {hoods.map((hood) => {
                            let checked: boolean;
                            this.state.selectedHoods.includes(hood)
                              ? (checked = true)
                              : (checked = false);
                            return (
                              <div
                                key={hood}
                                className={`${regionNoSpace} hoodItem ion-hide`}
                              >
                                <div className="hoodCheckboxDiv">
                                  <IonCheckbox
                                    className="hoodCheckbox hoodOption"
                                    value={hood}
                                    checked={checked}
                                    onClick={this.checkAll}
                                  />
                                </div>
                                <IonLabel>
                                  <span className="hoodLabel">{hood}</span>
                                </IonLabel>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                  })}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
          <IonFooter mode="ios" className="ion-text-center footerHeight">
            <IonRow>
              <IonCol className="ion-align-items-center">
                <IonButton
                  style={{ marginTop: "10px" }}
                  onClick={() => this.props.toggleSelectHoods(this.state.selectedHoods)}
                >
                  OK
                </IonButton>
              </IonCol>
            </IonRow>
          </IonFooter>
        </IonModal>
      );
    }
  }
}

export default SelectHoods;
