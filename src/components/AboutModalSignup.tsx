import React, { useState } from "react";
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
import wordsCounter from 'word-counting';

const AboutModalSignup: React.FC<{
  showingAboutModal: boolean;
  aboutContent: string;
  textAreaChange: Function;
  setAboutModal: Function;
  about: string;
}> = (props) => {

  const [words, setWords] = useState(0);

  const textAreaChange = (e: any) => {
    let aboutText = e.target.value;
    aboutText = aboutText.replace(/\ "/g, " “");
    let w = wordsCounter(aboutText);
    setWords(w.wordsCount);
    props.textAreaChange(aboutText, w.wordsCount);
  };

  return (
    <IonModal isOpen={props.showingAboutModal} cssClass="modalClass">
      <IonContent className="hoodModalWrapper" scrollY={false}>
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
              <div className='wordCountLabel'>Words: {words}</div>
              <textarea
                value={props.about}
                onChange={textAreaChange}
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
            <IonButton onClick={() => props.setAboutModal(false)}>
              Done
            </IonButton>
          </IonCol>
        </IonRow>
      </IonFooter>
    </IonModal>
  );
};

export default AboutModalSignup;
