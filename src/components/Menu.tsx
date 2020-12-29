import React, { useRef } from "react";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonContent,
  IonMenu,
  IonButton,
  IonMenuToggle,
  isPlatform,
} from "@ionic/react";
// import { menu, mailOutline } from "ionicons/icons";
import menu from "../theme/menu.png";
import menuMail from "../theme/menuMail.png";

const Menu: React.FC<{
  menuDisabled: boolean;
  loggedIn: boolean;
  logOut: Function;
  unreadMessages: boolean;
  ionMenuScrollBug: Function;
  ionMenuScrollBugFix: Function;
}> = (props) => {
  const sideMenuRef = useRef<HTMLIonMenuElement>(null);

  const openMenu = () => {
    const sideMenu = sideMenuRef.current;
    console.log("open")
    sideMenu?.open();
  };

  let menuContent: any;

  // if (props.clickMenu) {
  //   const sideMenu = sideMenuRef.current;
  //   sideMenu?.open();
  // }



  if (props.loggedIn) {
    menuContent = (
      <IonMenuToggle>
        <br/>
        <IonButton
          routerLink="/profile"
          className="sideButton"
          color="primary"
          disabled={false}
        >
          Profile
        </IonButton>
        <br />
        <IonButton
          color="primary"
          routerLink="/search"
          className="sideButton"
          disabled={false}
        >
          Search
        </IonButton>
        <br />
        <IonButton
          routerLink="/now"
          color="secondary"
          className="sideButton"
          disabled={false}
        >
          Now
        </IonButton>
        <br />
        <IonButton
          color="primary"
          routerLink="/messages"
          className="sideButton"
          disabled={false}
        >
          Messages
        </IonButton>
        <br />
        <IonButton
          color="primary"
          routerLink="/account"
          className="sideButton"
          disabled={false}
        >
          Account
        </IonButton>
        <br />
        <IonButton
          color="primary"
          className="sideButton"
          disabled={false}
          onClick={() => props.logOut()}
        >
          Logout
        </IonButton>
      </IonMenuToggle>
    );
  } else {
    menuContent = (
      <IonMenuToggle>
        <IonButton
          color="primary"
          routerLink="/signup"
          className="sideButton"
          disabled={false}
        >
          Sign-up
        </IonButton>
        <br />
        <IonButton
          color="primary"
          routerLink="/signin"
          className="sideButton"
          disabled={false}
        >
          Sign-in
        </IonButton>
        <br />
        <IonButton
          color="primary"
          routerLink="/search"
          className="sideButton"
          disabled={false}
        >
          Search
        </IonButton>
        <br />
        <IonButton
          routerLink="/now"
          color="secondary"
          className="sideButton"
          disabled={false}
        >
          Now
        </IonButton>
        <br />
        <IonButton
          routerLink="/profile"
          color="medium"
          className="sideButton"
          disabled={true}
        >
          Profile
        </IonButton>
        <br />
        <IonButton
          routerLink="/messages"
          color="medium"
          className="sideButton"
          disabled={true}
        >
          Messages
        </IonButton>
        <br />
        <IonButton
          routerLink="/account"
          color="medium"
          className="sideButton"
          disabled={true}
        >
          Account
        </IonButton>
      </IonMenuToggle>
    );
  }

  return (
    <React.Fragment>
      <IonFab
        className={props.menuDisabled ? "ion-hide" : ""}
        vertical="top"
        horizontal="start"
        slot="fixed"
      >
        <IonFabButton
          onClick={openMenu}
          size="small"
          id="menuButton"
          color="light"
          className={isPlatform("iphone") ? "iosFabMargin" : "androidFabMargin"}
        >
          <img src={ props.unreadMessages ? menuMail : menu} />
        </IonFabButton>
      </IonFab>
      <IonMenu
        id="sideMenu"
        ref={sideMenuRef}
        contentId="main"
        max-edge-start="0"
        onIonDidClose={() => props.ionMenuScrollBugFix()}
        onIonDidOpen={() => props.ionMenuScrollBug()}
      >
        <IonContent className="ion-text-center sideMenuContent">
          <br />
          <br /><br />
          {isPlatform("ios") ? <br /> : null}
          
          {menuContent}
        </IonContent>
      </IonMenu>
    </React.Fragment>
  );
};

export default Menu;
