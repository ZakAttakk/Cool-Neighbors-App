import React, { Component } from "react";
import {
  IonRow,
  IonCol,
  IonModal,
  IonButton,
  IonGrid,
  IonContent,
  IonFooter,
  isPlatform
} from "@ionic/react";

class VerificationReminder extends Component<
  {
    needToShowEmailReminder: boolean;
    setEmailReminder: Function;
  },
  any
> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <IonModal
        isOpen={this.props.needToShowEmailReminder}
        cssClass="modalClass"
      >
        <IonContent className="hoodModalWrapper">
          <IonGrid>
            
          <div
            className={
              isPlatform("iphone")
                ? "iosModalHoodHeading"
                : "androidModalHoodHeading"
            }
          >
            Welcome!
          </div>

            <div style={{ margin: "16px", fontSize: "16pt" }}>
            
              <span style={{ fontWeight: "bold" }}>Note:</span>&ensp;You must
              confirm your email address before communicating with other
              users.&ensp;Check your inbox (or in rare circumstances your spam
              folder) for a verification email from Cool Neighbors.
              <br />
              <br />
              Your email address will never be shared with third parties or
              other Cool Neighbors users.
              <br />
            </div>
          </IonGrid>
        </IonContent>
        <IonFooter mode="ios" className="ion-text-center footerHeight">
          <IonRow>
            <IonCol className="ion-align-items-center">
              <IonButton
                style={{ marginTop: "10px" }}
                onClick={() => this.props.setEmailReminder(false)}
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

export default VerificationReminder;
