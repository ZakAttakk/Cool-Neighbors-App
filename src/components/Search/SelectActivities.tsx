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
import { activities } from "../../data/activities";

class SelectActivities extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      selectedActivities: [],
      gotData: false,
      allChecked: false
    };
  }

  componentDidUpdate = () => {
    if (
      !(Object.keys(this.props.appState.userData).length < 1) &&
      this.state.gotData === false
    ) {
      this.setState({
        selectedActivities: this.props.appState.userData.activSearch,
        gotData: true,
        allChecked: this.props.appState.userData.activSearch.length === activities.length
      });
    }

    if (this.props.cityChange){
      this.setState({
        gotData: false
      });
    }

  };

  checkAll = (e: any) => {
    const allActivities = [...activities];
    if (e.target.value === "all") {
      if (e.target.checked) {
        // console.log(e.target.checked);
        this.setState({
          selectedActivities: allActivities,
          allChecked: true
        });
      } else {
        this.setState({
          selectedActivities: [],
          allChecked: false
        });
      }
    } else {
      let theActivities = this.state.selectedActivities;
      if (e.target.checked) {
        theActivities.push(e.target.value);
        this.setState({
          selectedActivities: theActivities,
        });
      } else {
        this.removeItemOnce(theActivities, e.target.value);
        this.setState({
          selectedActivities: theActivities,
        });
      }

      if (this.state.selectedActivities.length === activities.length) {
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

  render() {
    const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    const inputClass = isPlatform("ios")
      ? "iosSignupInput"
      : "androidSignupInput";
    if (Object.keys(this.props.appState.userData).length < 1) {
      return <div></div>;
    } else {
      // console.log(this.props.appState.userData.activSearch.length);
      // console.log(activities.length);
      // console.log(this.state.selectedActivities.length);
      var halfwayPoint = Math.floor(activities.length / 2) - 1;
      return (
        <IonModal isOpen={this.props.selectingActivities} cssClass="modalClass">
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
                Activities
              </div>
              <IonRow>
                <IonCol style={{ marginLeft: "8px" }}>
                  <div className="activityItem">
                    <div className="activityCheckboxDiv">
                      <IonCheckbox
                        className="activityCheckbox"
                        value="all"
                        onClick={this.checkAll}
                        checked={this.state.allChecked}
                      />
                    </div>
                    <IonLabel>
                      <span
                        style={{ fontFamily: "Palanquin Bold" }}
                        className="activityLabel"
                      >
                        ALL
                      </span>
                    </IonLabel>
                  </div>

                  {activities.map((activity) => {
                    var activityNoSpace = activity.replace(/ /g, "");
                    if (activities.indexOf(activity) <= halfwayPoint) {
                      let checked: boolean;
                      this.state.selectedActivities.includes(activity)
                        ? (checked = true)
                        : (checked = false);

                      return (
                        <div key={activityNoSpace} className="activityItem">
                          <div className="activityCheckboxDiv">
                            <IonCheckbox
                              className="activityCheckbox activityOption"
                              value={activity}
                              checked={checked}
                              onClick={this.checkAll}
                            />
                          </div>
                          <IonLabel>
                            <span className="activityLabel">{activity}</span>
                          </IonLabel>
                        </div>
                      );
                    }
                  })}
                </IonCol>
                <IonCol style={{ marginRight: "8px" }}>
                  {activities.map((activity) => {
                    var activityNoSpace = activity.replace(/ /g, "");
                    if (activities.indexOf(activity) > halfwayPoint) {
                      let checked: boolean;
                      this.state.selectedActivities.includes(activity)
                        ? (checked = true)
                        : (checked = false);
                      return (
                        <div key={activityNoSpace} className="activityItem">
                          <div className="activityCheckboxDiv">
                            <IonCheckbox
                              className="activityCheckbox activityOption"
                              value={activity}
                              checked={checked}
                              onClick={this.checkAll}
                            />
                          </div>
                          <IonLabel>
                            <span className="activityLabel">{activity}</span>
                          </IonLabel>
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
                  onClick={() => this.props.toggleSelectActivities(this.state.selectedActivities)}
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

export default SelectActivities;
