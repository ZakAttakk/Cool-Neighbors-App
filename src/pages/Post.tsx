import React, { Component } from "react";
import {
  IonRow,
  IonCol,
  IonAlert,
  IonRouterLink,
  IonButton,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonFab,
} from "@ionic/react";
import { db, functions } from "../fbConfig";
import { Redirect } from "react-router-dom";
import moment from "moment";
import PostModal from "../components/Now/PostModal";
import CannotSend from "../components/Now/CannotSend";
import SendMessagePost from "../components/Now/SendMessagePost";
import FlagUserModal from "../components/User/FlagUserModal";
import { arrowBackOutline } from "ionicons/icons";

class Post extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      posterID: window.location.search.slice(4),
      city: "",
      firstName: "",
      post: "",
      subject: "",
      timeStamp: 0,
      doesNotExist: false,
      resultsLoaded: false,
      cutoffTimeStamp: 0,
      checkingEmail: false,
      otherUserData: "",
      showAlert: false,
      alertMessage: "",
      postModalOpen: false,
      cannotSendModalOpen: false,
      messageModalOpen: false,
      messageSent: false,
      correspondenceSent: "",
      flagModalOpen: false,
    };
  }

  getServerTimestamp = functions.httpsCallable("getServerTimestamp");
  improvedSendVerificationEmail = functions.httpsCallable(
    "improvedSendVerificationEmail"
  );

  componentDidMount = () => {
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

        this.setState(
          {
            cutoffTimeStamp: milliTimestampAt4am,
          },
          this.getPost
        );
      } else {
        var secondsSince4amYesterday = secondsSinceMidnight + 72000;
        var timeStamp4amYesterday = timeStamp - secondsSince4amYesterday;
        var milliTimestamp4amYesterday = timeStamp4amYesterday * 1000;

        this.setState(
          {
            cutoffTimeStamp: milliTimestamp4amYesterday,
          },
          this.getPost
        );
      }
    });
  };

  getPost = () => {
    console.log("Getting post...");
    var postsRef = db.collection("posts");
    var thisPost = postsRef.doc(this.state.posterID);
    thisPost.get().then((doc) => {
      if (doc.exists) {
        this.setState(
          {
            city: doc.data().city,
            firstName: doc.data().firstName,
            post: doc.data().post,
            subject: doc.data().subject,
            timeStamp: doc.data().timeStamp,
            clientTimeStamp: doc.data().clientTimeStamp,
          },
          this.getOtherUserData
        );
      } else {
        this.setState({
          doesNotExist: true,
        });
      }
    });
  };

  getOtherUserData = () => {
    const userRef = db.collection("userData").doc(this.state.posterID);
    userRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Other user's data found.");

          this.setState({
            otherUserData: doc.data(),
            resultsLoaded: true,
          });
        } else {
          console.log("Other user's data not found.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  togglePostModal = (action: any) => {
    if (this.props.appState.userData.emailVerified) {
      if (action === "open") {
        this.setState({
          postModalOpen: true,
        });
      } else if (action === "cancel") {
        this.setState({
          postModalOpen: false,
        });
      } else if (action === "post") {
        const subject = this.state.subject;
        const post = this.state.post;
        if (subject !== "" && post !== "") {
          var ts = new Date();
          var clientTimeStamp = Date.parse(ts.toUTCString());

          var newPost = {
            subject: subject,
            post: post,
            city: this.state.city,
            clientTimeStamp: clientTimeStamp,
            uid: this.props.appState.user.uid,
            firstName: this.props.appState.userData.firstName,
            timeStamp: 0,
          };

          this.getServerTimestamp().then((result) => {
            // console.log("Got timestamp.")

            newPost.timeStamp = result.data;

            let postsRef = db
              .collection("posts")
              .doc(this.props.appState.user.uid);
            postsRef
              .set(newPost)
              .then(() => {
                this.setState(
                  {
                    showAlert: true,
                    alertMessage: "Post updated",
                    postModalOpen: false,
                  },
                  this.getPost
                );
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      }
    } else {
      this.setState(
        {
          checkingEmail: true,
        },
        () => this.confirmEmail("post")
      );
    }
  };

  toggleFlagModal = (action: string, info: any = undefined) => {
    if (action === "cancel") {
      this.setState({
        flagModalOpen: false,
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
          checkingEmail: true,
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
                  checkingEmail: false,
                });
              });
            } else {
              console.log(emailVerification);
              this.setState({
                cannotSendModalOpen: true,
                checkingEmail: false,
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

  postSubjectAreaChange = (e: any) => {
    let ps = e.target.value;
    let postSubject = ps.replace(/\ "/g, " “");
    this.setState({
      subject: postSubject,
    });
  };

  postTextAreaChange = (e: any) => {
    let pt = e.target.value;
    let postText = pt.replace(/\ "/g, " “");
    this.setState({
      post: postText,
    });
  };

  deletePost = () => {
    var deletedPost = {
      subject: this.state.subject,
      post: this.state.post,
      city: this.state.city,
      clientTimeStamp: this.state.clientTimeStamp,
      uid: this.props.appState.user.uid,
      firstName: this.props.appState.userData.firstName,
      timeStamp: 0,
    };

    let postsRef = db.collection("posts").doc(this.props.appState.user.uid);
    postsRef
      .set(deletedPost)
      .then(() => {
        // this.getPost();
        this.addPostDataToUser(deletedPost);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addPostDataToUser = (postData) => {
    var deletedPostData = {
      postData: postData,
    };

    let usersRef = db.collection("userData").doc(this.props.appState.user.uid);
    usersRef.update(deletedPostData).then(() => {
      this.setState({
        doesNotExist: true,
        showAlert: true,
        alertMessage: "Post deleted.",
      });
    });
  };

  toggleMessageModal = (action: any) => {
    if (action === "open") {
      this.setState({
        messageModalOpen: true,
      });
    } else if (action === "cancel") {
      this.setState({
        messageModalOpen: false,
      });
    } else {
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

      if (
        this.state.otherUserData.notificationTokens !== undefined &&
        this.state.otherUserData.notificationTokens.length !== 0
      ) {
        console.log("SENDING PUSH!");
        this.props.sendPush({
          name: this.state.otherUserData.firstName,
          tokens: this.state.otherUserData.notificationTokens,
          message: message,
        });
      }
    });
  };

  checkEmailVerified = () => {
    if (this.props.appState.userData.flagged.includes(this.state.posterID)) {
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
    } else if (this.props.appState.userData.emailVerified) {
      this.toggleMessageModal("open");
    } else {
      this.setState(
        {
          checkingEmail: true,
        },
        () => this.confirmEmail("message")
      );
    }
  };

  confirmEmail = (modal: string) => {
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
            this.setState(
              {
                checkingEmail: false,
              },
              () => {
                if (modal === "post") {
                  this.togglePostModal("open");
                } else {
                  this.toggleMessageModal("open");
                }
              }
            );
          });
        } else {
          console.log("Email not verified!");
          this.setState({
            checkingEmail: false,
            cannotSendModalOpen: true,
          });
        }
      });
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
      this.setState({
        checkingEmail: true,
      });
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
          checkingEmail: false,
        });
      });
    }
    this.setState({
      cannotSendModalOpen: false,
    });
  };

  render = () => {
    // console.log(this.state)
    if (this.state.posterID.length < 2) {
      return <Redirect to="/" />;
    } else if (this.state.doesNotExist) {
      return <Redirect to="/now" />;
    } else if (this.state.messageSent) {
      return (
        <Redirect
          push
          to={`/correspondence?id=${this.state.correspondenceSent}`}
        />
      );
    } else if (this.state.resultsLoaded === false) {
      return (
        <IonRow className="firstFont">
          <IonCol>
            <span>Loading...</span>
          </IonCol>
        </IonRow>
      );
    } else if (this.state.timeStamp < this.state.cutoffTimeStamp) {
      console.log("Post has expired.");
      return <span style={{ fontSize: "16pt" }}>This post has expired.</span>;
    } else if (
      this.state.timeStamp > this.state.cutoffTimeStamp &&
      this.state.timeStamp !== 0 &&
      this.state.cutoffTimeStamp !== 0
    ) {
      var postButtons: any;
      if (this.props.appState.loggedIn) {
        // If you are looking at YOUR OWN post:

        if (this.state.posterID === this.props.appState.user.uid) {
          postButtons = (
            <div style={{ textAlign: "center" }}>
              <IonButton
                onClick={() => this.togglePostModal("open")}
                color="secondary"
                className="postPageButton"
              >
                Edit Post
              </IonButton>
              <br />
              <IonButton
                onClick={this.deletePost}
                color="secondary"
                className="postPageButton"
              >
                Delete Post
              </IonButton>
            </div>
          );
        } else {
          // If you are looking at ANOTHER USER'S post:

          if (this.state.checkingEmail === false) {
            postButtons = (
              <div style={{ textAlign: "center" }}>
                <IonButton
                  color="primary"
                  onClick={this.checkEmailVerified}
                  className="sendMessageButton"
                  disabled={false}
                >
                  Send Message
                </IonButton>
                <br />
                <IonButton
                  color="tertiary"
                  onClick={() => this.toggleFlagModal("open")}
                  className="flagButton"
                  disabled={false}
                >
                  Flag
                </IonButton>
              </div>
            );
          }
          // If checking email:
          else {
            postButtons = (
              <div style={{ textAlign: "center" }}>
                <IonButton
                  disabled={true}
                  color="medium"
                  className="sendMessageButton"
                >
                  Please wait.
                </IonButton>
                <br />
                <IonButton
                  disabled={true}
                  color="medium"
                  className="flagButton"
                >
                  Flag
                </IonButton>
              </div>
            );
          }
        }
      }
      // If logged out:
      else {
        postButtons = (
          <div style={{ textAlign: "center" }}>
            <IonButton
              disabled
              color="medium"
              className="sendMessageButton noShadow"
            >
              Send Message
            </IonButton>
            <br />
            <IonButton disabled color="medium" className="flagButton noShadow">
              Flag
            </IonButton>
          </div>
        );
      }

      var datePosted = new Date(this.state.timeStamp);
      var timePosted = moment(datePosted).calendar();
      return (
        <React.Fragment>
        <IonGrid>
          <IonRow className="firstFont">
            <IonCol>
              <div className="postHeading">
                {this.state.subject.replace(/ “/g, ' "')}
              </div>
              <div className="postContent">{this.state.post}</div>
              <br />
              <div className="postAuthor" style={{ fontFamily: "Palanquin SemiBold" }}>
                Posted by
                <IonRouterLink
                  style={{ color: "#b93e2b" }}
                  routerLink={`user/${this.state.posterID}?post`}
                >
                  {" "}
                  {this.state.firstName}
                </IonRouterLink>
              </div>
              <div className="postDate" style={{ fontFamily: "Palanquin SemiBold" }}>
                {timePosted} in {this.state.city}
              </div>
              {postButtons}
              <br />
              <br />
              <br />

              <PostModal
                postModalOpen={this.state.postModalOpen}
                togglePostModal={this.togglePostModal}
                postSubjectAreaChange={this.postSubjectAreaChange}
                postTextAreaChange={this.postTextAreaChange}
                postSubject={this.state.subject}
                postText={this.state.post}
              />

              <IonAlert
                isOpen={this.state.showAlert}
                onDidDismiss={() => this.setState({ showAlert: false })}
                message={this.state.alertMessage}
                buttons={["OK"]}
                mode="ios"
              />

              <CannotSend
                cannotSendModalOpen={this.state.cannotSendModalOpen}
                toggleCannotSendModal={this.toggleCannotSendModal}
              />

              <SendMessagePost
                toggleMessageModal={this.toggleMessageModal}
                messageModalOpen={this.state.messageModalOpen}
              />

              <FlagUserModal
                toggleFlagModal={this.toggleFlagModal}
                flagModalOpen={this.state.flagModalOpen}
              />

              <br />


              
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <IonFabButton
          style={{ marginRight: "18px", marginBottom: "18px" }}
          color="secondary"
          size="small"
          routerLink="/now"
        >
          <IonIcon icon={arrowBackOutline} />
        </IonFabButton>
      </IonFab>
      </React.Fragment>
      );
    } else {
      return <span></span>;
    }
  };
}

export default Post;
