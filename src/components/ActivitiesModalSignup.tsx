import React from "react";
import {
  IonRow,
  IonCol,
  IonModal,
  IonButton,
  IonGrid,
  IonLabel,
  IonCheckbox,
  IonContent,
  IonFooter,
  isPlatform,
} from "@ionic/react";
import { activities } from "../data/activities";

const HoodModelSignup: React.FC<{
  showActivitiesModal: boolean;
  selectActivities: Function;
  selectedActivities: string[];
}> = (props) => {
  var halfwayPoint = Math.floor(activities.length / 2) - 1;

  return (
    <IonModal isOpen={props.showActivitiesModal} cssClass="modalClass">
      <IonContent className="hoodModalWrapper">
        <IonGrid>
          <div
            className={
              isPlatform("iphone")
                ? "iosModalHoodHeading"
                : "androidModalHoodHeading"
            }
          >
            Activities
          </div>
          <IonRow>
            <IonCol style={{ marginLeft: "8px" }}>
              {activities.map((activity) => {
                var activityNoSpace = activity.replace(/ /g, "");
                if (activities.indexOf(activity) <= halfwayPoint) {
                  let checked: boolean;
                  props.selectedActivities.includes(activity)
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
                  props.selectedActivities.includes(activity)
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
            <IonButton style={{marginTop: '10px'}} onClick={() => props.selectActivities()}>Done</IonButton>
          </IonCol>
        </IonRow>
      </IonFooter>
    </IonModal>
  );
};

export default HoodModelSignup;
