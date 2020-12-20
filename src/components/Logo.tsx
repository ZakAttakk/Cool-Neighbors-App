import React from "react";
import logo from "../theme/logo.svg";
import { IonRow, IonCol, isPlatform, IonRouterLink } from "@ionic/react";

const Logo: React.FC = (props) => {
  return (
    <IonRow className="ion-text-right">
      <IonCol>
      <IonRouterLink routerLink="/">
        <img
          className={isPlatform("iphone") ? "iosLogo" : "androidLogo"}
          id="logo"
          src={logo}
          alt="Cool Neighbors Logo"
        />
        </IonRouterLink>
      </IonCol>
    </IonRow>
  );
};

export default Logo;
