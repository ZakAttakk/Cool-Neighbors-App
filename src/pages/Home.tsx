import React, { Component } from "react";
import { IonImg, IonCol, IonRow, IonButton, IonMenuToggle, IonList, IonListHeader, IonLabel, IonItem, IonText, IonGrid } from "@ionic/react";
import homeImage from "../theme/neighborhood.jpg";

class Home extends Component<any, any> {
  constructor(props: any) {
    super(props);

    // this.sideMenuRef = React.createRef();
  }

  componentDidMount = () => {
    // const sideMenuRef = React.createRef();
    // const sideMenu = sideMenuRef.current;
    // sideMenu.open();
    
    // const menu = document.querySelector("#menuButton");
    // console.log(menu)
    // menu.click()

  }
  componentDidUpdate = () => {
  //   // const sideMenuRef = React.createRef();
  //   // const sideMenu = sideMenuRef.current;
  //   // sideMenu.open();
    
  //   const menu = document.querySelector("menuButton");
  //   console.log(menu)
  //   // menu.click();

  }

  render() {
    const { notifications } = this.props.appState;
    return (
      <IonGrid>
      <IonRow className="firstFont">
        <IonCol>
          <IonImg src={homeImage} className="frontImg" />
          <p style={{paddingLeft: "5px", paddingRight: "6px"}}>
            Cool Neighbors is a friendship app, not a dating app.&ensp;It's a
            place to safely and easily meet new people in your neighborhood and
            your city.&ensp;And it's totally free.
          </p>{" "}
          <div className="ion-text-center">
          <IonMenuToggle><IonButton className="getStarted">Get Started</IonButton></IonMenuToggle>
          </div><br /><br /><br />
          
          {/* <IonList>
            <IonListHeader>
              <IonLabel> Notifications</IonLabel>
            </IonListHeader>
            {notifications && notifications.map((notif: any) =>
              <IonItem key={notif.id}>
                <IonLabel>
                  <IonText>
                    <h3>{notif.title}</h3>
                  </IonText>
                  <p>{notif.body}</p>
                </IonLabel>
              </IonItem>
            )}
          </IonList>
          <IonButton expand="full" >Register for Push</IonButton> */}
          
          <br /><br />
        </IonCol>
      </IonRow>
      </IonGrid>
    );
  }
}

export default Home;
