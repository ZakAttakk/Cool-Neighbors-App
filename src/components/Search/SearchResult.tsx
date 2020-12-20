import React, { Component } from "react";
import { IonRouterLink } from "@ionic/react";

class SearchResult extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount = () => {};

  truncate(str) {
    const newStr = str.substr(0, 12);

    return newStr;
  }

  render() {
    let name = this.props.name;
    if (this.props.name.length > 11) {
      name = this.truncate(name);
    }
    // console.log(this.props.uid)
    return (
      <IonRouterLink routerLink={`/user/${this.props.uid}?search`}>
        <div className="searchResult">
          <div className="searchItemLeft valign-wrapper">
            <img className="userPic" alt="userPic" src={this.props.pic} />
          </div>

          <div className="searchItemRight">
            <div className="searchResultHeading">{name}</div>

            <div className="searchResultAbout">{this.props.about}</div>
          </div>
        </div>
      </IonRouterLink>
    );
  }
}

export default SearchResult;
