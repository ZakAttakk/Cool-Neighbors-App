import React, { Component } from "react";
import {
  IonRow,
  IonCol,
  IonButton,
  IonGrid,
  IonContent,
  IonFooter,
  IonModal,
} from "@ionic/react";

class ChangePasswordModal extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render = () => {
    // const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    // const inputClass = isPlatform("ios")
    //   ? "iosSignupInput"
    //   : "androidSignupInput";

    return (
      <IonModal
        isOpen={this.props.changePasswordModalOpen}
        cssClass="modalClass"
      >
        <IonContent className="hoodModalWrapper all">
          <IonGrid>
            <IonRow>
              <IonCol
                style={{ fontSize: "14pt", fontFamily: "Palanquin Regular" }}
                className="ion-text-center"
              >
                <div style={{ marginBottom: "16px", marginTop: "36px", marginLeft: "16px", marginRight: "16px" }}>
                  To change your password, click the button below.
                </div>

                <div style={{ marginBottom: "22px", marginLeft: "16px", marginRight: "16px" }}>
                  You will be logged out.&ensp;A password reset email will be
                  sent to your email address.
                </div>

                <IonButton color="primary" className="passReset" onClick={this.props.changePassword}>SEND RESET EMAIL</IonButton>

              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>

        <IonFooter mode="ios" className="ion-text-center footerHeight">
          <IonRow>
            <IonCol className="ion-align-items-center">
              <IonButton
                style={{ marginTop: "10px" }}
                color="tertiary"
                onClick={this.props.closePasswordModal}
                className="submitCancel"
              >
                CANCEL
              </IonButton>
            </IonCol>
          </IonRow>
        </IonFooter>
      </IonModal>
    );
  };
}

export default ChangePasswordModal;
