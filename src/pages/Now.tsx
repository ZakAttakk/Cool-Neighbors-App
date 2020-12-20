import React, { Component } from "react";
import { IonButton, IonRow, IonCol, IonAlert, IonRouterLink, IonGrid } from "@ionic/react";
import SelectCity from "../components/Now/SelectCity";
import PostModal from "../components/Now/PostModal";
import { db, functions } from "../fbConfig";
import CannotSend from "../components/User/CannotSend";

class Now extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      selectingCity: false,
      listOfPosts: [],
      resultsLoaded: false,
      cutoffTimeStamp: 0,
      city: "",
      gettingPosts: true,
      postModalOpen: false,

      postText: "",
      postSubject: "",
      userPostSearchComplete: false,
      usersLastPostTime: 0,

      showAlert: false,
      alertMessage: "",
      checkingEmail: false,
      cannotSendModalOpen: false,
      sendingPost: false
    };
  }

  getServerTimestamp = functions.httpsCallable("getServerTimestamp");

  // THIS NOW COMES FROM PROPS
  // checkEmailVerification = functions.httpsCallable("checkEmailVerification");
  
  improvedSendVerificationEmail = functions.httpsCallable(
    "improvedSendVerificationEmail"
  );
  // sendVerificationEmail = functions.httpsCallable("sendVerificationEmail");

  componentDidMount = () => {
    this.decideCity();

    if (this.props.appState.loggedIn && !this.state.userPostSearchComplete) {
      this.getUsersPost();
    }

    var content = document.getElementById("main");
    content.scrollTo(0, 0);
  };

  componentDidUpdate = () => {
    if (this.state.city === "") {
      this.decideCity();
    }

    if (this.props.appState.loggedIn && !this.state.userPostSearchComplete) {
      this.getUsersPost();
    }
  };

  postSubjectAreaChange = (e: any) => {
    let postSubject = e.target.value;
    postSubject = postSubject.replace(/\ "/g, " “");
    this.setState({
      postSubject: postSubject,
    });
  };

  postTextAreaChange = (e: any) => {
    let postText = e.target.value;
    postText = postText.replace(/\ "/g, " “");
    this.setState({
      postText: postText,
    });
  };

  decideCity = () => {
    if (this.props.appState.loggedIn !== null) {
      if (
        this.props.appState.loggedIn &&
        Object.keys(this.props.appState.userData).length > 0
      ) {
        this.setState(
          {
            city: this.props.appState.userData.nowCity,
          },
          this.getPosts
        );
      }
      if (this.props.appState.loggedIn === false) {
        this.setState(
          {
            city: this.props.appState.offlineCity,
          },
          this.getPosts
        );
      }
    }
  };

  toggleSelectCity = (action: any) => {
    if (action === "open") {
      this.setState({
        selectingCity: true,
      });
    } else {
      if (action !== "") {
        const selectedCity = action;
        if (this.props.appState.loggedIn) {
          var newNowCity = {
            nowCity: selectedCity,
          };
          let usersRef = db
            .collection("userData")
            .doc(this.props.appState.user.uid);
          usersRef.update(newNowCity).then(() => {
            this.decideCity();
            this.setState({
              selectingCity: false,
            });
          });
        } else {
          this.props.changeOfflineCity(selectedCity, this.decideCity);
          this.setState({
            selectingCity: false,
          });
        }
      }
    }
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
        this.setState({
          sendingPost: true
        })
        const subject = this.state.postSubject;
        const post = this.state.postText;
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

          this.getServerTimestamp()
            .then((result) => {
              // Read result of the Cloud Function.
              // var sanitizedMessage = result.data.text;
              newPost.timeStamp = result.data;
              // console.log(newPost)
              let postsRef = db
                .collection("posts")
                .doc(this.props.appState.user.uid);
              postsRef.set(newPost).then(() => {
                this.getUsersPost();
                this.getPosts();
                this.addPostDataToUser(newPost);
                this.setState({
                  showAlert: true,
                  alertMessage: "Post successful!",
                  sendingPost: false
                });
              });
            })
            .catch((err) => {
              console.log(err);
            });

          this.setState({
            postModalOpen: false,
          });
        }
      }
    } else {
      this.setState(
        {
          checkingEmail: true,
        },
        this.confirmEmail
      );
    }
  };

  confirmEmail = () => {
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
              () => this.togglePostModal("open")
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
        checkingEmail: true
      })
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
          checkingEmail: false
        });
      });
    }
    this.setState({
      cannotSendModalOpen: false,
    });
  };

  addPostDataToUser = (postData) => {
    // console.log(postData)
    var newPostData = {
      postData: postData,
    };
    let usersRef = db.collection("userData").doc(this.props.appState.user.uid);
    usersRef.update(newPostData);
  };

  getUsersPost = () => {
    let postsRef = db.collection("posts").doc(this.props.appState.user.uid);
    postsRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          var data = doc.data();
          // console.log(data)
          this.setState({
            postText: data.post,
            postSubject: data.subject,
            usersLastPostTime: data.timeStamp,
            userPostSearchComplete: true,
          });
        } else {
          this.setState({
            userPostSearchComplete: true,
          });
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  };

  getPosts = () => {
    // if it's late night, then i need all of today before 4 and all of yesterday after 4

    // if it's not late night, then I need all of today after 4
    console.log("Getting posts...");
    this.setState({
      gettingPosts: true,
    });
    this.getServerTimestamp().then((result) => {
      var d = new Date(result.data);
      // console.log(d)
      var hours = d.getHours();
      var minutes = d.getMinutes();
      var timeStamp = result.data / 1000;
      var secondsSinceMidnight = (hours * 60 + minutes) * 60;

      var lateNight = false;
      if (hours < 4) {
        lateNight = true;
      }

      var listOfPosts = [];

      let postsRef = db.collection("posts");

      // DAY TIME

      if (!lateNight) {
        var secondsSince4am = secondsSinceMidnight - 14400;
        var timestampAt4am = timeStamp - secondsSince4am;
        var milliTimestampAt4am = timestampAt4am * 1000;

        var daytimeQuery = postsRef.where(
          "timeStamp",
          ">=",
          milliTimestampAt4am
        );

        daytimeQuery
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              listOfPosts.push(doc.data());
            });

            listOfPosts = listOfPosts.filter(this.filterByCity);

            var date = new Date();
            var day = date.getDay();

            var dayAsPercent = day / 7;
            var startingPointInResultsArray = Math.floor(
              listOfPosts.length * dayAsPercent
            );

            var secondHalf = listOfPosts.slice(
              startingPointInResultsArray,
              listOfPosts.length
            );
            var firstHalf = listOfPosts.slice(0, startingPointInResultsArray);

            listOfPosts = secondHalf.concat(firstHalf);

            this.setState(
              {
                listOfPosts: listOfPosts,
                cutoffTimeStamp: milliTimestampAt4am,
                resultsLoaded: true,
                gettingPosts: false,
              },
              () => {
                console.log(this.state.listOfPosts);
              }
            );
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      } else {
        // LATE NIGHT

        var secondsSince4amYesterday = secondsSinceMidnight + 72000;
        var timeStamp4amYesterday = timeStamp - secondsSince4amYesterday;

        var milliTimestamp4amYesterday = timeStamp4amYesterday * 1000;

        var lateNightQuery = postsRef.where(
          "timeStamp",
          ">=",
          milliTimestamp4amYesterday
        );
        lateNightQuery
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              listOfPosts.push(doc.data());
            });

            listOfPosts = listOfPosts.filter(this.filterByCity);

            var date = new Date();
            var day = date.getDay();

            var dayAsPercent = day / 7;
            var startingPointInResultsArray = Math.floor(
              listOfPosts.length * dayAsPercent
            );

            var secondHalf = listOfPosts.slice(
              startingPointInResultsArray,
              listOfPosts.length
            );
            var firstHalf = listOfPosts.slice(0, startingPointInResultsArray);

            listOfPosts = secondHalf.concat(firstHalf);

            this.setState(
              {
                listOfPosts: listOfPosts,
                cutoffTimeStamp: milliTimestamp4amYesterday,
                resultsLoaded: true,
                gettingPosts: false,
              },
              () => {
                console.log(this.state.listOfPosts);
              }
            );
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      }
    });
  };

  filterByCity = (doc: any) => {
    if (doc.city === this.state.city) {
      return doc;
    }
  };

  render = () => {
    var results: any;
    if (this.state.gettingPosts) {
      results = <div>Loading . . .</div>;
    } else if (this.state.listOfPosts.length < 1) {
      results = <div>No results found.</div>;
    } else {
      results = this.state.listOfPosts.map((post) => {
        return (
          <IonRouterLink key={post.uid} routerLink={`/post?id=${post.uid}`} style={{ color: 'black' }}>
          <div key={post.uid} className="postRow">
            {post.subject}
          </div>
          </IonRouterLink>
        );
      });
    }

    // var temp = (
    //   <IonButton
    //     onClick={() => this.togglePostModal("open")}
    //     color="secondary"
    //     className="nowPostButton"
    //   >
    //     Create a Post
    //   </IonButton>
    // );

    // CREATE POST BUTTON PRE RENDER

    var createPostButton: any;
    if (this.props.appState.loggedIn) {
      if (!this.state.userPostSearchComplete || !this.state.resultsLoaded) {
        createPostButton = <span></span>;
      } else if (this.state.usersLastPostTime > this.state.cutoffTimeStamp) {
        createPostButton = (
          <IonRouterLink routerLink={`/post?id=${this.props.appState.user.uid}`} style={{ color: 'black' }}>
          <IonButton
            disabled={false}
            color="secondary"
            className="nowPostButton"

          >
            View / Edit Post
          </IonButton>
          </IonRouterLink>
        );
      } else if (this.state.checkingEmail) {
        createPostButton = (
          <IonButton disabled={true} color="medium" className="nowPostButton">
            Please wait
          </IonButton>
        );
      } else {
        createPostButton = (
          <IonButton
            onClick={() => this.togglePostModal("open")}
            color="secondary"
            className="nowPostButton"
            disabled={this.state.sendingPost ? true : false} 
          >
            {this.state.sendingPost ? "Please wait . . ." : "Create a Post"} 
          </IonButton>
        );
      }
    } else {
      createPostButton = (
        <IonButton disabled={true} color="medium" className="nowPostButton noShadow">
          View / Edit Post
        </IonButton>
      );
    }

    return (
      <IonGrid>
      <IonRow className="firstFont">
        <IonCol>
          <div className="nowHeading">Happening Now!</div>
          <p>
            Welcome to our “Happening Now” page.&ensp;Here you'll discover what
            people in your city are doing right now!
          </p>

          <p>
            You're only allowed one active post at a time.&ensp;All posts
            disappear at 4am.
          </p>
          <IonButton
            onClick={() => this.toggleSelectCity("open")}
            color="secondary"
            className="nowSelectButton"
          >
            Select
          </IonButton>

          <div className="nowCityLabel">City:&ensp;</div>

          <div className="nowCitySelection">
            {this.state.city ? this.state.city : <br />}
          </div>
          <hr />

          <div className="ion-text-center">
            {createPostButton}
            <div>{results}</div>

            <br />
            <br />
          </div>
          <SelectCity
            selectingCity={this.state.selectingCity}
            toggleSelectCity={this.toggleSelectCity}
          />
          <PostModal
            postModalOpen={this.state.postModalOpen}
            togglePostModal={this.togglePostModal}
            postSubjectAreaChange={this.postSubjectAreaChange}
            postTextAreaChange={this.postTextAreaChange}
            postSubject={this.state.postSubject}
            postText={this.state.postText}
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
        </IonCol>
      </IonRow>
      </IonGrid>
    );
  };
}

export default Now;
