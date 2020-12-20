import React, { Component } from "react";
import mail from "../../theme/mail.png";
import newMail from "../../theme/newMail.png";
import { IonRouterLink } from "@ionic/react";

class MessageRow extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    var { currentUserId } = this.props;
    var correspondenceData = this.props.messageInfo.data;
    var listOfMessageKeys = Object.keys(this.props.messageInfo.data);
    // var firstMessage = correspondenceData[listOfMessageKeys[0]];

    // console.log(listOfMessageKeys)
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

    // var lastMessage =
      // correspondenceData[listOfMessageKeys[listOfMessageKeys.length - 1]];
    // console.log(lastMessage)
    if (lastMessage.sender === currentUserId) {
      var nameForLabel = lastMessage.receiverName;
    } else {
      var nameForLabel = lastMessage.senderName;
    }

    

    var correspondence = this.props.messageInfo.correspondence.replace(
      / /g,
      "-"
    );

    // if(correspondence === "QzAYrsgm1CXg8Pi8SAmDSChbpi12-and-HiVgadPUqgZNlydAIA6TevzDaY02"){
    //   console.log(lastMessage)
    // }

    var icon: any;
    if (this.props.unreadMessages === true) {
      icon = newMail;
    } else {
      icon = mail;
    }

    // if(correspondence === "QzAYrsgm1CXg8Pi8SAmDSChbpi12-and-HiVgadPUqgZNlydAIA6TevzDaY02"){
    //   console.log(nameForLabel)

    // }
    return (
      <IonRouterLink
        routerLink={`/correspondence?id=${correspondence}`}
        style={{ color: "black" }}
      >
        <div className="messageRowSmall">
          <img style={{ width: "26px"}} src={icon} alt="" />
          <span className="messageLabel">{nameForLabel}</span>
        </div>
      </IonRouterLink>
    );
  }
}

export default MessageRow;
