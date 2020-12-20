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

class ChangeActivities extends Component<any, any> {



  componentDidUpdate = () => {

  };

  render() {
    // console.log(this.props.userData)
    // console.log(this.props.userData)
    const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    const inputClass = isPlatform("ios")
      ? "iosSignupInput"
      : "androidSignupInput";
    if (Object.keys(this.props.userData).length < 1) {
      return <div></div>;
    } else {
      var halfwayPoint = Math.floor(activities.length / 2) - 1;
      return (
        <IonModal isOpen={this.props.editingActivities} cssClass="modalClass">

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
              {activities.map((activity) => {
                var activityNoSpace = activity.replace(/ /g, "");
                if (activities.indexOf(activity) <= halfwayPoint) {
                  let checked: boolean;
                  this.props.userData.activities.includes(activity)
                    ? (checked = true)
                    : (checked = false);

                  return (
                    <div key={activityNoSpace} className="activityItem">
                      <div className="activityCheckboxDiv">
                        <IonCheckbox
                          className="activityCheckbox activityOption"
                          value={activity}
                          checked={checked}
                        />
                      </div>
                      <IonLabel>
                        <span className="activityLabel">{activity}</span>
                        {/* <span>{activity}</span> */}
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
                  this.props.userData.activities.includes(activity)
                    ? (checked = true)
                    : (checked = false);
                  return (
                    <div key={activityNoSpace} className="activityItem">
                      <div className="activityCheckboxDiv">
                        <IonCheckbox
                          className="activityCheckbox activityOption"
                          value={activity}
                          checked={checked}
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
                  onClick={() => this.props.toggleChangeActivities()}
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

export default ChangeActivities;
