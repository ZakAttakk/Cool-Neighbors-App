import React, { Component } from "react";
import { IonRow, IonCol, IonButton, IonGrid } from "@ionic/react";
import SelectActivities from "../components/Search/SelectActivities";
import SelectHoods from "../components/Search/SelectHoods";
import SelectCity from "../components/Search/SelectCity";
import SearchResult from "../components/Search/SearchResult";
import { activities } from "../data/activities";
import { db } from "../fbConfig";
import { neighborhoods } from "../data/hoods";

class Search extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      selectingActivities: false,
      selectingHoods: false,
      selectingCity: false,
      cityChange: false,
      firstSearchTriggered: false,
      searchPending: true,
      searchResults: null,
    };
  }

  componentDidMount = () => {
    if (this.props.appState.loggedIn) {
      if (
        Object.keys(this.props.appState.userData).length > 0 &&
        this.state.firstSearchTriggered === false
      ) {
        console.log("FIRST SEARCH LOGGED IN - MOUNT");
        this.setState(
          {
            firstSearchTriggered: true,
          },
          this.getSearchResults
        );
      }
    }

    if (
      this.props.appState.loggedIn === false &&
      this.state.firstSearchTriggered === false
    ) {
      console.log("FIRST SEARCH NOT LOGGED IN - MOUNT");
      this.setState(
        {
          firstSearchTriggered: true,
        },
        this.getSearchResults
      );
    }

    var content = document.getElementById("main");
    content.scrollTo(0, 0);
  };

  componentDidUpdate = () => {
    // console.log("test")
    if (this.props.appState.loggedIn) {
      if (
        Object.keys(this.props.appState.userData).length > 0 &&
        this.state.firstSearchTriggered === false
      ) {
        console.log("FIRST SEARCH LOGGED IN - UPDATE");
        this.setState(
          {
            firstSearchTriggered: true,
          },
          this.getSearchResults
        );
      }
    } else {
      if (
        this.props.appState.loggedIn === false &&
        this.state.firstSearchTriggered === false
      ) {
        console.log("FIRST SEARCH NOT LOGGED IN - UPDATE");
        this.setState(
          {
            firstSearchTriggered: true,
          },
          this.getSearchResults
        );
      }
      // if (this.props.) {

      // }
      // console.log(this.props.appState.offlineCity)
    }
  };

  toggleSelectActivities = (action: any) => {
    if (action === "open") {
      this.setState({
        selectingActivities: true,
      });
    } else {
      this.props.resetSearchPage();
      var newActivSearch = {
        activSearch: action,
      };

      let usersRef = db
        .collection("userData")
        .doc(this.props.appState.user.uid);
      usersRef.update(newActivSearch).then(() => {
        this.getSearchResults();
      });

      this.setState({
        selectingActivities: false,
        searchPending: true,
      });
    }
  };

  toggleSelectHoods = (action: any) => {
    if (action === "open") {
      this.setState({
        selectingHoods: true,
      });
    } else {
      this.props.resetSearchPage();

      var newHoodSearch = {
        hoodSearch: action,
      };

      let usersRef = db
        .collection("userData")
        .doc(this.props.appState.user.uid);
      usersRef.update(newHoodSearch).then(() => {
        this.getSearchResults();
        console.log("ok");
      });

      this.setState({
        selectingHoods: false,
        searchPending: true,
      });
    }
  };

  toggleSelectCity = (action: any) => {
    if (action === "open") {
      this.setState({
        selectingCity: true,
      });
    } else {
      this.props.resetSearchPage();
      const selectedCity = action;
      if (action !== ""){
        this.setState({
          searchPending: true,
        });
        
        if (this.props.appState.loggedIn) {
          if (selectedCity !== this.props.appState.userData.citySearch) {
            const newHoodData = neighborhoods[selectedCity];
            const newRegions = Object.keys(newHoodData);
            let allNewHoods = [];
            newRegions.forEach((region) => {
              allNewHoods = newHoodData[region].concat(allNewHoods);
            });

            var newCityAndHoods = {
              citySearch: selectedCity,
              hoodSearch: allNewHoods,
              activSearch: activities
            };

            if (this.props.appState.loggedIn) {
              let usersRef = db
                .collection("userData")
                .doc(this.props.appState.user.uid);
              usersRef.update(newCityAndHoods).then(() => {
                this.setState(
                  {
                    cityChange: true,
                  },
                  this.getSearchResults
                );
                // console.log("done")
              });
            }
          }
        } else {
          this.props.resetSearchPage();
          this.props.changeOfflineCity(selectedCity);
          this.getSearchResults(selectedCity);
        }
      }

      this.setState({
        selectingCity: false,
      });
    }
  };

  getSearchResults = (offlineCityChange: string = undefined) => {
    this.setState({
      cityChange: false,
    });
    let citySearch: string;
    if (this.props.appState.loggedIn) {
      citySearch = this.props.appState.userData.citySearch;
    } else if (offlineCityChange) {
      citySearch = offlineCityChange;
    } else {
      citySearch = this.props.appState.offlineCity;
    }

    let usersRef = db.collection("userData");

    var searchResults = [];
    console.log("searching...");
    var query = usersRef
      .where("city", "==", citySearch)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((thing) => {
          searchResults.push(thing.data());
        });

        this.filterResultsByActivitiesAndHoods(searchResults);
        // this.setState({
        //   newCitySearchPending: false
        // })

        // console.log(searchResults);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  hoodFilter = (item: any) => {
    var hoodSearch = this.props.appState.userData.hoodSearch;
    return hoodSearch.includes(item);
  };

  activFilter = (item: any) => {
    var activSearch = this.props.appState.userData.activSearch;
    return activSearch.includes(item);
  };

  filterResultsByActivitiesAndHoods = (searchResults: any) => {
    var finalResults = [];

    if (this.props.appState.loggedIn) {
      // var hoodSearch = this.props.appState.userData.hoodSearch;
      // var activSearch = this.props.appState.userData.activSearch;

      var resultsFilteredByHoods = [];
      for (var i = 0; i < searchResults.length; i++) {
        if (searchResults[i].accountDeleted === false) {
          var thisUsersHoods = searchResults[i].neighborhoods;

          if (thisUsersHoods.some(this.hoodFilter)) {
            resultsFilteredByHoods.push(searchResults[i]);
          }
        }
        // userHoods.some(hood => hoodSearch.includes(hood));
      }

      for (var i = 0; i < resultsFilteredByHoods.length; i++) {
        if (resultsFilteredByHoods[i].accountDeleted === false) {
          var thisUsersActivities = searchResults[i].activities;

          if (thisUsersActivities.some(this.activFilter)) {
            finalResults.push(resultsFilteredByHoods[i]);
          }
        }
      }
    } else {
      for (var i = 0; i < searchResults.length; i++) {
        if (searchResults[i].accountDeleted === false) {
          finalResults.push(searchResults[i]);
        }
      }

      // finalResults = searchResults
    }

    var date = new Date();
    var day = date.getDay();

    var dayAsPercent = day / 7;
    var startingPointInResultsArray = Math.floor(
      finalResults.length * dayAsPercent
    );

    var secondHalf = finalResults.slice(
      startingPointInResultsArray,
      finalResults.length
    );
    var firstHalf = finalResults.slice(0, startingPointInResultsArray);

    finalResults = secondHalf.concat(firstHalf);

    this.setState({
      searchPending: false,
      searchResults: finalResults,
    });

    console.log("Search complete.");
    // console.log(finalResults);
  };

  decreaseSearchPage = () => {
    this.props.decreaseSearchPage();

    var divider = document.querySelector("#divider");
    divider.scrollIntoView();
    
  }

  increaseSearchPage = () => {
    this.props.increaseSearchPage();

    var divider = document.querySelector("#divider");
    divider.scrollIntoView();

  }

  render = () => {
    // var contents = document.getElementsByTagName("ion-content")
    // console.log(contents)

    // for (var i = 0; i < contents.length; i++){
    //   console.log(contents[i])
    // }


    // ACTIVITIES PRE-RENDER
    let activitiesToDisplay: any;
    if (this.props.appState.userData.activSearch) {
      if (
        this.props.appState.userData.activSearch.length === activities.length
      ) {
        activitiesToDisplay = (
          <span style={{ fontStyle: "italic", fontFamily: "Palanquin Medium" }}>
            — All —
          </span>
        );
      } else {
        if (this.props.appState.userData.activSearch.length > 12) {
          activitiesToDisplay = this.props.appState.userData.activSearch.slice(
            0,
            12
          );
          activitiesToDisplay = (
            <span>
              {activitiesToDisplay.join(", ")}
              <span> . . .</span>
            </span>
          );
        } else {
          activitiesToDisplay = this.props.appState.userData.activSearch.join(
            ", "
          );
        }
      }
    }

    // NEIGHBORHOODS PRE-RENDER
    let hoodsToDisplay: any;
    if (this.props.appState.userData.hoodSearch) {
      const hoodData = neighborhoods[this.props.appState.userData.citySearch];
      const regions = Object.keys(hoodData);
      let allHoods = [];
      regions.forEach((region) => {
        allHoods = hoodData[region].concat(allHoods);
      });

      if (this.props.appState.userData.hoodSearch.length === allHoods.length) {
        hoodsToDisplay = (
          <span style={{ fontStyle: "italic", fontFamily: "Palanquin Medium" }}>
            — All —
          </span>
        );
      } else {
        if (this.props.appState.userData.hoodSearch.length > 12) {
          hoodsToDisplay = this.props.appState.userData.hoodSearch.slice(0, 12);
          hoodsToDisplay = (
            <span>
              {hoodsToDisplay.join(", ")}
              <span> . . .</span>
            </span>
          );
        } else {
          hoodsToDisplay = this.props.appState.userData.hoodSearch.join(", ");
        }
      }
    }

    // SEARCH RESULTS PRE-RENDER

    let { searchResults } = this.state;
    let searchResultsHTML: any;
    let startingIndexNumber: any;
    let endingIndexNumber: any;
    let keyOfLastHTMLResultShown: any;

    if (searchResults === null) {
      searchResultsHTML = (
        <div
          style={{
            fontSize: "14pt",
            fontFamily: "Palanquin Regular",
            maxWidth: "800px",
          }}
        >
          Results loading . . .{" "}
        </div>
      );
    } else if (searchResults.length === 0) {
      searchResultsHTML = (
        <div
          style={{
            fontSize: "14pt",
            fontFamily: "Palanquin Regular",
            maxWidth: "800px",
          }}
        >
          No results found.
        </div>
      );
    } else {
      searchResultsHTML = searchResults.map((user, index) => {
        startingIndexNumber = this.props.appState.searchPage * 10;
        endingIndexNumber = (this.props.appState.searchPage + 1) * 10;

        if (index >= startingIndexNumber && index < endingIndexNumber) {
          return (
            // <SearchResult key={index + 1} name={user.firstName} pic={user.picURL} about={user.about} uid={user.uid}/>
            <SearchResult uid={user.uid} key={index + 1} name={user.firstName} pic={user.picURL} about={user.about}></SearchResult>
          );
        } else {
          return null;
        }
      });
      searchResultsHTML = searchResultsHTML.filter((node) => {
        return node != null;
      });
      keyOfLastHTMLResultShown = parseInt(
        searchResultsHTML[searchResultsHTML.length - 1].key
      );
    }

    // BUTTONS PRE-RENDER

    var nextBackButtons: any;
    if (this.state.searchResults !== null ){
      if (this.state.searchResults.length < 1){
        nextBackButtons = <div>

          <button className="nextBackButton searchButton" disabled>Back</button>&emsp;

          <button className="nextBackButton searchButton" disabled>Next</button>
          
        </div>
      } else {
        nextBackButtons = <div>

          <IonButton onClick={this.decreaseSearchPage} className="nextBackButton searchButton" disabled={this.props.appState.searchPage < 1 ? true : false} color={this.props.appState.searchPage < 1 ? "medium" : "primary"}>Back</IonButton>&emsp;

          <IonButton onClick={this.increaseSearchPage} className="nextBackButton searchButton" disabled={searchResults.length === keyOfLastHTMLResultShown ? true : false} color={searchResults.length === keyOfLastHTMLResultShown ? "medium" : "primary"}>Next</IonButton>
          
        </div>
      }
    }

    // console.log(this.props.appState.userData);
    return (
      <IonGrid>
      <IonRow className="firstFont">
        <IonCol>
          <div id="searchHeading" className="searchHeading">
            Search
          </div>
          {/* --- ACTIVITES --- */}
          <IonButton
            disabled={this.props.appState.loggedIn ? false : true}
            color={this.props.appState.loggedIn ? "primary" : "medium"}
            className={
              this.props.appState.loggedIn
                ? "searchButton"
                : "searchButtonDisabled"
            }
            onClick={() => this.toggleSelectActivities("open")}
          >
            Select
          </IonButton>
          <span
            style={{
              fontSize: "13pt",
              fontFamily: "Palanquin SemiBold",
              verticalAlign: "-4px",
            }}
          >
            Interests & Activities:
          </span>
          <br />
          <div className="searchSelected">
            {this.props.appState.loggedIn ? (
              activitiesToDisplay
            ) : (
              <span
                style={{ fontStyle: "italic", fontFamily: "Palanquin Medium" }}
              >
                — All —
              </span>
            )}
          </div>

          {/* --- Neighborhoods --- */}
          <IonButton
            disabled={this.props.appState.loggedIn ? false : true}
            color={this.props.appState.loggedIn ? "primary" : "medium"}
            className={
              this.props.appState.loggedIn
                ? "searchButton"
                : "searchButtonDisabled"
            }
            onClick={() => this.toggleSelectHoods("open")}
          >
            Select
          </IonButton>
          <span
            style={{
              fontSize: "13pt",
              fontFamily: "Palanquin SemiBold",
              verticalAlign: "-4px",
            }}
          >
            Neighborhoods:
          </span>
          <br />
          <div className="searchSelected">
            {this.props.appState.loggedIn ? (
              hoodsToDisplay
            ) : (
              <span
                style={{ fontStyle: "italic", fontFamily: "Palanquin Medium" }}
              >
                — All —
              </span>
            )}
          </div>

          {/* --- City --- */}
          <IonButton
            // disabled={this.props.appState.loggedIn ? false : true}
            color="primary"
            className="searchButton"

            onClick={() => this.toggleSelectCity("open")}
          >
            Select
          </IonButton>
          <span
            style={{
              fontSize: "13pt",
              fontFamily: "Palanquin SemiBold",
              verticalAlign: "-4px",
            }}
          >
            City:
          </span>
          <br />
          <div className="searchSelected">
            {this.props.appState.loggedIn
              ? this.props.appState.userData.citySearch
              : this.props.appState.offlineCity}
          </div>

          <hr id="divider" />

          <div style={{ textAlign: "center" }}>
            {this.state.searchPending ? "Please wait..." : searchResultsHTML}
            <br />

            {this.state.searchPending || searchResults.length === 0 ? "" : nextBackButtons}

            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
          <SelectActivities
            appState={this.props.appState}
            toggleSelectActivities={this.toggleSelectActivities}
            selectingActivities={this.state.selectingActivities}
            cityChange={this.state.cityChange}
          />
          <SelectHoods
            appState={this.props.appState}
            toggleSelectHoods={this.toggleSelectHoods}
            selectingHoods={this.state.selectingHoods}
            cityChange={this.state.cityChange}
          />
          <SelectCity
            appState={this.props.appState}
            toggleSelectCity={this.toggleSelectCity}
            selectingCity={this.state.selectingCity}
          />
        </IonCol>
      </IonRow>
      </IonGrid>
    );
    // }
  };
}

export default Search;
