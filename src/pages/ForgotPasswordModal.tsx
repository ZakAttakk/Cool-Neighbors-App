import React, { Component } from "react";
import {
  IonRow,
  IonCol,
  IonButton,
  IonGrid,
  IonContent,
  IonFooter,
  IonModal,
  IonAlert
} from "@ionic/react";
// import { auth } from "../fbConfig";
import firebase from "firebase/app";

class ForgotPasswordModal extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      email: "",
      pending: false,
      alertMessage: "",
      showAlert: false,
    }
  }

  handleChange = (e) => {
    var typedEmail = e.target.value;
    this.setState({
      email: typedEmail
    })
  }

  sendPassReset = () => {

    this.setState({
      pending: true
    })

    var emailAddress = this.state.email

    var auth = firebase.auth();

    auth.sendPasswordResetEmail(emailAddress).then(() => {

      this.setState({
        alertMessage: "Email sent.",
        showAlert: true,
        pending: false
      })

    }).catch(error => {
      this.setState({
        alertMessage: error,
        showAlert: true,
        pending: false
      })
    });
  }



  render = () => {
    // const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    // const inputClass = isPlatform("ios")
    //   ? "iosSignupInput"
    //   : "androidSignupInput";

    return (
      <IonModal
        isOpen={this.props.forgotPasswordModalOpen}
        cssClass="modalClass"
      >
        <IonContent className="hoodModalWrapper all">
          <IonGrid>
            <IonRow>
              <IonCol
                style={{ fontSize: "14pt", fontFamily: "Palanquin Regular" }}
                className="ion-text-center"
              >
                <div style={{ margin: "24px" }}>
                  Enter the email address that you used to sign-up.<br/>A
                  password-reset email will be sent to that email address.
                </div>

                <input
                  value={this.state.email}
                  className="changeEmailInput"
                  type="email"
                  placeholder="Email Address"
                  onChange={this.handleChange}
                />
                <br />
                <br />
                <IonButton
                  color="primary"
                  className="passReset"
                  onClick={this.sendPassReset}
                  disabled={this.state.pending ? true: false}
                >
                  {this.state.pending ? "Please wait..." : "SEND RESET EMAIL"} 
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonAlert
            isOpen={this.state.showAlert}
            onDidDismiss={() => {
              this.props.closeForgotPasswordModal();
            }}
            message={this.state.alertMessage}
            buttons={["OK"]}
            mode="ios"
          />

        </IonContent>

        <IonFooter mode="ios" className="ion-text-center footerHeight">
          <IonRow>
            <IonCol className="ion-align-items-center">
              <IonButton
                style={{ marginTop: "10px" }}
                color="tertiary"
                onClick={this.props.closeForgotPasswordModal}
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

export default ForgotPasswordModal;
