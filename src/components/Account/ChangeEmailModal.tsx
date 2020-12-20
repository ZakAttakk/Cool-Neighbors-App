import React, { Component } from "react";
import {
  IonText,
  IonRow,
  IonCol,
  IonButton,
  IonGrid,
  IonContent,
  IonFooter,
  isPlatform,
  IonModal,
} from "@ionic/react";

class ChangeEmailModal extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render = () => {
    // const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    // const inputClass = isPlatform("ios")
    //   ? "iosSignupInput"
    //   : "androidSignupInput";

    return (
      <IonModal isOpen={this.props.changeEmailModalOpen} cssClass="modalClass">
        <IonContent className="hoodModalWrapper all">
          <IonGrid>
            <IonRow>
              <IonCol style={{fontSize: "14pt", fontFamily: "Palanquin Regular"}} className="ion-text-center">

              <div style={{marginBottom: "10px", marginTop: "36px", lineHeight: "30px"}}>Type your <strong>current</strong> email address<br/> and password below.</div>

              <input value={this.props.accountPageState.currentEmail} onChange={this.props.handleChange} className="changeEmailInput" type="email" name="currentEmail" placeholder="Current Email"/><br/>

              <input value={this.props.accountPageState.currentPassword} onChange={this.props.handleChange} className="changeEmailInput" type="password" name="currentPassword" placeholder="Password"/>

              <div style={{marginBottom: "10px", marginTop: "19px"}}>Next, type your <strong>new</strong> email address.</div>

              <input value={this.props.accountPageState.newEmail} onChange={this.props.handleChange} className="changeEmailInput" type="email" name="newEmail" placeholder="New Email"/><br/>

              <input value={this.props.accountPageState.newEmailRepeat} onChange={this.props.handleChange} className="changeEmailInput" type="email" name="newEmailRepeat" placeholder="Repeat New Email"/><br/>


              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>

        <IonFooter mode="ios" className="ion-text-center footerHeight">
          <IonRow>
            <IonCol className="ion-align-items-center">
              <IonButton
                style={{ marginTop: "10px" }}
                color="primary"
                onClick={this.props.changeEmail}
                className="submitCancel"
              >
                SUBMIT
              </IonButton>
              </IonCol>
              <IonCol className="ion-align-items-center">
              <IonButton
                style={{ marginTop: "10px" }}
                color="tertiary"
                onClick={this.props.closeEmailModal}
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

export default ChangeEmailModal;
