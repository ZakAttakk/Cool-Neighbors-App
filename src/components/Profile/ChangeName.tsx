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
  IonItem,
  IonInput,
} from "@ionic/react";

class ChangeName extends Component<any, any> {
  constructor(props: any) {
    super(props);


  }
  render() {
    const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    const inputClass = isPlatform("ios")
      ? "iosSignupInput"
      : "androidSignupInput";
    // console.log(this.props.userData)
    return (
      <IonModal isOpen={this.props.editingName} cssClass="modalClass">
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
            First Name
          </div>
            <IonRow>
              <IonCol>
                <IonItem className={itemClass} mode="ios">
                  <IonInput
                    id="firstNameChange"
                    type="text"
                    maxlength={26}
                    placeholder="First Name"
                    className={inputClass}
                    value={this.props.userData.firstName}
                    // onIonChange={getInputs}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
        <IonFooter mode="ios" className="ion-text-center footerHeight">
          <IonRow>
            <IonCol className="ion-align-items-center">
              <IonButton
                style={{ marginTop: "10px" }}
                onClick={this.props.toggleChangeName}
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

export default ChangeName;
