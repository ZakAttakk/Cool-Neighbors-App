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

class DeleteAccountModal extends Component<any, any> {
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
        isOpen={this.props.deleteAccountModalOpen}
        cssClass="modalClass"
      >
        <IonContent className="hoodModalWrapper all">
          <IonGrid>
            <IonRow>
              <IonCol
                style={{ fontSize: "14pt", fontFamily: "Palanquin Regular" }}
                className="ion-text-center"
              >
                <div style={{ margin: "24px", marginTop: "50px" }}>
                  Type your email address and password below.
                </div>

                <input
                  value={this.props.accountPageState.deleteEmail}
                  onChange={this.props.handleChange}
                  className="changeEmailInput"
                  type="email"
                  name="deleteEmail"
                  placeholder="Email"
                />
                <br />

                <input
                  value={this.props.accountPageState.deletePassword}
                  onChange={this.props.handleChange}
                  className="changeEmailInput"
                  type="password"
                  name="deletePassword"
                  placeholder="Password"
                />
                <br /><br />
                <IonButton
                  color="primary"
                  className="passReset"
                  onClick={this.props.reauthenticateForDelete}
                >
                  DELETE ACCOUNT
                </IonButton>
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
                onClick={this.props.closeDeleteAccountModal}
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

export default DeleteAccountModal;
