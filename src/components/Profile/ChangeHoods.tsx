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

class ChangeHoods extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidUpdate = () => {};

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
    // console.log(this.props.userData)
    const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    const inputClass = isPlatform("ios")
      ? "iosSignupInput"
      : "androidSignupInput";
    if (Object.keys(this.props.userData).length < 1) {
      return <div></div>;
    } else {
      const hoodData = neighborhoods[this.props.userData.city];
      const regions = Object.keys(hoodData);
      // console.log(this.props.userData.neighborhoods)

      return (
        <IonModal isOpen={this.props.editingHoods} cssClass="modalClass">
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
                            this.props.userData.neighborhoods.includes(hood)
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
                            this.props.userData.neighborhoods.includes(hood)
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
                  onClick={() => this.props.toggleChangeHoods()}
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

export default ChangeHoods;
