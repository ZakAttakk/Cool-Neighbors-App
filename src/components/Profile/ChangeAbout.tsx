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
import wordsCounter from "word-counting";

class ChangeAbout extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      words: null,
      aboutText: "",
    };
  }

  textAreaChange = (e: any) => {
    let aboutText = e.target.value;
    aboutText = aboutText.replace(/\ "/g, " “");
    let w = wordsCounter(aboutText);
    this.setState({
      words: w.wordsCount,
      aboutText: aboutText
    });
    // props.textAreaChange(aboutText, w.wordsCount);
  };

  componentDidUpdate = () => {
    if (Object.keys(this.props.userData).length > 0 && this.state.words === null) {
      let w = wordsCounter(this.props.userData.about);
      // console.log(w);
      this.setState({
        words: w.wordsCount,
        aboutText: this.props.userData.about
      });
    }
  };

  render() {
    const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    const inputClass = isPlatform("ios")
      ? "iosSignupInput"
      : "androidSignupInput";
    if (Object.keys(this.props.userData).length < 1) {
      return <div></div>;
    } else {
      // console.log(this.state.words)
      return (
        <IonModal isOpen={this.props.editingAbout} cssClass="modalClass">

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
                About
              </div>
              <IonRow>
                <IonCol>
                  <div className="wordCountLabel">
                    Words: {this.state.words}
                  </div>
                  <textarea
                    value={this.state.aboutText}
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
                  onClick={() => this.props.toggleChangeAbout(this.state.words, this.state.aboutText)}
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
}

export default ChangeAbout;
