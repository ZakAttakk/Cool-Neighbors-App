import React, { Component } from "react";
import { db, functions } from "../fbConfig";
import { Redirect } from "react-router";
import { IonButton, IonCol, IonRouterLink, IonRow, IonAlert, IonGrid } from "@ionic/react";
import ChatEntry from "../components/Messaging/ChatEntry";
import CannotSend from "../components/Messaging/CannotSend";
import FlagUserModal from "../components/Messaging/FlagUserModal";

class Correspondence extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      checkingEmail: "",
      otherUserFound: true,
      sendPending: false,
      cannotSendModalOpen: false,
      showAlert: false,
      alertMessage: "",
      flagModalOpen: false
    };
  }

  chatTextArea: any = React.createRef();
  correspondenceId: any;
  otherUserName: any;
  otherUserId: any;
  correspondenceData = null;
  lastLength = 0;
  otherUserData: any;
  lastMessageKey: any;
  getServerTimestamp = functions.httpsCallable("getServerTimestamp");
  improvedSendVerificationEmail = functions.httpsCallable(
    "improvedSendVerificationEmail"
  );

  componentDidMount = () => {
    if (this.correspondenceData) {
      this.markAsRead();
    }

    // POSSIBLY WRONG!
    if (this.otherUserId && this.otherUserData === undefined) {
      const userRef = db.collection("userData").doc(this.otherUserId);
      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Other user's data found.");
            this.otherUserData = doc.data();
          } else {
            console.log("Other user's data not found.");
            this.setState({
              otherUserFound: false,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    var content = document.getElementById("main");
    content.scrollTo(0, 0);
  };

  componentDidUpdate = () => {
    if (this.correspondenceData) {
      this.markAsRead();
      this.lastLength = Object.keys(this.correspondenceData).length;
    }

    if (this.otherUserId && this.otherUserData === undefined) {
      const userRef = db.collection("userData").doc(this.otherUserId);
      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Other user's data found.");
            this.otherUserData = doc.data();
          } else {
            console.log("Other user's data not found.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.state.checkingEmail !== nextState.checkingEmail) {
      return true;
    } else if (this.state.sendPending !== nextState.sendPending) {
      return true;
    } else {
      var allConversationsWithTimeStamps = nextProps.appState.mailbox;
      var allConversations = {};

      allConversationsWithTimeStamps.forEach((convo) => {
        allConversations[convo[0].correspondence] = convo[0];
      });

      var allConversationKeys = Object.keys(allConversations);
      var correspondenceId = window.location.search.slice(4);

      var currentConvo: any;

      // POSSIBLE WRONG 
      if (currentConvo === undefined) {
        return true
      } 
      //^^/////
      
      else {
        allConversationKeys.forEach((convo) => {
          if (
            correspondenceId ===
            allConversations[convo].correspondence.replace(/ /g, "-")
          ) {
            currentConvo = allConversations[convo];
            this.correspondenceId = allConversations[convo].correspondence;
          }
        });
  
        var incomingCorrespondenceData = currentConvo.data;
        if (incomingCorrespondenceData) {
          var incomingConvoLength = Object.keys(incomingCorrespondenceData)
            .length;
        }
  
        if (this.lastLength !== incomingConvoLength) {
          return true;
        } else {
          return false;
        }
      }
    }
  };

  markAsRead = () => {
    var convoData = this.correspondenceData;
    var convoDataKeys = Object.keys(convoData);

    var keysToUpdate = [];
    convoDataKeys.forEach((message) => {
      if (
        convoData[message].receiver === this.props.appState.user.uid &&
        !convoData[message].readByReceiver
      ) {
        keysToUpdate.push(message);
      }
    });
    if (keysToUpdate.length > 0) {
      var convoRef = db.collection("messages").doc(this.correspondenceId);

      var batch = db.batch();

      keysToUpdate.forEach((key) => {
        batch.update(convoRef, {
          [`data.${key}.readByReceiver`]: true,
        });
      });

      batch
        .commit()
        .then(() => {
          console.log("Messages marked as read.");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  checkForQuotes = (e) => {
    var userInput = e.target.value;
    var changedValue = userInput.replace(/\ "/g, " “");

    e.target.value = changedValue;
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
      this.setState({
        checkingEmail: "sending"
      });
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
          checkingEmail: ""
        });
      });
    }
    this.setState({
      cannotSendModalOpen: false,
    });
  };

  checkEmailVerified = () => {
    if (this.otherUserData !== "") {
      if (this.props.appState.userData.flagged.includes(this.otherUserId)) {
        this.setState({
          showAlert: true,
          alertMessage: "You've flagged this user."
        });
      } else if (
        this.otherUserData.flagged.includes(this.props.appState.userData.uid)
      ) {
        this.setState({
          showAlert: true,
          alertMessage: "This user has flagged you."
        });
      } else if (this.props.appState.userData.emailVerified) {
        this.sendMessage();
      } else {
        this.setState(
          {
            checkingEmail: "pending",
          },
          this.confirmEmail
        );
      }
    }
  };

  sendMessage = () => {
    var lastMessageData = this.correspondenceData[this.lastMessageKey];

    var extraConvoData = [
      this.correspondenceId,
      lastMessageData.timeStamp,
      lastMessageData.receiver,
    ];

    var chatTextArea = this.chatTextArea.current;
    if (this.otherUserData.accountDeleted) {
      alert("This user is no longer available.");
    } else if (chatTextArea.value !== "" && this.otherUserData !== "") {
      this.setState({
        sendPending: true,
      });

      var message = chatTextArea.value;

      var timeStamp: any;

      this.getServerTimestamp().then((result) => {
        timeStamp = result.data;

        var timeStampKey = timeStamp + "-" + this.props.appState.user.uid;

        var messagesRef = db.collection("messages");
        var correspondenceRef = messagesRef.doc(this.correspondenceId);

        correspondenceRef
          .set(
            {
              lastMessageTime: timeStamp,
              data: {
                [timeStampKey]: {
                  message,
                  test: "test",
                  sender: this.props.appState.user.uid,
                  receiver: this.otherUserId,
                  senderName: this.props.appState.userData.firstName,
                  receiverName: this.otherUserName,
                  timeStamp: timeStamp,
                  readBySender: true,
                  readByReceiver: false,
                },
              },
            },
            { merge: true }
          )
          .then(() => {
            console.log("Message sent!");
            chatTextArea.value = "";

            this.setState({
              sendPending: false,
            });

            if (this.otherUserData.notificationTokens !== undefined && this.otherUserData.notificationTokens.length !== 0) {
              console.log("SENDING PUSH!")
              this.props.sendPush({
                name: this.props.appState.userData.firstName,
                tokens: this.otherUserData.notificationTokens,
                message: message
              });
            }

            if (this.otherUserData.receiveNotifications) {
              if (
                extraConvoData[2] === this.otherUserId &&
                timeStamp - extraConvoData[1] > 86400000
              ) {
                console.log(
                  "A notification was sent because I sent the last message and it has been over 24 hours since that last message."
                );
                this.props.sendNotification(
                  this.otherUserId,
                  this.props.appState.userData.firstName,
                  message
                );
              } else if (
                extraConvoData[2] !== this.otherUserId &&
                timeStamp - extraConvoData[1] > 600000
              ) {
                console.log(
                  "A notification was sent because I did not send the last message and it has been 10 min since the other person sent their message."
                );
                this.props.sendNotification(
                  this.otherUserId,
                  this.props.appState.userData.firstName,
                  message
                );
              } else {
                console.log("No notification was sent.");
              }
            }
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
            this.setState({
              sendPending: false,
            });
          });
      });
    }
  };

  confirmEmail = () => {
    this.props
      .improvedCheckEmailVerification(this.props.appState.userData.uid)
      .then((emailVerification) => {

        if (emailVerification === true) {
          console.log("Email verified!");
          var emailVerified = {
            emailVerified: true,
          };
          let usersRef = db
            .collection("userData")
            .doc(this.props.appState.user.uid);
          usersRef.update(emailVerified).then(() => {
            this.sendMessage();
            this.setState({
              checkingEmail: "",
            });
          });
        } else {
          console.log("Email not verified!");
          this.setState({
            checkingEmail: "",
            cannotSendModalOpen: true
          });

        }
      });
  };

  toggleFlagModal = (action: string, info: any = undefined) => {
    if (action === "cancel") {
      this.setState({
        flagModalOpen: false,
      });
    } else if (action === "open") {
      if (
        this.props.appState.userData.flagged.includes(
          this.otherUserData.uid
        )
      ) {
        this.setState({
          showAlert: true,
          alertMessage: "You've flagged this user.",
        });
      } else if (!this.props.appState.userData.emailVerified) {
        this.setState({
          checkingEmail: "pending"
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
                  checkingEmail: ""
                });
              });
            } else {
              console.log(emailVerification);
              this.setState({
                cannotSendModalOpen: true,
                checkingEmail: "",
              });
            }
          })
          .catch((err) => console.log(err));
      } else {
        this.setState({
          flagModalOpen: true,
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
          flaggee: this.otherUserData.uid,
        },
      };
      // console.log(flagInfo);
      var alreadyFlagged = this.props.appState.userData.flagged;
      alreadyFlagged.push(this.otherUserData.uid);

      let flagsRef = db.collection("flags").doc(this.otherUserData.uid);
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

  render() {

    var allConversationsWithTimeStamps = this.props.appState.mailbox;
    var allConversations = {};

    allConversationsWithTimeStamps.forEach((convo) => {
      allConversations[convo[0].correspondence] = convo[0];
    });

    var allConversationKeys = Object.keys(allConversations);

    var correspondenceId = window.location.search.slice(4);

    if (this.props.appState.loggedIn === null){
      // return <Redirect to="/" />
      console.log("null")
      return <span></span>
    }
    else if (correspondenceId === "") {
      // return <Redirect to="/" />;
      console.log("no id")
      return <span></span>
    }
    else if (allConversationKeys.length < 1) {
      return (
        <span style={{ fontSize: "18pt", marginLeft: "14px"}}>
          Loading . . .
        </span>
      );
    } else if (this.state.otherUserFound === false) {
      return <Redirect to="/messages" />;
    }
    else {
      var currentConvo: any;
      allConversationKeys.forEach((convo) => {
        if (
          correspondenceId ===
          allConversations[convo].correspondence.replace(/ /g, "-")
        ) {
          currentConvo = allConversations[convo];
          this.correspondenceId = allConversations[convo].correspondence;
        }
      });
      // console.log(currentConvo)
      var correspondenceData = currentConvo.data;
      var listOfMessageKeys = Object.keys(correspondenceData);

      // IMPROVED "last message" code
      var lastTimestamp = 0;
      var lastMessage: any;
      for (var i = 0; i < listOfMessageKeys.length; i++) {
        var t = correspondenceData[listOfMessageKeys[i]].timeStamp
        if (t > lastTimestamp){
          lastTimestamp = t
          lastMessage = correspondenceData[listOfMessageKeys[i]]
      }
    }
    console.log(lastMessage);

      // var lastMessage = correspondenceData[listOfMessageKeys[listOfMessageKeys.length - 1]];



      var nameForLabel: any;
      var otherUserId: any;
      if (lastMessage.sender === this.props.appState.user.uid) {
        nameForLabel = lastMessage.receiverName;
        this.otherUserName = lastMessage.receiverName;
        otherUserId = lastMessage.receiver;
        this.otherUserId = lastMessage.receiver;
      } else {
        nameForLabel = lastMessage.senderName;
        this.otherUserName = lastMessage.senderName;
        otherUserId = lastMessage.sender;
        this.otherUserId = lastMessage.sender;
      }

      var currentConvoKeys = Object.keys(correspondenceData);

      var messagesByTimeStamp = [];
      currentConvoKeys.forEach((convo) => {
        var c = correspondenceData[convo];
        messagesByTimeStamp.push([
          c.message,
          c.readByReceiver,
          c.readBySender,
          c.receiver,
          c.receiverName,
          c.sender,
          c.senderName,
          c.test,
          c.timeStamp,
        ]);
      });

      messagesByTimeStamp = messagesByTimeStamp.sort((a, b) => {
        a = a[8];
        b = b[8];
        return b - a;
      });

      //FOR FIGURING OUT NOTIFICATIONS
      this.lastMessageKey =
        messagesByTimeStamp[0][8] + "-" + messagesByTimeStamp[0][5];

      this.correspondenceData = correspondenceData;

      var messages = messagesByTimeStamp.map((convo) => {
        return (
          <ChatEntry
            uid={this.props.appState.user.uid}
            key={convo[8]}
            convoData={convo}
          />
        );
      });

      var buttons;
      // console.log(this.state.checkingEmail)
      if (this.state.checkingEmail === "pending") {
        // console.log("test")
        buttons = (
          <div>
            <IonButton disabled={true} color="medium" className="chatSend">
              Send
            </IonButton>
            <br />
            <IonButton disabled={true} color="medium" className="chatFlag">
              Flag
            </IonButton>
          </div>
        );
      } if (this.state.checkingEmail === "sending") {
        // console.log("test")
        buttons = (
          <div>
            <IonButton disabled={true} color="medium" className="chatSend">
              Please
            </IonButton>
            <br />
            <IonButton disabled={true} color="medium" className="chatFlag">
              Wait
            </IonButton>
          </div>
        );
      }
      else if (this.state.sendPending) {
        buttons = (
          <div>
            <IonButton disabled={false} color="medium" className="chatSend">Send</IonButton>
            <br />
            <IonButton disabled={false} color="medium" className="chatFlag">Flag</IonButton>
          </div>
        );
      } else {
        buttons = (
          <div>
            <IonButton
              onClick={this.checkEmailVerified}
              className="chatSend"
              color="primary"
              disabled={false}
            >
              Send
            </IonButton>
            <br />
            <IonButton
              onClick={() => this.toggleFlagModal("open")}
              className="chatFlag"
              color="tertiary"
              disabled={false}
            >
              Flag
            </IonButton>
          </div>
        );
      }

      return (
        <IonGrid>
        <IonRow className="firstFont">
          <IonCol>
          <div className="messagesWithHeading">
            Messages with{" "}
            <IonRouterLink style={{ color: "#b93e2b" }} routerLink={`/user/${otherUserId}?from=${"put-convo-id-here"}`}>
              {nameForLabel}
            </IonRouterLink>
          </div>
          <br />
          <div className="chatSendContainer">
            <div className="chatTextContainer">
              <textarea
                maxLength={2000}
                onChange={this.checkForQuotes}
                ref={this.chatTextArea}
                className="chatTextArea"
              ></textarea>
            </div>

            <div className="chatButtonContainer">{buttons}</div>
          </div>
          {messages}
          <br />
          <br />

          <CannotSend
            cannotSendModalOpen={this.state.cannotSendModalOpen}
            toggleCannotSendModal={this.toggleCannotSendModal}
          />

          <FlagUserModal
            toggleFlagModal={this.toggleFlagModal}
            flagModalOpen={this.state.flagModalOpen}
          />

          <IonAlert
            isOpen={this.state.showAlert}
            onDidDismiss={() => this.setState({ showAlert: false })}
            message={this.state.alertMessage}
            buttons={["OK"]}
            mode="ios"
          />
        </IonCol>
        </IonRow>
        </IonGrid>
      );



    }

  }
}

export default Correspondence;
