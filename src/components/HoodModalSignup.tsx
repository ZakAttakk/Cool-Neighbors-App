import React from "react";
import {
  IonRow,
  IonCol,
  IonModal,
  IonButton,
  IonGrid,
  IonLabel,
  IonCheckbox,
  IonContent,
  IonFooter,
  isPlatform,
} from "@ionic/react";
import { neighborhoods } from "../data/hoods";
import unfoldArrow from "../theme/images/unfoldArrow.png";

const HoodModelSignup: React.FC<{
  showHoodModal: boolean;
  selectHoods: Function;
  city: string | null;
  selectedHoods: string[];
}> = (props) => {
  let hoodData: any;
  if (props.city) {
    hoodData = neighborhoods[props.city];
  } else {
    hoodData = neighborhoods["New York City / NY Metropolitan Area"];
  }

  let regions = [];
  if (hoodData) {
    regions = Object.keys(hoodData);
  }

  const unfold = (e) => {
    let node = e.currentTarget;
    const id = node.id;
    const hoodsToUnfold = document.getElementsByClassName(id);
    for (var i = 0; i < hoodsToUnfold.length; i++) {
      hoodsToUnfold[i].classList.toggle("ion-hide");
    }
    node.getElementsByTagName("img")[0].classList.toggle("arrowUnfolded");
  };

  // interface CityData {
  //   [key: string]: string[]
  // }
  // const allCityData: CityData = neighborhoods[city];

  return (
    <IonModal isOpen={props.showHoodModal} cssClass="modalClass">
      <IonContent className="hoodModalWrapper">
        <IonGrid>
          <div
            className={
              isPlatform("iphone")
                ? "iosModalHoodHeading"
                : "androidModalHoodHeading"
            }
          >
            Neighborhoods
          </div>
          <IonRow>
            <IonCol style={{ marginLeft: "10px" }}>
              {regions.map((region: string) => {
                var regionNoSpace = region.replace(/ /g, "");
                if (regions.indexOf(region) % 2 === 0) {
                  const hoods = hoodData[region];
                  return (
                    <div key={regionNoSpace} style={{ marginBottom: "10px" }}>
                      <div id={regionNoSpace} onClick={unfold}>
                        <span className="hoodModalSubHeading">{region}</span>
                        &nbsp;
                        <img className="unfoldArrow" src={unfoldArrow} />
                      </div>
                      {hoods.map((hood) => {
                        let checked: boolean;
                        props.selectedHoods.includes(hood)
                          ? (checked = true)
                          : (checked = false);

                        return (
                          <div
                            key={hood}
                            className={`${regionNoSpace} hoodItem ion-hide`}
                          >
                            <div className="hoodCheckboxDiv">
                              <IonCheckbox className="hoodCheckbox hoodOption" value={hood} checked={checked}/>
                            </div>
                            <IonLabel>
                              <span className="hoodLabel">{hood}</span>
                            </IonLabel>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
              })}
            </IonCol>
            <IonCol style={{ marginRight: "10px" }}>
              {regions.map((region: string) => {
                var regionNoSpace = region.replace(/ /g, "");
                if (regions.indexOf(region) % 2 === 1) {
                  const hoods = hoodData[region];
                  return (
                    <div key={regionNoSpace} style={{ marginBottom: "10px" }}>
                      <div id={regionNoSpace} onClick={unfold}>
                        <span className="hoodModalSubHeading">{region}</span>
                        &nbsp;
                        <img className="unfoldArrow" src={unfoldArrow} />
                      </div>
                      {hoods.map((hood) => {
                        let checked: boolean;
                        props.selectedHoods.includes(hood)
                          ? (checked = true)
                          : (checked = false);
                        return (
                          <div
                            key={hood}
                            className={`${regionNoSpace} hoodItem ion-hide`}
                          >
                            <div className="hoodCheckboxDiv">
                              <IonCheckbox className="hoodCheckbox hoodOption" value={hood} checked={checked}/>
                            </div>
                            <IonLabel>
                              <span className="hoodLabel">{hood}</span>
                            </IonLabel>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
              })}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter mode="ios" className="ion-text-center footerHeight">
        <IonRow>
          <IonCol className="ion-align-items-center">
            <IonButton style={{marginTop: '10px'}} onClick={() => props.selectHoods()}>
              Done
            </IonButton>
          </IonCol>
        </IonRow>
      </IonFooter>
    </IonModal>
  );
};

export default HoodModelSignup;
