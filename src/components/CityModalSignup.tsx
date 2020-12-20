import React, { useState } from "react";
import {
  IonRow,
  IonCol,
  IonModal,
  IonButton,
  IonGrid,
  IonRadioGroup,
  IonRadio,
  IonLabel,
  IonContent,
  IonFooter,
  isPlatform,
} from "@ionic/react";
import { neighborhoods } from "../data/hoods";

const CitySignupModal: React.FC<{
  showCityModal: boolean;
  selectCity: Function;
}> = (props) => {
  const cities = Object.keys(neighborhoods);

  return (
    <IonModal isOpen={props.showCityModal} cssClass="modalClass">
      <IonContent className="modalWrapper">
        <div
          className={
            isPlatform("iphone") ? "iosModalHeading" : "androidModalHeading"
          }
        >
          City
        </div>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonRadioGroup>
                {cities.map((city) => {
                  return (
                    <div key={city} className="cityOptions">
                      <div className="cityCheckboxDiv">
                        <IonRadio
                          className="cityRadio cityOption"
                          value={city}
                          mode="md"
                        />
                      </div>
                      <IonLabel>
                        <span className="cityLabel">{city}</span>
                      </IonLabel>
                    </div>
                  );
                })}
              </IonRadioGroup>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter mode="ios" className="ion-text-center footerHeight">
        <IonRow>
          <IonCol className="ion-align-items-center">
            <IonButton style={{marginTop: '10px'}} onClick={() => props.selectCity(false)}>Done</IonButton>
          </IonCol>
        </IonRow>
      </IonFooter>
    </IonModal>
  );
};

export default CitySignupModal;
