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
  IonRadioGroup,
  IonLabel,
  IonRadio,
} from "@ionic/react";
import { neighborhoods } from "../../data/hoods";

class SelectCity extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      selectedCity: ""
    }
  }

  changeCityHandler = (e: any) => {
    this.setState({
      selectedCity: e.target.value
    })
  }


  render() {
    const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    const inputClass = isPlatform("ios")
      ? "iosSignupInput"
      : "androidSignupInput";
      
    const cities = Object.keys(neighborhoods);

    return (
      <IonModal isOpen={this.props.selectingCity} cssClass="modalClass">
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
              City
            </div>
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
                            onClick={this.changeCityHandler}
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
              <IonButton
                style={{ marginTop: "10px" }}
                onClick={() => this.props.toggleSelectCity(this.state.selectedCity)}
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

export default SelectCity;
