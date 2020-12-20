import React, { Component } from "react";
import { IonRow, IonCol, IonButton, IonAlert, IonToggle, IonGrid } from "@ionic/react";
import { Redirect } from "react-router";
import { db, auth, functions } from "../fbConfig";
import ChangeEmailModal from "../components/Account/ChangeEmailModal";
import firebase from "firebase/app";
import ChangePasswordModal from "../components/Account/ChangePasswordModal";
import DeleteAccountModal from "../components/Account/DeleteAccountModal";

class Account extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentEmail: "",
      currentPassword: "",
      newEmail: "",
      displayedEmail: "",
      changeEmailPending: false,
      changePasswordPending: false,
      deleteEmail: "",
      deletePassword: "",
      changeEmailModalOpen: false,
      changePasswordModalOpen: false,
      newEmailRepeat: "",
      showAlert: false,
      alertMessage: "",
      showPasswordChangeAlert: false,
      deleteAccountModalOpen: false,
    };
  }

  improvedSendVerificationEmail = functions.httpsCallable(
    "improvedSendVerificationEmail"
  );

  componentDidMount = () => {
    if (!this.props.appState.loggedIn) {
      this.setState({
        displayedEmail: "",
      });
    } else {
      this.setState({
        displayedEmail: this.props.appState.user.email,
      });
    }
    console.log(this.props.appState);
  };

  componentDidUpdate = () => {
    if (this.state.displayedEmail === "" && this.props.appState.loggedIn) {
      this.setState({
        displayedEmail: this.props.appState.user.email,
      });
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  openEmailModal = () => {
    this.setState({
      changeEmailModalOpen: true,
    });
  };

  closeEmailModal = () => {
    this.setState({
      changeEmailModalOpen: false,
    });
  };

  changeEmail = () => {
    if (this.state.newEmail !== this.state.newEmailRepeat) {
      this.setState({
        showAlert: true,
        alertMessage: "Your new email entries do no match.",
      });
    } else if (this.state.newEmail !== "") {
      var user = auth.currentUser;

      var newEmail = this.state.newEmail;
      var credentials = firebase.auth.EmailAuthProvider.credential(
        this.state.currentEmail,
        this.state.currentPassword
      );

      this.setState({
        changeEmailPending: true,
        changeEmailModalOpen: false,
      });

      user
        .reauthenticateWithCredential(credentials)
        .then(() => {
          console.log("User re-authenticated.");

          user
            .updateEmail(this.state.newEmail)
            .then(() => {
              console.log("Email updated.");
              var emailVerifyCode = Math.floor(Math.random() * 1000000);

              var newEmailCode = {
                confirmed: false,
                code: emailVerifyCode,
              };

              db.collection("confirmedEmails")
                .doc(this.props.appState.userData.uid)
                .set(newEmailCode, { merge: true })
                .then(() => {
                  console.log("New email added to confirm list.");
                  this.improvedSendVerificationEmail({
                    emailAddress: newEmail,
                    emailVerifyCode: emailVerifyCode,
                    firstName: this.props.appState.userData.firstName,
                    uid: this.props.appState.userData.uid,
                  })
                    .then(() => {
                      console.log("Verification email sent.");

                      var emailVerified = {
                        emailVerified: false,
                        emailVerifyCode: emailVerifyCode,
                      };
                      let usersRef = db
                        .collection("userData")
                        .doc(this.props.appState.user.uid);
                      usersRef.update(emailVerified).then(() => {
                        console.log("Email verified boolean set to false.");

                        this.setState({
                          currentEmail: "",
                          currentPassword: "",
                          newEmail: "",
                          displayedEmail: newEmail,
                          changeEmailPending: false,
                          showAlert: true,
                          alertMessage:
                            "Updated! Check your inbox to confirm your new address.",
                        });
                      });
                    })
                    .catch((error) => {
                      console.log(error);

                      this.setState({
                        showAlert: true,
                        alertMessage: error,
                      });

                      this.setState({
                        changeEmailPending: false,
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  this.setState({
                    showAlert: true,
                    alertMessage: error,
                  });
                  this.setState({
                    changeEmailPending: false,
                  });
                });
            })
            .catch((error) => {
              console.log(error);
              this.setState({
                showAlert: true,
                alertMessage: error,
              });
              this.setState({
                changeEmailPending: false,
              });
            });
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            showAlert: true,
            alertMessage: error,
          });
          this.setState({
            changeEmailPending: false,
          });
        });
    }
  };

  openPasswordModal = () => {
    this.setState({
      changePasswordModalOpen: true,
    });
  };

  closePasswordModal = () => {
    this.setState({
      changePasswordModalOpen: false,
    });
  };

  changePassword = () => {
    this.setState({
      changePasswordPending: true,
    });

    var auth = firebase.auth();

    auth
      .sendPasswordResetEmail(this.props.appState.user.email)
      .then(() => {
        this.setState({
          changePasswordPending: false,
        });

        this.setState({
          showPasswordChangeAlert: true,
          alertMessage: "Email sent.  You will now be logged out.",
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          changePasswordPending: false,
        });
      });
  };

  switchChange = (e) => {
    var notificationSetting = {
      receiveNotifications: e.target.checked,
    };
    let usersRef = db.collection("userData").doc(this.props.appState.user.uid);
    usersRef.update(notificationSetting);
  };

  openDeleteAccountModal = () => {
    this.setState({
      deleteAccountModalOpen: true,
    });
  };

  closeDeleteAccountModal = () => {
    this.setState({
      deleteAccountModalOpen: false,
    });
  };

  reauthenticateForDelete = () => {
    var user = auth.currentUser;

    var credentials = firebase.auth.EmailAuthProvider.credential(
      this.state.deleteEmail,
      this.state.deletePassword
    );

    user
      .reauthenticateWithCredential(credentials)
      .then(() => {
        console.log("User re-authenticated.");
        this.deleteAccount();
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          showAlert: true,
          alertMessage: error,
        });
      });
  };

  deleteAccount = () => {
    var deleted = {
      accountDeleted: true,
      notificationTokens: [],
    };

    let usersRef = db.collection("userData").doc(this.props.appState.user.uid);
    usersRef.update(deleted).then(() => {
      console.log("About to delete...");
      this.props.appState.connectOnOff();
      this.props.appState.connectMailboxOneOnOff();
      this.props.appState.connectMailboxTwoOnOff();

      var user = auth.currentUser;

      user
        .delete()
        .then((result) => {
          this.props.setLoggedIn(false); // add to android
          alert("Your account has been deleted.");
        })
        .catch((error) => {
          this.setState({
            showAlert: true,
            alertMessage: error,
          });
          console.log(error);
        });
    });
  };

  render = () => {
    if (this.props.appState.loggedIn === null) {
      return <span></span>;
    } else if (this.props.appState.loggedIn === false) {
      return <Redirect from="/account" to="/" />;
    } else {
      var userData = this.props.appState.userData;
      var changeEmailButton: any;
      var changePasswordButton: any;

      if (this.state.changeEmailPending) {
        changeEmailButton = (
          <IonButton disabled={true} color="primary" className="accountButton">
            Please wait...
          </IonButton>
        );
      } else {
        changeEmailButton = (
          <IonButton
            onClick={() => this.openEmailModal()}
            className="accountButton"
            color="primary"
            disabled={false}
          >
            Change Email Address
          </IonButton>
        );
      }
      if (this.state.changePasswordPending) {
        changePasswordButton = (
          <IonButton color="primary" disabled={true} className="accountButton">
            Please wait...
          </IonButton>
        );
      } else {
        changePasswordButton = (
          <IonButton
            onClick={() => this.openPasswordModal()}
            className="accountButton"
            color="primary"
            disabled={false}
          >
            Change Password
          </IonButton>
        );
      }

      return (
        <IonGrid>
        <IonRow className="firstFont">
          <IonCol>
            <div className="accountHeading">Account</div>
            <div style={{ marginLeft: "14px" }}>
              <div>You are currently logged in as:</div>

              <div
                style={{
                  marginTop: "10px",
                  marginBottom: "20px",
                  fontFamily: "Palanquin SemiBold",
                }}
              >
                {this.state.displayedEmail}
              </div>

              {changeEmailButton}
              <br />

              {changePasswordButton}
              <br />
              <div
                style={{
                  marginTop: "18px",
                  marginBottom: "50px",
                  display: "inline-block",
                }}
              >
                Email Notifications:&emsp;
              </div>

              <div style={{ display: "inline-block", verticalAlign: "-8px" }}>
                <IonToggle
                  onIonChange={this.switchChange}
                  checked={userData.receiveNotifications ? true : false}
                ></IonToggle>
              </div>
              <br />
              <IonButton
                onClick={() => this.openDeleteAccountModal()}
                className="accountButton"
                color="primary"
                disabled={false}
              >
                Delete Account
              </IonButton>
            </div>
          </IonCol>

          <ChangeEmailModal
            changeEmailModalOpen={this.state.changeEmailModalOpen}
            openEmailModal={this.openEmailModal}
            closeEmailModal={this.closeEmailModal}
            changeEmail={this.changeEmail}
            accountPageState={this.state}
            handleChange={this.handleChange}
          />

          <ChangePasswordModal
            changePasswordModalOpen={this.state.changePasswordModalOpen}
            openPasswordModal={this.openPasswordModal}
            closePasswordModal={this.closePasswordModal}
            changePassword={this.changePassword}
            accountPageState={this.state}
            handleChange={this.handleChange}
          />

          <DeleteAccountModal
            deleteAccountModalOpen={this.state.deleteAccountModalOpen}
            closeDeleteAccountModal={this.closeDeleteAccountModal}
            reauthenticateForDelete={this.reauthenticateForDelete}
            accountPageState={this.state}
            handleChange={this.handleChange}
          ></DeleteAccountModal>

          <IonAlert
            isOpen={this.state.showAlert}
            onDidDismiss={() => this.setState({ showAlert: false })}
            message={this.state.alertMessage}
            buttons={["OK"]}
            mode="ios"
          />

          <IonAlert
            isOpen={this.state.showPasswordChangeAlert}
            onDidDismiss={() => {
              this.setState({ showAlert: false });
              this.props.logOut();
            }}
            message={this.state.alertMessage}
            buttons={["OK"]}
            mode="ios"
          />
        </IonRow>
        </IonGrid>
      );
    }
  };
}

export default Account;
