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

class SendMessageUser extends Component<
  { messageModalOpen: boolean; toggleMessageModal: Function },
  any
> {
  constructor(props: any) {
    super(props);

    this.state = {
      message: "",
      sendingMessage: false
    };
  }

  textAreaChange = (e: any) => {
    let message = e.target.value;
    message = message.replace(/\ "/g, " “");
    this.setState({
      message: message,
    });
    // props.textAreaChange(aboutText, w.wordsCount);
  };

  componentDidMount = () => {

  };

  render() {
    const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    const inputClass = isPlatform("ios")
      ? "iosSignupInput"
      : "androidSignupInput";
    // if (Object.keys(this.props.userData).length < 1) {
    //   return <div></div>;
    // } else {
    // console.log(this.state.aboutText)
    return (
      <IonModal isOpen={this.props.messageModalOpen} cssClass="modalClass">
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
              Message
            </div>
            <IonRow>
              <IonCol>
                {/* <div className="wordCountLabel">Words: {this.state.words}</div> */}
                <textarea
                  value={this.state.message}
                  onChange={this.textAreaChange}
                  id="modalAboutTextArea"
                  maxLength={2500}
                ></textarea>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
        <IonFooter mode="ios" className="ion-text-center footerHeight">
          <IonRow>
            <IonCol className="ion-align-items-center">
              <IonButton
                style={{ marginTop: "10px" }}
                onClick={() => {
                  this.props.toggleMessageModal(this.state.message);
                  if (this.state.message !== ""){
                    this.setState({
                      message: "",
                      sendingMessage: true
                    });
                  }
                }}
                disabled={this.state.sendingMessage ? true : false}
              >
                Send
              </IonButton>
            </IonCol>
            <IonCol className="ion-align-items-center">
              <IonButton
                style={{ marginTop: "10px" }}
                onClick={() => this.props.toggleMessageModal("cancel")}
                color="tertiary"
              >
                Cancel
              </IonButton>
            </IonCol>
          </IonRow>
        </IonFooter>
      </IonModal>
    );
    // }
  }
}

export default SendMessageUser;
