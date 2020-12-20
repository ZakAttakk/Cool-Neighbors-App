import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
  IonImg,
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonCheckbox,
  IonItem,
  IonInput,
  isPlatform,
  IonIcon,
  IonTextarea,
  IonAlert,
  IonGrid,
} from "@ionic/react";
import buildings from "../theme/buildings-trees.jpg";
import { auth, functions, storage, db } from "../fbConfig";
import { Plugins, CameraResultType, CameraSource, PhotosAlbumType } from "@capacitor/core";
import HoodModalSignup from "../components/HoodModalSignup";
import CityModalSignup from "../components/CityModalSignup";
import ActivitiesModalSignup from "../components/ActivitiesModalSignup";
import AboutModalSignup from "../components/AboutModalSignup";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal";
import EULAmodal from "../components/EULAmodal";
import { addCircle } from "ionicons/icons";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import { caps } from "../theme/images/captchas";
import { activities } from "../data/activities";
import { neighborhoods } from "../data/hoods";

// interface SignupItems {
//   firstName: string | null;
//   city: string | null;
//   hoods: string | null;
// }

const Signup: React.FC<{
  setLoggedIn: Function;
  loggedIn: boolean;
  setMenuDisabled: Function;
  menuDisabled: boolean;
  setEmailReminder: Function;
  finishSignup: Function;
  signupPending: Function
}> = (props) => {
  const { Storage, Camera } = Plugins;
  const [showHoodModal, setShowHoodModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [showingAboutModal, setAboutModal] = useState(false);
  const [showingPrivacyModal, setPrivacyModal] = useState(false);
  const [showingEulaModal, setEulaModal] = useState(false);
  const [capAttempts, setCapAttempts] = useState(0);
  const [signupItems, setSignupItems] = useState({
    firstName: "",
    city: "",
    hoods: [],
    activities: [],
    about: "",
    wordCount: 0,
    picPath: "",
    picPreview: "",
    picData: "",
    email: "",
    repeatEmail: "",
    password: "",
    repeatPassword: "",
    capNumber: Math.floor(Math.random() * 20),
    code: null,
    privacy: false,
    picURL: "",
    uid: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  // const [signComplete, setSignupComplete] = useState(false);

  // const sendVerificationEmail = functions.httpsCallable(
  //   "sendVerificationEmail"
  // );

  const improvedSendVerificationEmail = functions.httpsCallable(
    "improvedSendVerificationEmail"
  );

  const checkFields = () => {
    props.setMenuDisabled(true);
    props.signupPending(true);
    if (signupItems.firstName.length < 1) {
      setAlertMessage("Please enter a first name.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else if (signupItems.city.length < 1) {
      setAlertMessage("Please select a city.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else if (signupItems.hoods.length < 1) {
      setAlertMessage("Please select some neighborhoods.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else if (signupItems.hoods.length < 1) {
      setAlertMessage("Please select some neighborhoods.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else if (signupItems.hoods.length > 20) {
      setAlertMessage("Please select 20 or fewer neighborhoods.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else if (signupItems.activities.length < 1) {
      setAlertMessage("Please select some activities.");
      setShowAlert(true);
      props.setMenuDisabled(false);
    } else if (signupItems.wordCount < 35) {
      setAlertMessage("Please type at least 35 words about yourself.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } 
    else if (signupItems.picData == "") {
      setAlertMessage("Please include a picture of yourself.");
      setShowAlert(true);
      props.setMenuDisabled(false);
    } 
    else if (signupItems.email.length < 1) {
      setAlertMessage("Please enter an email address.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else if (signupItems.repeatEmail.length < 1) {
      setAlertMessage("Please retype your email address.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else if (signupItems.email !== signupItems.repeatEmail) {
      setAlertMessage("Your email addresses do not match.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else if (signupItems.password.length < 1) {
      setAlertMessage("Please enter a password.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else if (signupItems.repeatPassword.length < 1) {
      setAlertMessage("Please retype your password.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else if (signupItems.password !== signupItems.repeatPassword) {
      setAlertMessage("Your passwords do not match.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else if (signupItems.code === null || isNaN(signupItems.code)) {
      setAlertMessage("Please enter the code.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else if (signupItems.privacy === false) {
      setAlertMessage("Please agree to the privacy policy.");
      setShowAlert(true);
      props.setMenuDisabled(false);
      props.signupPending(false);
    } else {
      console.log("debug");
      checkCode();
    }
  };

  const checkCode = () => {
    console.log("debug");
    const checkCaptcha = functions.httpsCallable("checkCaptcha");
    checkCaptcha({
      capNumber: signupItems.capNumber,
      code: signupItems.code.toString(),
    })
      .then((result) => {
        
        if (result.data.match) {
          console.log("debug");
          checkAuth();
          console.log("Code OK.");
        } else {
          console.log("debug");
          setCapAttempts(capAttempts + 1);
          setAlertMessage("The code is incorrect.");
          setShowAlert(true);
          props.setMenuDisabled(false);
          props.signupPending(false);
        }
      })
      .catch((err) => {
        console.log(err);
        props.setMenuDisabled(false);
        props.signupPending(false);
      });
  };

  const checkAuth = () => {
    console.log("debug");
    const email = signupItems.email;
    const password = signupItems.password;
    // console.log(email, password);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        // console.log(cred);
        // Storage.set({
        //   key: "cred",
        //   value: JSON.stringify({
        //     cred,
        //   }),
        // })
        // .then(() => {
          console.log("Auth created.");
          setSignupItems({ ...signupItems, uid: cred.user.uid });
        // });
      })
      .catch((err) => {
        setAlertMessage(err);
        setShowAlert(true);
        var badUser = auth.currentUser;
        if (badUser !== null) {
          badUser.delete();
        }
        props.setMenuDisabled(false);
        props.signupPending(false);
      });
  };

  const uploadPic = (pic: string, userId: string) => {
    console.log("uploading pic!");
    var storageRef = storage.ref(userId);
    storageRef
      .putString(pic, "data_url")
      .then(() => {
        storageRef
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            setSignupItems({ ...signupItems, picURL: url });
          })
          .catch((err) => {
            console.log("COULD NOT GET PIC URL.");
            createProfileData(userId);
          });
      })
      .catch((err) => {
        console.log("COULD NOT UPLOAD PIC.");
        createProfileData(userId);
      });
  };

  useEffect(() => {
    if (signupItems.uid !== "") {
      uploadPic(signupItems.picData, signupItems.uid);
      // createProfileData(signupItems.uid);
    }
  }, [signupItems.uid]);

  useEffect(() => {
    if (signupItems.picURL !== "") {
      createProfileData(signupItems.uid);
    }
  }, [signupItems.picURL]);

  const createProfileData = (userId: string) => {
    // console.log(signupItems.picURL);

    var myCityData = neighborhoods[signupItems.city];
    var regions = Object.keys(myCityData);
    var listOfAllHoods = [];
    for (var i = 0; i < regions.length; i++) {
      var region = regions[i];
      var hoodsInRegion = myCityData[region];
      for (var j = 0; j < hoodsInRegion.length; j++) {
        listOfAllHoods.push(hoodsInRegion[j]);
      }
    }

    var emailVerifyCode = Math.floor(Math.random() * 1000000);

    db.collection("userData")
      .doc(userId)
      .set({
        firstName: signupItems.firstName,
        city: signupItems.city,
        neighborhoods: signupItems.hoods,
        activities: signupItems.activities,
        about: signupItems.about,
        activSearch: activities,
        hoodSearch: listOfAllHoods,
        citySearch: signupItems.city,
        nowCity: signupItems.city,
        picURL: signupItems.picURL,
        uid: userId,
        receiveNotifications: true,
        accountDeleted: false,
        flagged: [],
        emailVerifyCode: emailVerifyCode
      })
      .then(() => {
        var newEmail = {
          confirmed: false,
          code: emailVerifyCode,
          signupDate: new Date
        };
        db.collection("confirmedEmails")
          .doc(userId)
          .set(newEmail)
          .then(() => {
            improvedSendVerificationEmail({
              emailAddress: signupItems.email,
              emailVerifyCode: emailVerifyCode.toString(),
              firstName: signupItems.firstName,
              uid: userId,
            })
              .then(() => {
                console.log("Confirmation email sent.");
                props.setEmailReminder(true);
                props.setMenuDisabled(false);
                props.signupPending(false);
                props.setLoggedIn(true);
                props.finishSignup();
              })
              .catch((err) => {
                console.log(err);
                props.setMenuDisabled(false);
                props.signupPending(false);
              });
          });
      });
  };

  const getInputs = (e: any) => {
    const id = e.target.id;
    if (id == "code") {
      let code = e.target.value.replace(/\s/g, "");
      code = parseInt(code);
      setSignupItems({ ...signupItems, code });
    } else {
      setSignupItems({ ...signupItems, [id]: e.target.value });
    }
  };

  const openHoodsModalHandler = () => {
    if (signupItems.city) {
      setShowHoodModal(true);
    } else {
      setAlertMessage("Choose a city first.");
      setShowAlert(true);
    }
  };

  const selectCity = () => {
    const ionCityRadioButtons = document.querySelectorAll(".cityOption");
    ionCityRadioButtons.forEach((radio) => {
      if (radio.getAttribute("aria-checked") === "true") {
        let selectedCity = radio.getAttribute("value");
        setSignupItems({ ...signupItems, city: selectedCity, hoods: [] });
      }
    });
    // console.log(ionCityRadioButtons)

    setShowCityModal(false);
  };

  const selectHoods = () => {
    const ionHoodCheckboxes = document.querySelectorAll(".hoodOption");
    let selectedHoods = [];
    ionHoodCheckboxes.forEach((checkbox) => {
      if (checkbox.getAttribute("aria-checked") === "true") {
        let selectedHood = checkbox.getAttribute("value");
        selectedHoods.push(selectedHood);
      }
    });
    setSignupItems({ ...signupItems, hoods: selectedHoods });

    setShowHoodModal(false);
  };

  const selectActivities = () => {
    const ionActivityCheckboxes = document.querySelectorAll(".activityOption");
    let selectedActivities = [];
    ionActivityCheckboxes.forEach((checkbox) => {
      if (checkbox.getAttribute("aria-checked") === "true") {
        let selectedActivity = checkbox.getAttribute("value");
        selectedActivities.push(selectedActivity);
      }
    });
    setSignupItems({ ...signupItems, activities: selectedActivities });

    setShowActivitiesModal(false);
  };

  const textAreaChange = (text: string, words: number) => {
    setSignupItems({ ...signupItems, about: text, wordCount: words });
  };

  const choosePhotoHandler = () => {
    Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 90,
      width: 800,
    })
      .then((photo) => {
        if (!photo || !photo.path || !photo.webPath) {
          console.log("No photo!");
        } else {
          base64FromPath(photo.webPath).then((base64) => {
            setSignupItems({
              ...signupItems,
              picPath: photo.path,
              picPreview: photo.webPath,
              picData: base64,
            });
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
  const inputClass = isPlatform("ios")
    ? "iosSignupInput"
    : "androidSignupInput";

  // console.log(JSON.stringify(signupItems));

  if (capAttempts > 3) {
    return <Redirect from="/signup" to="/signin" />;
  }

  if (props.loggedIn) {
    return <Redirect from="/signup" to="/profile" />;
  }

  return (
    <React.Fragment>
      <HoodModalSignup
        showHoodModal={showHoodModal}
        selectHoods={selectHoods}
        city={signupItems.city}
        selectedHoods={signupItems.hoods}
      />
      <CityModalSignup showCityModal={showCityModal} selectCity={selectCity} />
      <ActivitiesModalSignup
        showActivitiesModal={showActivitiesModal}
        selectActivities={selectActivities}
        selectedActivities={signupItems.activities}
      />
      <AboutModalSignup
        showingAboutModal={showingAboutModal}
        aboutContent={signupItems.about}
        textAreaChange={textAreaChange}
        setAboutModal={setAboutModal}
        about={signupItems.about}
      />
      <PrivacyPolicyModal
        showingPrivacyModal={showingPrivacyModal}
        setPrivacyModal={setPrivacyModal}
      />
      <EULAmodal
        showingEulaModal={showingEulaModal}
        setEulaModal={setEulaModal}
      />

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        message={alertMessage}
        buttons={["OK"]}
        mode="ios"
      />
      <IonGrid>
      <IonRow className="firstFont">
        <IonCol>
          <IonImg src={buildings} className="frontImg" />
          <IonText className="signupHeading">Join the fun!</IonText>

          <IonItem className={itemClass} mode="ios">
            <IonInput
              id="firstName"
              type="text"
              maxlength={26}
              placeholder="First Name"
              className={inputClass}
              onIonChange={getInputs}
            ></IonInput>
          </IonItem>
          <IonItem className={itemClass} mode="ios">
            <IonInput
              id="city"
              type="text"
              placeholder="City"
              className={inputClass}
              readonly
              onFocus={() => setShowCityModal(true)}
              value={signupItems.city}
            ></IonInput>
            <IonIcon
              onClick={() => setShowCityModal(true)}
              icon={addCircle}
              color="black"
            ></IonIcon>
          </IonItem>
          <IonItem className={`${itemClass} androidPaddingTextArea`} mode="ios">
            <IonTextarea
              id="hoods"
              placeholder="Neighborhoods (Choose 1-20)"
              className={inputClass}
              readonly
              onFocus={openHoodsModalHandler}
              rows={3}
              value={signupItems.hoods.join(", ")}
            />
            <IonIcon
              style={{ marginTop: "12px" }}
              onClick={openHoodsModalHandler}
              icon={addCircle}
              color="black"
            />
          </IonItem>
          <IonItem className={`${itemClass} androidPaddingTextArea`} mode="ios">
            <IonTextarea
              id="activities"
              placeholder="Activities that interest you!"
              className={inputClass}
              readonly
              onFocus={() => setShowActivitiesModal(true)}
              rows={3}
              value={signupItems.activities.join(", ")}
            />
            <IonIcon
              style={{ marginTop: "12px" }}
              onClick={() => setShowActivitiesModal(true)}
              icon={addCircle}
              color="black"
            />
          </IonItem>
          <IonItem className={`${itemClass} androidPaddingTextArea`} mode="ios">
            <IonTextarea
              id="about"
              placeholder="Describe yourself. Who would you like to meet? Minimum: 35 words."
              className={inputClass}
              onFocus={() => setAboutModal(true)}
              rows={5}
              value={signupItems.about}
              readonly
            />
            <IonIcon
              style={{ marginTop: "12px" }}
              onClick={() => setAboutModal(true)}
              icon={addCircle}
              color="black"
            />
          </IonItem>
          <br />
          <div className="ion-text-center">
            {!signupItems.picPreview ? (
              <div>
                <IonButton
                  onClick={choosePhotoHandler}
                  className="uploadPicButton"
                >
                  Upload a Picture
                </IonButton>

                <div
                  style={{
                    fontSize: "11pt",
                    color: "#484848",
                    marginTop: "8px",
                    lineHeight: "24px",
                  }}
                >
                  Required.
                  <br />
                  Your new friends need to see what you look like!
                  <br />
                </div>
              </div>
            ) : (
              <img
                style={{
                  height: "160px",
                  borderRadius: "5px",
                  boxShadow: "2px 2px 5px rgb(190, 190, 190)",
                }}
                src={signupItems.picPreview}
                onClick={choosePhotoHandler}
              />
            )}
          </div>
          <br />
          <hr />

          <br />
          <IonItem className={itemClass} mode="ios">
            <IonInput
              id="email"
              type="email"
              placeholder="Email"
              className={inputClass}
              onIonChange={getInputs}
            ></IonInput>
          </IonItem>
          <IonItem className={itemClass} mode="ios">
            <IonInput
              id="repeatEmail"
              type="email"
              placeholder="Repeat Email"
              className={inputClass}
              onIonChange={getInputs}
            ></IonInput>
          </IonItem>
          <div
            style={{
              fontSize: "11pt",
              color: "#484848",
              marginTop: "10px",
              lineHeight: "24px",
              textAlign: "center",
            }}
          >
            Your email address will
            <span style={{ fontFamily: "Palanquin Bold" }}> never</span> be
            shared with third
            <br />
            parties or other Cool Neighbors users.
          </div>
          <br />
          <IonItem className={itemClass} mode="ios">
            <IonInput
              id="password"
              type="password"
              placeholder="Password"
              className={inputClass}
              onIonChange={getInputs}
            ></IonInput>
          </IonItem>
          <IonItem className={itemClass} mode="ios">
            <IonInput
              id="repeatPassword"
              type="password"
              placeholder="Repeat Password"
              className={inputClass}
              onIonChange={getInputs}
            ></IonInput>
          </IonItem>
          <br />
          <div
            style={{
              fontSize: "14pt",
              color: "black",
              lineHeight: "24px",
              fontFamily: "Palanquin Regular",
              marginLeft: "7px",
              marginTop: "6px",
              fontStyle: "italic",
            }}
          >
            Enter the code below to prove
            <br />
            you're not a robot:
          </div>
          <img
            src={caps[signupItems.capNumber]}
            alt={`${signupItems.capNumber}`}
            className="captcha"
          />
          <IonItem className={itemClass} mode="ios">
            <IonInput
              id="code"
              type="text"
              placeholder="Code"
              className={inputClass}
              maxlength={7}
              onIonChange={getInputs}
            ></IonInput>
          </IonItem>
          <br />
          <div className="checkboxDiv">
            <IonCheckbox
              className="checkboxAgree"
              onIonChange={() =>
                setSignupItems({
                  ...signupItems,
                  privacy: !signupItems.privacy,
                })
              }
            />
          </div>
          <div className="checkboxLabelDiv">
            Yes, I agree to the Cool Neighbors{" "}
            <a
              onClick={() => setPrivacyModal(true)}
              style={{ fontWeight: "bold" }}
            >
              {" "}
              privacy policy
            </a> and <a
              onClick={() => setEulaModal(true)}
              style={{ fontWeight: "bold" }}
            >license agreement</a>.
          </div>
          <br />
          <IonButton
            onClick={checkFields}
            style={{ marginRight: "12px" }}
            className="sideButton ion-float-right"
            disabled={props.menuDisabled ? true : false}
          >
            {props.menuDisabled ? "Please Wait" : "Submit"}
          </IonButton>
          <br />
          <br />
          <br />
          <br />
          <br />
        </IonCol>
      </IonRow>
      </IonGrid>
    </React.Fragment>
  );
};

export default Signup;
