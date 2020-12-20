import React, { Component } from "react";
import {
  IonText,
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  isPlatform,
  IonImg,
  IonButton,
  IonAlert,
  IonGrid
} from "@ionic/react";
import windows from "../theme/building.jpg";
import { Redirect } from "react-router";
import { auth } from "../fbConfig";
// import { Plugins } from "@capacitor/core";
import ForgotPasswordModal from "./ForgotPasswordModal";

// const { Storage } = Plugins;

// interface State {
//   email: string;
//   password: string;
// }

class Signin extends Component<
  {
    setMenuDisabled: Function;
    menuDisabled: boolean;
    loggedIn: boolean;
    setLoggedIn: Function;
  },
  any
> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      password: "",
      alertMessage: "",
      showAlert: false,
      forgotPasswordModalOpen: false
    };

  }

  getInputs = (e: any) => {
    const id = e.target.id;
    this.setState({ [id]: e.target.value });
  };

  signIn = () => {
    auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((cred) => {
        // Storage.set({
        //   key: "cred",
        //   value: JSON.stringify({
        //     cred,
        //   }),
        // }).then(() => {
          this.props.setLoggedIn(true);
          // this.props.connectCurrentUser();
          console.log("You are logged in.");
        // });
      })
      .catch((err) => {
        this.setState({
          alertMessage: err,
          showAlert: true
        })
      });
  };

  openForgotPasswordModal = () => {
    this.setState({
      forgotPasswordModalOpen: true,
    });
  }

  closeForgotPasswordModal = () => {
    this.setState({
      forgotPasswordModalOpen: false,
    });
  }



  render() {
    // console.log(this.state);
    const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    const inputClass = isPlatform("ios")
      ? "iosSignupInput"
      : "androidSignupInput";

    if (this.props.loggedIn) {
      return <Redirect from="/signin" to="/profile" />;
    } else {
      return (
        <IonGrid>
        <IonRow className="firstFont">
          <IonAlert
            isOpen={this.state.showAlert}
            onDidDismiss={() => this.setState({showAlert: false})}
            message={this.state.alertMessage}
            buttons={["OK"]}
            mode="ios"
          />

          <IonCol>
            <IonImg src={windows} className="frontImg" />
            <IonText className="signupHeading">Sign In</IonText>
            <IonItem className={itemClass} mode="ios">
              <IonInput
                id="email"
                type="email"
                placeholder="Email"
                className={inputClass}
                onIonChange={this.getInputs}
              ></IonInput>
            </IonItem>
            <IonItem className={itemClass} mode="ios">
              <IonInput
                id="password"
                type="password"
                placeholder="Password"
                className={inputClass}
                onIonChange={this.getInputs}
              ></IonInput>
            </IonItem>
            <div
              className={
                isPlatform("ios")
                  ? "iosForgotPassword"
                  : "androidForgotPassword"
              }
            >
              <IonText 
              onClick={this.openForgotPasswordModal}
              color="primary">Forgot Password?</IonText>
            </div>

            <br />
            <IonButton
              style={{ marginRight: "12px" }}
              className="sideButton ion-float-right"
              disabled={this.props.menuDisabled ? true : false}
              onClick={this.signIn}
            >
              Sign In
            </IonButton>
            <br />
            <br />
            <br />
            <br />

              <ForgotPasswordModal
              forgotPasswordModalOpen={this.state.forgotPasswordModalOpen}
              
              closeForgotPasswordModal={this.closeForgotPasswordModal}
              ></ForgotPasswordModal>

          </IonCol>
        </IonRow>
        </IonGrid>
      );
    }
  }
}

export default Signin;
