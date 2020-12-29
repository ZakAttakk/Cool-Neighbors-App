import React, { Component } from "react";
import { Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonContent,
  IonGrid,
  isPlatform,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { auth, db, functions } from "./fbConfig";
//

import Profile from "./pages/Profile";
// import Profile2 from "./pages/Profile2";
import Search from "./pages/Search";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Now from "./pages/Now";
import Home from "./pages/Home";
import User from "./pages/User";
import Messages from "./pages/Messages";
import Correspondence from "./pages/Correspondence";
import Account from "./pages/Account";
import { arrowBackOutline } from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/theme.css";
import Menu from "./components/Menu";
import Logo from "./components/Logo";
import {
  Plugins,
  StatusBarStyle,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import Post from "./pages/Post";
const { Storage, Keyboard, StatusBar, PushNotifications } = Plugins;

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      loggedIn: null,
      menuDisabled: false,
      needToShowEmailReminder: false,
      user: {},
      userData: {},
      connectOnOff: null,
      connectMailboxOneOnOff: null,
      connectMailboxTwoOnOff: null,
      unreadMessages: false,
      offlineCity: "New York City / NY Metropolitan Area",
      searchPage: 0,
      mailbox: [],
      signupPending: false,
      notificationToken: "",
      fromSearch: false,
      fixBug: "0px"
    };

  }

  ionMenuScrollBug = () => {
    console.log("open")
    this.setState({
      fixBug: "1px"
    })
  }

  ionMenuScrollBugFix = () => {
    console.log("close")
    this.setState({
      fixBug: "0px"
    })
  }

  // sendMessageNotification = functions.httpsCallable("sendMessageNotification");
  improvedSendMessageNotification = functions.httpsCallable(
    "improvedSendMessageNotification"
  );

  sendPushNotification = functions.httpsCallable("sendPushNotification");

  sendPush = (data: Object) => {

    this.sendPushNotification(data).then((result) => {
      console.log(result.data);
    });
  };

  improvedCheckEmailVerification = (userId: string) => {
    const userRef = db.collection("confirmedEmails").doc(userId);
    return new Promise((resolve, reject) => {
      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            resolve(doc.data().confirmed);
          } else {
            resolve("Record not found.");
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  signupPending = (setting: boolean) => {
    this.setState({
      signupPending: setting,
    });
  };

  setLoggedIn = (setting: boolean) => {
    if (setting === true) {
      // Storage.get({ key: "cred" }).then((result) => {
      // if (result.value) {
      // this.setState(
      //   {
      //     user: JSON.parse(result.value).cred.user,
      //     loggedIn: setting,
      //   },
      //   this.connectCurrentUser
      // );
      // } else {
      //   console.log("Problems finishing signup.");
      // }
      // });
      console.log("Deprecated set log IN function triggered.");
    } else {
      console.log("You're logged out.");
      this.setState(
        {
          loggedIn: setting,
          user: {},
          needToShowEmailReminder: false,
          userData: {},
          connectOnOff: null,
          connectMailboxOneOnOff: null,
          connectMailboxTwoOnOff: null,
          unreadMessages: false,
          searchPage: 0,
          mailbox: [],
          notificationToken: "", // add to android
        }
        // ,
        // () => {
        //   window.location.pathname = "/";
        // }
      );
    }
  };

  componentDidMount = () => {
    auth.onAuthStateChanged((cred) => {
      if (cred) {
        // console.log("Cred saved");
        Storage.set({
          key: "cred",
          value: JSON.stringify({
            cred,
          }),
        }).then(() => {
          if (!this.state.signupPending) {
            this.setState(
              {
                loggedIn: true,
                user: cred,
              },
              this.connectCurrentUser
            );
          } else {
            this.setState({
              user: cred,
            });
          }
          console.log(
            "You are logged in. (User credential data added to app state.)"
          );
        });
      } else {
        this.setState({
          loggedIn: false,
          user: {},
        });
        console.log(
          "You are not logged in. (No user credential data in app state.)"
        );
      }
    });

    if (
      isPlatform("capacitor") &&
      (isPlatform("ios") || isPlatform("android"))
    ) {
      Keyboard.setAccessoryBarVisible({ isVisible: true }).catch((error) => {
        console.log(
          "The setAccessoryBarVisible function can not be implemented on this device."
        );
        // console.log(error.message);
      });
      if (isPlatform("android")){
        StatusBar.setBackgroundColor({ color: "#F7F7F7" }).catch((error) => {
          console.log(error.message);
        });
      }
      
      StatusBar.setStyle({ style: StatusBarStyle.Light }).catch((error) => {
        console.log(error.message);
      });

      if (isPlatform("android")){
        PushNotifications.addListener(
          "registration",
          (token: PushNotificationToken) => {
            console.log("Token received.");
            if (!this.state.notificationToken){
              this.setState(
                {
                  notificationToken: token,
                },
                () => this.sendTokenToDatabase(token)
              );
            }
            
          }
        );
      }

      if (isPlatform("ios")){
        PushNotifications.addListener(
          "registration",
          (token: PushNotificationToken) => {
            console.log("Token received (iOS).");
            // console.log(t)
            if (!this.state.notificationToken){
              this.setState(
                {
                  notificationToken: token,
                },
                () => this.sendTokenToDatabase(token)
              );
            }
          }
        );
      }
      

      console.log("SETTING UP PUSH NOTIFICATION LISTENERS");

      PushNotifications.addListener("registrationError", (error: any) => {
        console.log("Error on registration: " + JSON.stringify(error));
      });

      PushNotifications.addListener(
        "pushNotificationReceived",
        (notification: PushNotification) => {
          console.log("pushNotificationReceived");
          console.log(JSON.stringify(notification));
        }
      );

      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification: PushNotificationActionPerformed) => {
          console.log("PushNotificationActionPerformed");
          window.location.pathname = "/messages";
          console.log(JSON.stringify(notification));
        }
      );
        if (isPlatform("ios")){
          PushNotifications.requestPermission().then(result => {
            console.log(result)
          })
        }
    }

    // setInterval(this.checkIfFromSearch, 1000);
  };

  sendTokenToDatabase = (token: PushNotificationToken) => {
    console.log("sending token to database...")
    const t = token.value;
    console.log(t);

    var tokensToSend: any;
    if (
      this.state.userData.notificationTokens === null ||
      this.state.userData.notificationTokens === undefined
    ) {
      tokensToSend = [];
    } else {
      tokensToSend = this.state.userData.notificationTokens;
    }

    if (tokensToSend.includes(t)) {
      console.log("Device previously registered.");
    } else {
      tokensToSend.push(t);
      var newTokens = {
        notificationTokens: tokensToSend,
      };
      let usersRef = db.collection("userData").doc(this.state.user.uid);
      usersRef.update(newTokens);
      console.log("Token added to database.");
    }
  };

  changeOfflineCity = (city: string, callback: Function = undefined) => {
    console.log("test");
    this.setState(
      {
        offlineCity: city,
      },
      () => {
        if (callback) {
          callback();
        }
      }
    );
  };

  setMenuDisabled = (setting: boolean) => {
    this.setState({
      menuDisabled: setting,
    });
  };

  setEmailReminder = (setting: boolean) => {
    this.setState({
      needToShowEmailReminder: setting,
    });
  };

  finishSignup = () => {
    // Storage.get({ key: "cred" }).then((result) => {
    //   if (result.value) {
    //     this.setState(
    //       {
    //         user: JSON.parse(result.value).cred.user,
    //       },
    this.connectCurrentUser();
    this.signupPending(false);

    this.setState({
      loggedIn: true,
    });

    //     );
    //   } else {
    //     console.log("Problems finishing signup.");
    //   }
    // });
  };

  connectCurrentUser = () => {
    const uid = this.state.user.uid;

    var connectOnOff = db
      .collection("userData")
      .doc(uid)
      .onSnapshot((doc) => {
        this.setState(
          {
            userData: doc.data(),
            connectOnOff: connectOnOff,
          },
          () => {
            this.connectCurrentMailboxes();
            this.registerDevice();
          }
        );

        console.log("User data updated.");
      });
  };

  registerDevice = () => {
    if (
      isPlatform("capacitor") &&
      (isPlatform("ios") || isPlatform("android"))
    ) {
      PushNotifications.register().then((result) => {
        // console.log(result);
        console.log("Device registered.");
      });
    }
  };

  connectCurrentMailboxes = () => {
    // console.log(this.state.userData);
    const uid = this.state.user.uid;
    var messagesRef = db.collection("messages");

    if (
      !this.state.connectMailboxOneOnOff &&
      !this.state.connectMailboxTwoOnOff
    ) {
      var firstQuery = messagesRef.where("correspondentOne", "==", uid);
      var connectMailboxOneOnOff = firstQuery.onSnapshot(
        this.firstQueryGetSnap
      );

      var secondQuery = messagesRef.where("correspondentTwo", "==", uid);
      var connectMailboxTwoOnOff = secondQuery.onSnapshot(
        this.secondQueryGetSnap
      );

      this.setState({
        connectMailboxOneOnOff: connectMailboxOneOnOff,
        connectMailboxTwoOnOff: connectMailboxTwoOnOff,
      });
      console.log("Mailboxes connected.");
    }
  };

  mailboxOne: any;
  mailboxTwo: any;
  firstQueryGetSnap = (querySnapshot) => {
    // console.log("--- FIRST QUERY ---");
    this.mailboxOne = [];
    querySnapshot.forEach((doc) => {
      this.mailboxOne.push(doc.data());
    });
    this.resetMailbox();
    // console.log(this.mailboxOne)
  };

  secondQueryGetSnap = (querySnapshot) => {
    // console.log("--- SECOND QUERY ---");
    this.mailboxTwo = [];
    querySnapshot.forEach((doc) => {
      this.mailboxTwo.push(doc.data());
    });
    this.resetMailbox();
    // console.log(this.mailboxTwo)
  };

  resetMailbox = () => {
    var combinedMailbox = [];
    if (this.mailboxOne && this.mailboxTwo) {
      combinedMailbox = this.mailboxOne.concat(this.mailboxTwo);
      this.organizeMailbox(combinedMailbox);
    }
  };

  organizeMailbox = (combinedMailbox: any) => {
    // console.log(combinedMailbox)

    var mailboxByTimestamp = [];
    for (var i = 0; i < combinedMailbox.length; i++) {
      var highestTimestamp = 0;
      var topMessage: any;

      var messages = combinedMailbox[i].data;
      var messageKeys = Object.keys(messages);
      // console.log("-------------");
      for (var j = 0; j < messageKeys.length; j++) {
        var key = messageKeys[j];
        // console.log(messages[key].timeStamp);
        if (messages[key].timeStamp > highestTimestamp) {
          highestTimestamp = messages[key].timeStamp;
          topMessage = messages[key];
        }
      }
      mailboxByTimestamp.push([
        combinedMailbox[i],
        highestTimestamp,
        topMessage.receiver,
        topMessage.readByReceiver,
      ]);
    }

    mailboxByTimestamp = mailboxByTimestamp.sort((a, b) => {
      a = a[1];
      b = b[1];
      return b - a;
    });

    var unreadMessages = false;
    mailboxByTimestamp.forEach((correspondence) => {
      if (this.state.userData !== undefined) {
        if (
          correspondence[2] === this.state.userData.uid &&
          correspondence[3] === false
        ) {
          unreadMessages = true;
        }
      }
    });

    this.setState({
      mailbox: mailboxByTimestamp,
      unreadMessages: unreadMessages,
    });

    console.log("Mailboxes updated.");

    if (this.state.unreadMessages) {
      console.log("Unread messages!");
      // console.log(this.state.mailbox);
    }
  };

  sendNotification = (uid, name, message, newCorrespondence) => {
    if (newCorrespondence === true) {
      const userRef = db.collection("confirmedEmails").doc(uid);
      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            var confirmed = doc.data().confirmed;
            if (confirmed) {
              console.log("Other user's email address has been confirmed.");
              this.improvedSendMessageNotification({
                uid: uid,
                senderName: name,
                message: message,
              })
                .then((result) => {
                  console.log(result);
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              console.log("The other user's email address is not confirmed.");
            }
          } else {
            console.log("The other user could not be found.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.improvedSendMessageNotification({
        uid: uid,
        senderName: name,
        message: message,
      })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  logOut = () => {
    console.log("logging out");

    if (
      isPlatform("capacitor") &&
      (isPlatform("ios") || isPlatform("android"))
    ) {

      
      // add to android
      let tokenToRemove: any;
      if (this.state.notificationToken !== "" && this.state.notificationToken !== undefined) {
        console.log("TOKEN TO REMOVE");
        tokenToRemove = this.state.notificationToken.value;
        console.log(tokenToRemove); //remove length property from android
      }
     

      // add to android
      
      let currentTokens: any;
      if (this.state.userData.notificationTokens !== undefined){
        console.log("CURRENT TOKENS");
        currentTokens = this.state.userData.notificationTokens;
        console.log(currentTokens);//remove length property from android
      }
      

      
      console.log("NEW TOKEN LIST");
      // Add this to android
      if(tokenToRemove && currentTokens){
        const newTokenList = this.arrayRemove(currentTokens, tokenToRemove);

        var newTokens = {
          notificationTokens: newTokenList,
        };
        let usersRef = db.collection("userData").doc(this.state.user.uid);
        usersRef.update(newTokens).then(() => {
          console.log("Token removed from database.");
          this.state.connectOnOff();
          this.state.connectMailboxOneOnOff();
          this.state.connectMailboxTwoOnOff();
          auth.signOut().then(() => {
            console.log("Auth cleared.");
            Storage.clear();
            this.setLoggedIn(false);
            this.setState({
              notificationToken: undefined
            })
          });
        }).catch(error => {
          console.log(error);
        });
      } else {
        this.state.connectOnOff();
        this.state.connectMailboxOneOnOff();
        this.state.connectMailboxTwoOnOff();
        auth.signOut().then(() => {
          console.log("Auth cleared.");
          Storage.clear();
          this.setLoggedIn(false);
          this.setState({
            notificationToken: undefined
          })
        });
      }
    } else {
      this.state.connectOnOff();
      this.state.connectMailboxOneOnOff();
      this.state.connectMailboxTwoOnOff();
      auth.signOut().then(() => {
        console.log("Auth cleared.");
        Storage.clear();
        this.setLoggedIn(false);
      });
    }
  };

  arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  increaseSearchPage = () => {
    this.setState({
      searchPage: this.state.searchPage + 1,
    });
  };

  decreaseSearchPage = () => {
    this.setState({
      searchPage: this.state.searchPage - 1,
    });
  };

  resetSearchPage = () => {
    this.setState({
      searchPage: 0,
    });
  };

  // checkIfFromSearch = () => {
  //   const path = window.location.pathname;
  //   const n = path.lastIndexOf("/");
  //   const otherUserId = path.substring(n + 1);
  //   const loc = window.location.href;
  //   var s = loc.substring(loc.indexOf("?") + 1);
  //   // let search = false;
  //   console.log(s)
  //   console.log(this.state.fromSearch)
  //   if (s === "search" && this.state.fromSearch === false) {
  //     console.log("1")
  //     this.setState({
  //       fromSearch: true
  //     })
  //   }
  //   if (s !== "search" && this.state.fromSearch === true) {
  //     console.log("2")
  //     this.setState({
  //       fromSearch: false
  //     })
  //   }
  // }

  // scrolling = () => {
  //   console.log("scrolling");
  // }

  render() {
    // console.log(this.state.notificationToken);
    // console.log("render");
    

    return (
      <IonApp>
        <IonReactRouter>
          <Menu
            logOut={this.logOut}
            loggedIn={this.state.loggedIn}
            menuDisabled={this.state.menuDisabled}
            unreadMessages={this.state.unreadMessages}
            ionMenuScrollBug={this.ionMenuScrollBug}
            ionMenuScrollBugFix={this.ionMenuScrollBugFix}
          />

          <IonRouterOutlet style={{top: this.state.fixBug}} id="main">
            <IonContent id="allContent" className="allContent">
              <Logo />
              {/* <IonGrid> */}
                <Route path="/search" exact>
                  <Search
                    appState={this.state}
                    changeOfflineCity={this.changeOfflineCity}
                    increaseSearchPage={this.increaseSearchPage}
                    decreaseSearchPage={this.decreaseSearchPage}
                    resetSearchPage={this.resetSearchPage}
                  />
                </Route>

                

                <Route path="/signup" exact>
                  <Signup
                    menuDisabled={this.state.menuDisabled}
                    setMenuDisabled={this.setMenuDisabled}
                    loggedIn={this.state.loggedIn}
                    setLoggedIn={this.setLoggedIn}
                    setEmailReminder={this.setEmailReminder}
                    finishSignup={this.finishSignup}
                    signupPending={this.signupPending}
                  />
                </Route>

                <Route path="/signin" exact>
                  <Signin
                    loggedIn={this.state.loggedIn}
                    setLoggedIn={this.setLoggedIn}
                    menuDisabled={this.state.menuDisabled}
                    setMenuDisabled={this.setMenuDisabled}
                    // connectCurrentUser={this.connectCurrentUser}
                  />
                </Route>

                <Route path="/now" exact>
                  <Now
                    appState={this.state}
                    changeOfflineCity={this.changeOfflineCity}
                    improvedCheckEmailVerification={
                      this.improvedCheckEmailVerification
                    }
                  />
                </Route>

                <Route path="/post" exact>
                  <Post
                    appState={this.state}
                    improvedCheckEmailVerification={
                      this.improvedCheckEmailVerification
                    }
                    sendNotification={this.sendNotification}
                    sendPush={this.sendPush}
                  />
                </Route>

                <Route path="/messages" exact>
                  <Messages appState={this.state} />
                </Route>

                <Route path="/correspondence" exact>
                  <Correspondence
                    appState={this.state}
                    improvedCheckEmailVerification={
                      this.improvedCheckEmailVerification
                    }
                    sendNotification={this.sendNotification}
                    sendPush={this.sendPush}
                  />
                </Route>

                <Route path="/account" exact>
                  <Account
                    appState={this.state}
                    improvedCheckEmailVerification={
                      this.improvedCheckEmailVerification
                    }
                    sendNotification={this.sendNotification}
                    logOut={this.logOut}
                    setLoggedIn={this.setLoggedIn} // add to android
                  />
                </Route>

                <Route path="/user/:user_id" exact>
                  <User
                    appState={this.state}
                    sendNotification={this.sendNotification}
                    improvedCheckEmailVerification={
                      this.improvedCheckEmailVerification
                    }
                    sendPush={this.sendPush}
                  ></User>
                </Route>

                <Route path="/profile" exact>
                  <Profile
                    needToShowEmailReminder={this.state.needToShowEmailReminder}
                    setEmailReminder={this.setEmailReminder}
                    appState={this.state}
                    
                  />
                  {/* <Profile2
                    appState={this.state}
                    changeOfflineCity={this.changeOfflineCity}
                    increaseSearchPage={this.increaseSearchPage}
                    decreaseSearchPage={this.decreaseSearchPage}
                    resetSearchPage={this.resetSearchPage}
                  ></Profile2> */}
 
                </Route>

                <Route path="/" exact>
                  <Home appState={this.state} />
                </Route>


              {/* </IonGrid> */}
            </IonContent>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  }
}

export default App;
