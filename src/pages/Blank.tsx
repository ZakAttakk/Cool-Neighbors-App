import React, { Component } from "react";
import { IonText, IonRow, IonCol } from "@ionic/react";

class Blank extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  
  render = () => {
    return (
      <IonRow className="firstFont">
        <IonCol>
          <IonText>
            
          </IonText>
        </IonCol>
      </IonRow>
    );
  }
}

export default Blank;
