import React, { Component } from "react";
import {
  IonRow,
  IonCol,
  IonModal,
  IonButton,
  IonGrid,
  IonContent,
  IonFooter,
  isPlatform,
  IonTextarea,
} from "@ionic/react";

class PostModal extends Component<any, any> {
  constructor(props: any) {
    super(props);

  }

  // textAreaChange = (e: any) => {
  //   let post = e.target.value;
  //   post = post.replace(/\ "/g, " “");
  //   this.setState({
  //     post: post,
  //   });
  // };

  // subjectAreaChange = (e: any) => {
  //   let subject = e.target.value;
  //   subject = subject.replace(/\ "/g, " “");
  //   this.setState({
  //     subject: subject,
  //   });
  // };

  componentDidMount = () => {};

  render() {
    const itemClass = isPlatform("ios") ? "iosSignupItem" : "androidSignupItem";
    const inputClass = isPlatform("ios")
      ? "iosSignupInput"
      : "androidSignupInput";
    // if (Object.keys(this.props.userData).length < 1) {
    //   return <div></div>;
    // } else {
    // console.log(this.state.aboutText)
    return (
      <IonModal isOpen={this.props.postModalOpen} cssClass="modalClass">
        <IonContent className="hoodModalWrapper all">
          <IonGrid>
            <div
              className={
                isPlatform("iphone")
                  ? "iosModalHoodHeading"
                  : "androidModalHoodHeading"
              }

            >
            </div>
            <IonRow>
              <IonCol>
                <input
                  maxLength={110}
                  value={this.props.postSubject}
                  placeholder="Subject"
                  type="text"
                  className="postSubject"
                  onChange={this.props.postSubjectAreaChange}
                ></input>
                <textarea
                  value={this.props.postText}
                  onChange={this.props.postTextAreaChange}
                  id="postTextArea"
                  maxLength={2000}
                  placeholder="Post"
                ></textarea>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
        <IonFooter mode="ios" className="ion-text-center footerHeight">
          <IonRow>
            <IonCol className="ion-align-items-center">
              <IonButton
                style={{ marginTop: "10px" }}
                color="secondary"
                onClick={() => {
                  this.props.togglePostModal("post");
                }}
              >
                Post
              </IonButton>
            </IonCol>
            <IonCol className="ion-align-items-center">
              <IonButton
                style={{ marginTop: "10px" }}
                onClick={() => this.props.togglePostModal("cancel")}
                color="primary"
              >
                Cancel
              </IonButton>
            </IonCol>
          </IonRow>
        </IonFooter>
      </IonModal>
    );
    // }
  }
}

export default PostModal;
