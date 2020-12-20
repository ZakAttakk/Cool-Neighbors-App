import React, { Component } from "react";
import { IonCol, IonRow, IonAlert, IonRouterLink, IonContent, IonGrid } from "@ionic/react";
import VerificationReminder from "../components/Profile/VerificationReminder";
import { Redirect } from "react-router";
import edit from "../theme/editIcon.png";
import close from "../theme/close.png";
import blank from "../theme/blankPic.png";
import ChangeName from "../components/Profile/ChangeName";
import ChangeAbout from "../components/Profile/ChangeAbout";
import ChangeActivities from "../components/Profile/ChangeActivities";
import ChangeCity from "../components/Profile/ChangeCity";
import ChangeHoods from "../components/Profile/ChangeHoods";
import { db, storage } from "../fbConfig";
import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
const { Storage, Camera } = Plugins;

class Profile extends Component<
  any,
  any
> {
  constructor(props: any) {
    super(props);
    this.state = {
      editingName: false,
      processingImage: false,
      editingAbout: false,
      showAlert: false,
      alertMessage: "",
      editingActivities: false,
      editingCity: false,
      editingHoods: false,
    };
  }

  componentDidMount = () => {
    // console.log("mount")

    // var content = document.getElementById("allContent");
    // if (content){
    //   console.log(content)
    // }
    

    // var name = document.querySelector("#name");
    // if (name){
    //   name.scrollIntoView();
    // }
    
    // var c = this.props.allContent

    // c.getScrollElement().then(result => {
    //   console.log(result)
    // })

    var content = document.getElementById("main");
    content.scrollTo(0, 0);
  }
  componentDidUpdate = () => {
    // console.log("update")
    // var name = document.querySelector("#name");
    // if (name){
    //   name.scrollIntoView();
    // }

    // var content = document.getElementById("allContent");
    // if (content){
    //   console.log(content)
    // }
    
    // var c = this.props.allContent

    // c.getScrollElement().then(result => {
    //   console.log(result);
    // })

  }

  toggleChangeName = () => {
    if (this.state.editingName === true) {
      const input = document.getElementById(
        "firstNameChange"
      ) as HTMLInputElement;
      const name = input.value;
      var newName = {
        firstName: name,
      };
      let usersRef = db
        .collection("userData")
        .doc(this.props.appState.user.uid);
      usersRef.update(newName);
    }

    this.setState({
      editingName: !this.state.editingName,
    });
  };

  toggleChangeAbout = (words: number = undefined, text: string = undefined) => {
    if (this.state.editingAbout === true) {
      if (words < 35) {
        this.setState({
          showAlert: true,
          alertMessage: "Please enter at least 35 words.",
        });
      } else {
        // console.log(text);
        var newAbout = {
          about: text,
        };
        let usersRef = db
          .collection("userData")
          .doc(this.props.appState.user.uid);
        usersRef.update(newAbout);

        this.setState({
          editingAbout: !this.state.editingAbout,
        });
      }
    } else {
      this.setState({
        editingAbout: !this.state.editingAbout,
      });
    }
  };

  toggleChangeActivities = () => {
    if (this.state.editingActivities === true) {
      const ionActivityCheckboxes = document.querySelectorAll(
        ".activityOption"
      );
      let selectedActivities = [];
      ionActivityCheckboxes.forEach((checkbox) => {
        if (checkbox.getAttribute("aria-checked") === "true") {
          let selectedActivity = checkbox.getAttribute("value");
          selectedActivities.push(selectedActivity);
        }
      });

      var newActivities = {
        activities: selectedActivities,
      };
      let usersRef = db
        .collection("userData")
        .doc(this.props.appState.user.uid);
      usersRef.update(newActivities);
    }

    this.setState({
      editingActivities: !this.state.editingActivities,
    });
  };

  toggleChangeCity = () => {
    if (this.state.editingCity === true) {
      const ionCityRadioButtons = document.querySelectorAll(".cityOption");
      ionCityRadioButtons.forEach((radio) => {
        if (radio.getAttribute("aria-checked") === "true") {
          let selectedCity = radio.getAttribute("value");
          if (selectedCity !== this.props.appState.userData.city) {
            var newCity = {
              city: selectedCity,
              neighborhoods: [],
            };
            let usersRef = db
              .collection("userData")
              .doc(this.props.appState.user.uid);
            usersRef.update(newCity);
          }
        }
      });
    }

    this.setState({
      editingCity: !this.state.editingCity,
    });
  };

  toggleChangeHoods = () => {
    if (this.state.editingHoods === true) {
      const ionHoodCheckboxes = document.querySelectorAll(".hoodOption");
      let selectedHoods = [];
      ionHoodCheckboxes.forEach((checkbox) => {
        if (checkbox.getAttribute("aria-checked") === "true") {
          let selectedHood = checkbox.getAttribute("value");
          selectedHoods.push(selectedHood);
        }
      });
      if (selectedHoods.length <= 20) {

        var newHoods = {
          neighborhoods: selectedHoods,
        };
        let usersRef = db
          .collection("userData")
          .doc(this.props.appState.user.uid);
        usersRef.update(newHoods);
  
        this.setState({
          editingHoods: false,
        });

      } else {
        this.setState({
          showAlert: true,
          alertMessage: "Please select 20 or fewer neighborhoods",
        });
      }
      

    } else {
      this.setState({
        editingHoods: true,
      });

    }
    
  };

  deletePic = () => {
    console.log("6")
    this.setState({
      processingImage: true,
    });

    var newURL = {
      picURL: "blankPic.png",
    };

    let usersRef = db.collection("userData").doc(this.props.appState.user.uid);
    usersRef.update(newURL).then(() => {
      var storageRef = storage.ref(this.props.appState.user.uid);
      storageRef
        .delete()
        .then(() => {
          this.setState({
            processingImage: false,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  choosePic = () => {
    console.log("7")
    this.setState({
      processingImage: true,
    });

    Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 85,
      width: 800,
    })
      .then((photo) => {
 if (!photo || !photo.path || !photo.webPath) {
          console.log("No photo!");
        } else {
          base64FromPath(photo.webPath).then((base64) => {
            //upload pic:
            var storageRef = storage.ref(this.props.appState.user.uid);
            storageRef
              .putString(base64, "data_url")
              .then(() => {
                this.getPicURL();
              })
              .catch((err) => {
                console.log(err.message);
              });
          });
        }
        console.log(photo);
      })
      .catch((error) => console.log(error));
  };

  getPicURL = () => {
    var storageRef = storage.ref(this.props.appState.user.uid);
    storageRef
      .getDownloadURL()
      .then((url) => {
        var newURL = {
          picURL: url,
        };
        let usersRef = db
          .collection("userData")
          .doc(this.props.appState.user.uid);
        usersRef.update(newURL).then(() => {
          this.setState({
            processingImage: false,
          });
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  render() {
    // var contents = document.getElementsByTagName("ion-content")
    // console.log(contents)

    // for (var i = 0; i < contents.length; i++){
    //   console.log(contents[i])

    // }

    const userData = this.props.appState.userData;
    // console.log("render");
    // console.log(this.props.appState.needToShowEmailReminder);

    if (this.props.appState.loggedIn === null) {
      return <span></span>;
    } else if (this.props.appState.loggedIn === false) {
      return <Redirect from="/profile" to="/" />;
    } else if (Object.keys(userData).length < 1) {
      return <span></span>;
    } else {
      // console.log("Profile loading...")
      let img: any;
      if (this.state.processingImage) {
        img = (
              <div style={{ fontSize: "18pt" }}>- PLEASE WAIT -</div>
        );
      } else if (userData.picURL !== "blankPic.png") {
        img = (
              <div>
              <img className="profilePic" src={userData.picURL} />
              <img className="closeIcon" onClick={() => this.deletePic()} src={close} />
              </div>
        );
      } else {
        img = (
          <div>
              <img
                onClick={() => this.choosePic()}
                className="profilePic"
                src={blank}
              />
              </div>
        );
      }

      return (
        <IonGrid>
        <IonRow className="firstFont">
          <IonCol>
            <img
              alt="editIcon"
              className="editIconName"
              src={edit}
              onClick={() => this.toggleChangeName()}
            />

            <div id="name" className="profileName">{userData.firstName}</div>

            {img}

            <img
              alt="editIcon"
              onClick={() => this.toggleChangeAbout()}
              className="editIcon"
              src={edit}
            />
            <div className="profileHeading">&ensp;About:</div>
            <div style={{ fontSize: "16pt", whiteSpace: "pre-wrap" }}>{userData.about}</div>
            <img
              alt="editIcon"
              onClick={() => this.toggleChangeActivities()}
              className="editIcon"
              src={edit}
            />
            <div className="profileHeading">&ensp;Interests & Activities:</div>
            <div style={{ fontSize: "16pt" }}>
              {userData.activities.join(", ")}
            </div>
            <img
              alt="editIcon"
              className="editIcon"
              src={edit}
              onClick={() => this.toggleChangeCity()}
            />
            <div className="profileHeading">&ensp;City:</div>
            <div style={{ fontSize: "16pt" }}>{userData.city}</div>
            <img
              alt="editIcon"
              className="editIcon"
              src={edit}
              onClick={() => this.toggleChangeHoods()}
            />
            <div className="profileHeading">&ensp;Neighborhoods:</div>
            <div style={{ fontSize: "16pt" }}>{userData.neighborhoods.join(", ")}</div>
            <br />
            <div
              style={{
                fontSize: "12.5pt",
                lineHeight: "26px",
                textAlign: "center",
              }}
            >
              <span style={{fontFamily: "Palanquin Regular"}}>Click <IonRouterLink routerLink={`/user/${userData.uid}`} style={{fontFamily: "Palanquin SemiBold"}}>here</IonRouterLink> to view your profile exactly as it appears to the
              public.</span>
            </div>
            <br />
            <br />
            <br />
            <br />

            <VerificationReminder
            setEmailReminder={this.props.setEmailReminder}
            needToShowEmailReminder={this.props.needToShowEmailReminder}
          />
          <ChangeName
            userData={userData}
            editingName={this.state.editingName}
            toggleChangeName={this.toggleChangeName}
          />
          <ChangeAbout
            userData={userData}
            editingAbout={this.state.editingAbout}
            toggleChangeAbout={this.toggleChangeAbout}
          />
          <ChangeActivities
            userData={userData}
            editingActivities={this.state.editingActivities}
            toggleChangeActivities={this.toggleChangeActivities}
          />
          <ChangeCity
            userData={userData}
            editingCity={this.state.editingCity}
            toggleChangeCity={this.toggleChangeCity}
          />
          <ChangeHoods
            userData={userData}
            editingHoods={this.state.editingHoods}
            toggleChangeHoods={this.toggleChangeHoods}
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

export default Profile;
