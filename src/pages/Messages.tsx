import React, { Component } from "react";
import { IonRow, IonCol, IonGrid } from "@ionic/react";
import { Redirect } from "react-router";
import MessageRow from "../components/Messaging/MessageRow";

class Messages extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount = () => {
    var content = document.getElementById("main");
    content.scrollTo(0, 0);

  }

  render = () => {
    var mailbox = this.props.appState.mailbox;

    if (this.props.appState.loggedIn === null) {
      return <span></span>;
    } else if (this.props.appState.loggedIn === false) {
      return <Redirect from="/messages" to="/" />;
    }
    if (mailbox === undefined) {
      return <span></span>;
    }
    if (Object.keys(mailbox).length < 1) {
      return <IonRow className="firstFont">
      <IonCol><div id="messagesHeading" className="messagesHeading">Messages</div></IonCol></IonRow>;
    } else {
      var mailboxContent = mailbox.map((correspondence) => {
        var unreadMessages = false;
        if (
          correspondence[2] === this.props.appState.userData.uid &&
          correspondence[3] === false
        ) {
          // console.log(correspondence[0])
          // console.log("New messages!")
          var unreadMessages = true;
        }

        correspondence = correspondence[0];
        // console.log(correspondence.data)
        return (
          <MessageRow unreadMessages={unreadMessages} appState={this.props.appState} currentUserId={this.props.appState.userData.uid} messageInfo={correspondence} key={correspondence.correspondence}/>
          // <div>test</div>
        );
      });

      return (
        <IonGrid>
        <IonRow className="firstFont">
          <IonCol>
            <div>
              <div className="messagesHeading">Messages</div>
              {mailboxContent}
              <br />
              <br />
              <br />
            </div>
          </IonCol>
        </IonRow>
        </IonGrid>
      );
    }
  };
}

export default Messages;
