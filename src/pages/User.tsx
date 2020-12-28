import React, { Component } from "react";
import {
  IonRow,
  IonCol,
  IonButton,
  IonAlert,
  IonIcon,
  IonFabButton,
  IonRouterLink,
  IonFab,
  IonImg,
  IonGrid,
  IonContent,
} from "@ionic/react";
import { db, functions } from "../fbConfig";
import blank from "../theme/blankPic.png";
import SendMessageUser from "../components/User/SendMessageUser";
import FlagUserModal from "../components/User/FlagUserModal";
import CannotSend from "../components/User/CannotSend";
import { arrowBackOutline } from "ionicons/icons";
import { Redirect } from "react-router";
// import arrow from "../theme/arrow.svg";

class User extends Component<
  {
    appState: any;
    sendNotification: Function;
    improvedCheckEmailVerification: Function;
    sendPush: Function;
  },
  any
> {
  constructor(props: any) {
    super(props);

    this.state = {
      otherUserData: "",
      messageModalOpen: false,
      messageSent: false,
      flagModalOpen: false,
      showAlert: false,
      alertMessage: "",
      verifyingEmailAddress: false,
      cannotSendModalOpen: false,
      fromSearch: false,
      correspondenceSent: "",
    };
  }

  getServerTimestamp = functions.httpsCallable("getServerTimestamp");

  // BELOW FUNCTION NOW COMES FROM PROPS
  // checkEmailVerification = functions.httpsCallable("checkEmailVerification");

  improvedSendVerificationEmail = functions.httpsCallable(
    "improvedSendVerificationEmail"
  );
  // sendVerificationEmail = functions.httpsCallable("sendVerificationEmail");

  componentDidMount = () => {
    const path = window.location.pathname;
    const n = path.lastIndexOf("/");
    const otherUserId = path.substring(n + 1);
    const loc = window.location.href;
    var s = loc.substring(loc.indexOf("?") + 1);
    let search = false;
    let post = false
    if (s === "search") {
      search = true;
    }
    if (s === "post"){
      post = true;
    }
    console.log(s)
    const userRef = db.collection("userData").doc(otherUserId);
    userRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({
            otherUserData: doc.data(),
            fromSearch: search,
            fromPost: post
          });
        } else {
          this.setState({
            otherUserData: "User not found.",
            fromSearch: search,
            fromPost: post
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    var content = document.getElementById("main");
    content.scrollTo(0, 0);

    this.getServerTimestamp().then((result) => {
      var d = new Date(result.data);
      var hours = d.getHours();
      var minutes = d.getMinutes();
      var timeStamp = result.data / 1000;
      var secondsSinceMidnight = (hours * 60 + minutes) * 60;

      var lateNight = false;
      if (hours < 4) {
        lateNight = true;
      }

      if (!lateNight) {
        var secondsSince4am = secondsSinceMidnight - 14400;
        var timestampAt4am = timeStamp - secondsSince4am;
        var milliTimestampAt4am = timestampAt4am * 1000;
        this.setState({
          cutoffTimeStamp: milliTimestampAt4am,
        });
      } else {
        var secondsSince4amYesterday = secondsSinceMidnight + 72000;
        var timeStamp4amYesterday = timeStamp - secondsSince4amYesterday;
        var milliTimestamp4amYesterday = timeStamp4amYesterday * 1000;
        this.setState({
          cutoffTimeStamp: milliTimestamp4amYesterday,
        });
      }
      // this.setState({
      //   serverTimeStamp: result.data
      // })
    });

  };

  componentDidUpdate = () => {
    // const backArrow = document.getElementById("backToSearch");
    // if (backArrow) {
    //   backArrow.style.top = (window.innerHeight - 70).toString() + "px";
    //   backArrow.style.right = "20px"
    // }
  };

  toggleCannotSendModal = (action: string) => {
    if (action === "ok") {
      this.setState({
        cannotSendModalOpen: false,
      });
    }
    if (action === "open") {
      this.setState({
        cannotSendModalOpen: true,
      });
    } else if (action === "resend") {
      console.log("--------");
      let code = this.props.appState.userData.emailVerifyCode;
      code = code.toString();
      this.improvedSendVerificationEmail({
        emailAddress: this.props.appState.user.email,
        emailVerifyCode: code,
        firstName: this.props.appState.userData.firstName,
        uid: this.props.appState.userData.uid,
      }).then((result) => {
        console.log("Confirmation email sent.");
        console.log(result);
        this.setState({
          showAlert: true,
          alertMessage: "Confirmation email sent.",
        });
      });
    }
    this.setState({
      cannotSendModalOpen: false,
    });
  };

  toggleMessageModal = (action: string) => {
    if (action === "cancel") {
      this.setState({
        messageModalOpen: !this.state.messageModalOpen,
      });
    } else if (action === "open") {
      if (
        this.props.appState.userData.flagged.includes(
          this.state.otherUserData.uid
        )
      ) {
        this.setState({
          showAlert: true,
          alertMessage: "You've flagged this user.",
        });
      } else if (
        this.state.otherUserData.flagged.includes(
          this.props.appState.userData.uid
        )
      ) {
        this.setState({
          showAlert: true,
          alertMessage: "This user has flagged you.",
        });
      } else if (!this.props.appState.userData.emailVerified) {
        this.setState({
          verifyingEmailAddress: true,
        });

        this.props
          .improvedCheckEmailVerification(this.props.appState.userData.uid)
          .then((emailVerification: boolean) => {
            if (emailVerification === true) {
              console.log("Email verified!");
              var emailVerified = {
                emailVerified: true,
              };
              let usersRef = db
                .collection("userData")
                .doc(this.props.appState.user.uid);
              usersRef.update(emailVerified).then(() => {
                this.setState({
                  messageModalOpen: true,
                  verifyingEmailAddress: false,
                });
              });
            } else {
              console.log(emailVerification);
              this.setState({
                cannotSendModalOpen: true,
                verifyingEmailAddress: false,
              });
            }
          })
          .catch((err) => console.log(err));
      } else {
        this.setState({
          messageModalOpen: !this.state.messageModalOpen,
        });
      }
    } else {
      // console.log(action);
      if (action !== "") {
        const message = action;
        const receiverId = this.state.otherUserData.uid;
        const senderId = this.props.appState.user.uid;
        console.log(receiverId, senderId);

        const rAnds = receiverId + " and " + senderId;
        const sAndr = senderId + " and " + receiverId;

        let listOfCorrespondences = [];
        let listOfCorrespondenceMoreData = [];

        this.props.appState.mailbox.forEach((convo) => {
          listOfCorrespondences.push(convo[0].correspondence);
          // BELOW MAKES LIST OF 0:correspondence ID, 1:highestTimestamp, 2: receiver of most recent message - used later to figure out if notification should be sent
          listOfCorrespondenceMoreData.push([
            convo[0].correspondence,
            convo[1],
            convo[2],
          ]);
        });

        var firstCheck = listOfCorrespondences.includes(rAnds);
        var secondCheck = listOfCorrespondences.includes(sAndr);

        var extraConvoData: any;

        if (firstCheck && !secondCheck) {
          console.log("Correspondence found! (First check.)");

          listOfCorrespondenceMoreData.forEach((item) => {
            if (item[0] === rAnds) {
              extraConvoData = item;
            }
          });

          this.postMessage(
            message,
            rAnds,
            receiverId,
            senderId,
            "old",
            extraConvoData
          );
        } else if (!firstCheck && secondCheck) {
          console.log("Correspondence found! (Second check.)");

          listOfCorrespondenceMoreData.forEach((item) => {
            if (item[0] === sAndr) {
              extraConvoData = item;
            }
          });

          this.postMessage(
            message,
            sAndr,
            receiverId,
            senderId,
            "old",
            extraConvoData
          );
        } else {
          console.log("Correspondence not found!");
          this.postMessage(message, sAndr, receiverId, senderId, "new");
        }
      }
    }
  };

  postMessage = (
    message: string,
    correspondence: string,
    receiverId: string,
    senderId: string,
    oldNew: string,
    extraConvoData: string = undefined
  ) => {
    var messagesRef = db.collection("messages");
    var correspondenceRef = messagesRef.doc(correspondence);

    var timeStamp: any;

    this.getServerTimestamp().then((result) => {
      timeStamp = result.data;
      var timeStampKey = timeStamp + "-" + senderId;

      if (oldNew === "new") {
        correspondenceRef
          .set({
            correspondentOne: senderId,
            correspondentTwo: receiverId,
            correspondence: correspondence,
            lastMessageTime: timeStamp,
            data: {
              [timeStampKey]: {
                message,
                test: "test",
                sender: senderId,
                receiver: receiverId,
                senderName: this.props.appState.userData.firstName,
                receiverName: this.state.otherUserData.firstName,
                timeStamp: timeStamp,
                readBySender: true,
                readByReceiver: false,
              },
            },
          })
          .then(() => {
            console.log("Message successfully sent!");

            if (this.state.otherUserData.receiveNotifications) {
              this.props.sendNotification(
                this.state.otherUserData.uid,
                this.props.appState.userData.firstName,
                message,
                true
              );
            }

            this.setState({
              messageSent: true,
              correspondenceSent: correspondence.replace(/ /g, "-"),
              messageModalOpen: !this.state.messageModalOpen,
            });
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      } else {
        correspondenceRef
          .set(
            {
              lastMessageTime: timeStamp,
              data: {
                [timeStampKey]: {
                  message,
                  test: "test",
                  sender: senderId,
                  receiver: receiverId,
                  senderName: this.props.appState.userData.firstName,
                  receiverName: this.state.otherUserData.firstName,
                  timeStamp: timeStamp,
                  readBySender: true,
                  readByReceiver: false,
                },
              },
            },
            { merge: true }
          )
          .then(() => {
            console.log("Message successfully sent!");
            if (this.state.otherUserData.receiveNotifications) {
              var extraConData: number = parseInt(extraConvoData[1]);
              if (
                extraConvoData[2] === this.state.otherUserData.uid &&
                timeStamp - extraConData > 86400000
              ) {
                console.log(
                  "A notification was sent because I sent the last message and it has been over 24 hours since that last message."
                );
                this.props.sendNotification(
                  this.state.otherUserData.uid,
                  this.props.appState.userData.firstName,
                  message
                );
              } else if (
                extraConvoData[2] !== this.state.otherUserData.uid &&
                timeStamp - extraConData > 600000
              ) {
                console.log(
                  "A notification was sent because I did not send the last message and it has been 10 min since the other person sent their message."
                );
                this.props.sendNotification(
                  this.state.otherUserData.uid,
                  this.props.appState.userData.firstName,
                  message
                );
              } else {
                console.log("No notification was sent.");
              }
            }

            this.setState({
              messageSent: true,
              correspondenceSent: correspondence.replace(/ /g, "-"),
              messageModalOpen: !this.state.messageModalOpen,
            });
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      }
      // console.log(this.state.otherUserData.notificationTokens.length)
      if (
        this.state.otherUserData.notificationTokens !== undefined &&
        this.state.otherUserData.notificationTokens.length !== 0
      ) {
        console.log("SENDING PUSH!");
        this.props.sendPush({
          name: this.props.appState.userData.firstName,
          tokens: this.state.otherUserData.notificationTokens,
          message: message,
        });
      }
    });
  };

  toggleFlagModal = (action: string, info: any = undefined) => {
    if (action === "cancel") {
      this.setState({
        flagModalOpen: !this.state.flagModalOpen,
      });
    } else if (action === "open") {
      if (
        this.props.appState.userData.flagged.includes(
          this.state.otherUserData.uid
        )
      ) {
        this.setState({
          showAlert: true,
          alertMessage: "You've flagged this user.",
        });
      } else if (!this.props.appState.userData.emailVerified) {
        this.setState({
          verifyingEmailAddress: true,
        });

        this.props
          .improvedCheckEmailVerification(this.props.appState.userData.uid)
          .then((emailVerification: boolean) => {
            if (emailVerification === true) {
              console.log("Email verified!");
              var emailVerified = {
                emailVerified: true,
              };
              let usersRef = db
                .collection("userData")
                .doc(this.props.appState.user.uid);
              usersRef.update(emailVerified).then(() => {
                this.setState({
                  flagModalOpen: true,
                  verifyingEmailAddress: false,
                });
              });
            } else {
              console.log(emailVerification);
              this.setState({
                cannotSendModalOpen: true,
                verifyingEmailAddress: false,
              });
            }
          })
          .catch((err) => console.log(err));
      } else {
        this.setState({
          flagModalOpen: !this.state.flagModalOpen,
        });
      }
    } else {
      var date: any = new Date();
      var flagInfo = {
        [date]: {
          sexual: info.sexual,
          hateful: info.hateful,
          selling: info.selling,
          other: info.flagMessage,
          flagger: this.props.appState.user.uid,
          flaggee: this.state.otherUserData.uid,
        },
      };
      // console.log(flagInfo);
      var alreadyFlagged = this.props.appState.userData.flagged;
      alreadyFlagged.push(this.state.otherUserData.uid);

      let flagsRef = db.collection("flags").doc(this.state.otherUserData.uid);
      flagsRef
        .set(flagInfo, { merge: true })
        .then(() => {
          var flagged = {
            flagged: alreadyFlagged,
          };
          let usersRef = db
            .collection("userData")
            .doc(this.props.appState.user.uid);
          usersRef.update(flagged).then(() => {
            this.setState({
              showAlert: true,
              alertMessage: "User flagged.",
              flagModalOpen: false,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // moveArrow = () => {
  //   console.log(window.scrollY)
  //   const backArrow = document.getElementById("backToSearch");
  //   if (backArrow) {
  //     backArrow.style.top = (window.innerHeight - 70).toString() + "px";
  //     backArrow.style.right = "20px"
  //   }
  // }

  render = () => {
    const data = this.state.otherUserData;
    // console.log(data);
    if (this.state.otherUserData === "") {
      return <div></div>;
    }
    if (this.state.otherUserData === "User not found.") {
      return (
        <div className="firstFont ion-text-center">
          <br />
          User not found.
        </div>
      );
    } 
    if (this.state.otherUserData.accountDeleted) {
      return (
        <div style={{ fontSize: "16pt", margin: "12px"}}>
          This user's profile is no longer available.
        </div>
      );
    }
    if (this.props.appState.userData.flagged !== undefined){
      if (this.props.appState.userData.flagged.includes(this.state.otherUserData.uid)){
        return (
        <div style={{ fontSize: "16pt", margin: "12px"}}>
            This user's profile is no longer available.
          </div>
        )
      } 
    }
    if (this.state.otherUserData.flagged.includes(this.props.appState.userData.uid)) {
      return (
        <div style={{ fontSize: "16pt", margin: "12px"}}>
            This user's profile is no longer available.
          </div>
        )
    }
    if (this.state.messageSent) {
      return (
        <Redirect to={`/correspondence?id=${this.state.correspondenceSent}`} />
      );
    } else {
      let buttons: any;
      if (!this.props.appState.loggedIn) {
        buttons = (
          <div>
            <IonButton
              color="medium"
              onClick={() => this.toggleMessageModal("open")}
              className="sendMessageButton"
              disabled={true}
            >
              Send Message
            </IonButton>
            <br />
            <IonButton
              color="medium"
              onClick={() => this.toggleFlagModal("open")}
              className="flagButton"
              disabled={true}
            >
              Flag
            </IonButton>
          </div>
        );
      } else if (this.props.appState.user.uid !== data.uid) {
        buttons = (
          <div>
            <IonButton
              color="primary"
              onClick={() => this.toggleMessageModal("open")}
              className="sendMessageButton"
              disabled={this.state.verifyingEmailAddress}
            >
              {this.state.verifyingEmailAddress
                ? "Please Wait"
                : " Send Message"}
            </IonButton>
            <br />
            <IonButton
              color="tertiary"
              onClick={() => this.toggleFlagModal("open")}
              className="flagButton"
              disabled={this.state.verifyingEmailAddress}
            >
              {this.state.verifyingEmailAddress ? " ... " : "Flag"}
            </IonButton>
          </div>
        );
      } else {
        buttons = (
          <div>
            <IonButton
              color="primary"
              className="sendMessageButton"
              disabled={false}
            >
              Send Message
            </IonButton>
            <br />
            <IonButton color="tertiary" className="flagButton" disabled={false}>
              Flag
            </IonButton>
          </div>
        );
      }

      var activePostLink = <span></span>;
      if (data.postData) {
        
        if (data.postData.timeStamp > this.state.cutoffTimeStamp) {
          // console.log("User has active post");
          activePostLink = (
            <IonRouterLink
              style={{ textAlign: "center" }}
              href={`/post?id=${data.uid}`}
            >
              <div
                style={{
                  fontSize: "14pt",
                  color: "#b93e2b",
                  marginTop: "26px",
                  maxWidth: "810px",
                  fontFamily: "Palanquin Regular"
                }}
              >
                View user's active “Now” post.
              </div>
            </IonRouterLink>
          );
        }
      }

      return (
        <React.Fragment>
            <IonFab hidden={this.state.fromSearch ? false : true} horizontal="end" vertical="bottom" slot="fixed">
              <IonFabButton style={{marginRight: "18px", marginBottom: "18px"}} color="secondary" size="small" routerLink="/search">
                <IonIcon icon={arrowBackOutline} />
              </IonFabButton>
            </IonFab>

            <IonFab hidden={this.state.fromPost ? false : true} horizontal="end" vertical="bottom" slot="fixed">
              <IonFabButton style={{marginRight: "18px", marginBottom: "18px"}} color="secondary" size="small" routerLink={`/post?id=${data.uid}`}>
                <IonIcon icon={arrowBackOutline} />
              </IonFabButton>
            </IonFab>

            <IonGrid>
              <IonRow className="firstFont">
                <SendMessageUser
                  toggleMessageModal={this.toggleMessageModal}
                  messageModalOpen={this.state.messageModalOpen}
                />
                <FlagUserModal
                  toggleFlagModal={this.toggleFlagModal}
                  flagModalOpen={this.state.flagModalOpen}
                />
                <CannotSend
                  cannotSendModalOpen={this.state.cannotSendModalOpen}
                  toggleCannotSendModal={this.toggleCannotSendModal}
                />
                <IonAlert
                  isOpen={this.state.showAlert}
                  onDidDismiss={() => this.setState({ showAlert: false })}
                  message={this.state.alertMessage}
                  buttons={["OK"]}
                  mode="ios"
                />

                <IonCol>
                  <IonRow>
                    <IonCol size="9">
                      <img
                        className="profilePic"
                        src={
                          data.picURL == "blankPic.png" ? blank : data.picURL
                        }
                      />
                    </IonCol>
                    <IonCol size="3"></IonCol>
                  </IonRow>
                  <div className="userNameHeading">{data.firstName}</div>

                  <div className="userHeading">About:</div>
                  <div style={{ fontSize: "16pt", whiteSpace: "pre-wrap" }}>
                    {data.about}
                  </div>

                  <div className="userHeading">Interests & Activities:</div>
                  <div style={{ fontSize: "16pt" }}>
                    {data.activities.join(", ")}
                  </div>

                  <div className="userHeading">City:</div>
                  <div style={{ fontSize: "16pt" }}>{data.city}</div>

                  <div className="userHeading">Neighborhoods:</div>
                  <div style={{ fontSize: "16pt" }}>
                    {data.neighborhoods.join(", ")}
                  </div>
                  <br />
                  <div className="ion-text-center">{buttons}</div>
                  {activePostLink}
                  <br />
                </IonCol>
              </IonRow>
            </IonGrid>
        </React.Fragment>
      );
    }
  };
}

export default User;
