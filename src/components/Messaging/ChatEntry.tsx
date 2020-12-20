import React, {Component} from 'react'
import moment from 'moment'


class ChatEntry extends Component<any, any> {
  constructor(props: any) {
    super(props);

  }

  componentDidMount = () => {

  }

  render() {
      var d = new Date(this.props.convoData[8])
      var dateSent = moment(d).calendar()

      var message = this.props.convoData[0]

    if (this.props.uid === this.props.convoData[5]) {
      return (
        <div className="chatEntry yourChat">
          <div className="dateSent">{dateSent}</div>
          <div>{message}</div>
        </div>
      )
    } 
    
    else {
      return(
        <div>
          <div className="chatEntry theirChat">
            <div className="dateSent">{dateSent}</div>
            <div>{message}</div>
          </div>
        </div>
      )
    }
  }
}

export default ChatEntry;