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
  IonLabel,
  IonCheckbox,
} from "@ionic/react";

class FlagUserModal extends Component<
  { flagModalOpen: boolean; toggleFlagModal: Function },
  any
> {
  constructor(props: any) {
    super(props);

    this.state = {
      flagMessage: "",
      sendingFlag: false,
      sexual: false,
      hateful: false,
      selling: false,
    };
  }

  textAreaChange = (e: any) => {
    let message = e.target.value;
    message = message.replace(/\ "/g, " “");
    this.setState({
      flagMessage: message,
    });
    // props.textAreaChange(aboutText, w.wordsCount);
  };

  componentDidMount = () => {};

  render() {
    // console.log(this.state);
    const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    const inputClass = isPlatform("ios")
      ? "iosSignupInput"
      : "androidSignupInput";
    return (
      <IonModal isOpen={this.props.flagModalOpen} cssClass="modalClass">
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
              Flag User
            </div>
            <IonRow>
              <IonCol>
                <div className="flagCheckboxDiv">
                  <IonCheckbox
                    className="flag flagCheckbox"
                    id="flag1"
                    value="sexual"
                    onIonChange={() =>
                      this.setState({ sexual: !this.state.sexual })
                    }
                  />
                </div>
                <IonLabel className="flagLabel">
                  This user has sent or posted material that is date-seeking or
                  sexual in nature.
                </IonLabel>
                <div className="flagCheckboxDiv">
                  <IonCheckbox
                    className="flag flagCheckbox"
                    id="flag2"
                    value="hateful"
                    onIonChange={() =>
                      this.setState({ hateful: !this.state.hateful })
                    }
                  />
                </div>
                <IonLabel className="flagLabel">
                  This user has sent or posted words that are hateful or
                  extremely disrespectful.
                </IonLabel>
                <div className="flagCheckboxDiv">
                  <IonCheckbox
                    className="flag flagCheckbox"
                    id="flag3"
                    value="selling"
                    onIonChange={() =>
                      this.setState({ selling: !this.state.selling })
                    }
                  />
                </div>
                <IonLabel className="flagLabel">
                  This user is selling something.
                </IonLabel>

                <div
                  style={{
                    fontWeight: "bold",
                    marginLeft: "10px",
                    marginTop: "16px",
                  }}
                >
                  Additonal info:
                </div>
                <textarea
                  value={this.state.flagMessage}
                  onChange={this.textAreaChange}
                  id="modalFlagTextArea"
                  maxLength={2500}
                ></textarea>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
        <IonFooter
          mode="ios"
          className="ion-text-center"
          style={{ height: "150px" }}
        >
          <IonRow>
            <IonCol className="ion-align-items-center">
              <div style={{ fontSize: "10.5pt", marginLeft: "12px", marginRight: "12px", marginTop: "12px"}}>
                <strong>Note:</strong> Flagging a user also blocks that user from communicating with you.
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-align-items-center">
              <IonButton
                onClick={() => {
                  this.props.toggleFlagModal("send", this.state);
                  if (this.state.message !== "") {
                    this.setState({
                      flagMessage: "",
                      sendingFlag: true,
                    });
                  }
                }}
                disabled={this.state.sendingFlag ? true : false}
              >
                Send
              </IonButton>
            </IonCol>
            <IonCol className="ion-align-items-center">
              <IonButton
                onClick={() => this.props.toggleFlagModal("cancel")}
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

export default FlagUserModal;
