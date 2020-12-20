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
} from "@ionic/react";

class CannotSend extends Component<
  { cannotSendModalOpen: boolean; toggleCannotSendModal: Function },
  any
> {
  constructor(props: any) {
    super(props);

    this.state = {
      message: "",
      sendingMessage: false,
    };
  }

  // textAreaChange = (e: any) => {
  //   let message = e.target.value;
  //   message = message.replace(/\ "/g, " “");
  //   this.setState({
  //     message: message,
  //   });
  // };

  componentDidMount = () => {};

  render() {
    const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    const inputClass = isPlatform("ios")
      ? "iosSignupInput"
      : "androidSignupInput";

    return (
      <IonModal isOpen={this.props.cannotSendModalOpen} cssClass="modalClass">
        <IonContent className="hoodModalWrapper all">
          <IonGrid>
            <IonRow>
              <IonCol className="ion-text-center">
                <div
                  style={{
                    fontSize: "14pt",
                    marginTop: "20px",
                    fontFamily: "Palanquin Regular, sans-serif",
                    padding: "18px"
                  }}
                >
                  Please confirm your email address before interacting with other users.
                  Check your inbox for a verification email from Cool Neighbors.
                </div>
                <IonButton
                  style={{ marginTop: "16px" }}
                  onClick={() => this.props.toggleCannotSendModal("resend")}
                  color="primary"
                >
                  Resend Verification Email
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
                onClick={() => this.props.toggleCannotSendModal("ok")}
                disabled={this.state.sendingMessage ? true : false}
              >
                OK
              </IonButton>
            </IonCol>
          </IonRow>
        </IonFooter>
      </IonModal>
    );
    // }
  }
}

export default CannotSend;
