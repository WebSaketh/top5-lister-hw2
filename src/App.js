import React from "react";
import "./App.css";

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from "./db/DBManager";

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from "./components/DeleteModal";
import Banner from "./components/Banner.js";
import Sidebar from "./components/Sidebar.js";
import Workspace from "./components/Workspace.js";
import Statusbar from "./components/Statusbar.js";

class App extends React.Component {
  constructor(props) {
    super(props);

    // THIS WILL TALK TO LOCAL STORAGE
    this.db = new DBManager();

    // GET THE SESSION DATA FROM OUR DATA MANAGER
    let loadedSessionData = this.db.queryGetSessionData();

    // SETUP THE INITIAL STATE
    this.state = {
      currentList: null,
      sessionData: loadedSessionData,
      toDelete: null,
      listOfStates: [],
      currentStateIndex: null,
    };
  }
  sortKeyNamePairsByName = (keyNamePairs) => {
    keyNamePairs.sort((keyPair1, keyPair2) => {
      // GET THE LISTS
      return keyPair1.name.localeCompare(keyPair2.name);
    });
  };
  // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
  createNewList = () => {
    // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
    let newKey = this.state.sessionData.nextKey;
    let newName = "Untitled" + newKey;

    // MAKE THE NEW LIST
    let newList = {
      key: newKey,
      name: newName,
      items: ["?", "?", "?", "?", "?"],
    };

    // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
    // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
    let newKeyNamePair = { key: newKey, name: newName };
    let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
    this.sortKeyNamePairsByName(updatedPairs);

    // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
    // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
    // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
    // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
    // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
    // SHOULD BE DONE VIA ITS CALLBACK
    this.setState(
      (prevState) => ({
        currentList: newList,
        sessionData: {
          nextKey: prevState.sessionData.nextKey + 1,
          counter: prevState.sessionData.counter + 1,
          keyNamePairs: updatedPairs,
        },
      }),
      () => {
        // PUTTING THIS NEW LIST IN PERMANENT STORAGE
        // IS AN AFTER EFFECT
        this.db.mutationCreateList(newList);
      }
    );
  };
  renameList = (key, newName) => {
    let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
    // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
    for (let i = 0; i < newKeyNamePairs.length; i++) {
      let pair = newKeyNamePairs[i];
      if (pair.key === key) {
        pair.name = newName;
      }
    }
    this.sortKeyNamePairsByName(newKeyNamePairs);

    // WE MAY HAVE TO RENAME THE currentList
    let currentList = this.state.currentList;
    if (currentList.key === key) {
      currentList.name = newName;
    }

    this.setState(
      (prevState) => ({
        currentList: prevState.currentList,
        sessionData: {
          nextKey: prevState.sessionData.nextKey,
          counter: prevState.sessionData.counter,
          keyNamePairs: newKeyNamePairs,
        },
      }),
      () => {
        // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
        // THE TRANSACTION STACK IS CLEARED
        let list = this.db.queryGetList(key);
        list.name = newName;
        this.db.mutationUpdateList(list);
        this.db.mutationUpdateSessionData(this.state.sessionData);
      }
    );
  };
  // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
  loadList = (key) => {
    let newCurrentList = this.db.queryGetList(key);
    this.setState(
      (prevState) => ({
        currentList: newCurrentList,
        sessionData: prevState.sessionData,
        listOfStates: [[...newCurrentList.items]],
        currentStateIndex: 0,
      }),
      () => {
        console.log(this.state.listOfStates);
        console.log(this.state.currentStateIndex);
      }
    );
  };
  // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
  closeCurrentList = () => {
    this.setState(
      (prevState) => ({
        currentList: null,
        listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
        sessionData: this.state.sessionData,
        listOfStates: [],
        currentStateIndex: null,
      }),
      () => {
        // ANY AFTER EFFECTS?
        console.log(this.state.listOfStates);
        console.log(this.state.currentStateIndex);
      }
    );
  };
  deleteList = (keyNamePair) => {
    // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
    // WHICH LIST IT IS THAT THE USER WANTS TO
    // DELETE AND MAKE THAT CONNECTION SO THAT THE
    // NAME PROPERLY DISPLAYS INSIDE THE MODAL
    this.setState((prevState) => ({ ...prevState, toDelete: keyNamePair }));
    this.showDeleteListModal();
  };

  updateToolBarButtons() {
    if (this.state.currentList == null) {
    }
  }
  removeList() {
    this.setState(
      (prevState) => ({
        ...prevState,
        currentList: null,
        sessionData: {
          ...prevState.sessionData,
          keyNamePairs: prevState.sessionData.keyNamePairs.filter(
            (pair) => pair.key !== prevState.toDelete.key
          ),
        },
      }),
      () => {
        this.db.mutationDeleteList(this.state.toDelete.key);
        this.db.mutationUpdateSessionData(this.state.sessionData);
        this.hideDeleteListModal();
      }
    );
  }

  // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
  // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
  showDeleteListModal() {
    let modal = document.getElementById("delete-modal");
    modal.classList.add("is-visible");
  }
  // THIS FUNCTION IS FOR HIDING THE MODAL
  hideDeleteListModal() {
    let modal = document.getElementById("delete-modal");
    modal.classList.remove("is-visible");
  }

  renameListItem = (index, newName) => {
    if (this.state.currentList.items[index] !== newName) {
      console.log(this.state.listOfStates);
      let tempList = [...this.state.currentList.items];
      tempList[index] = newName;
      console.log(tempList);
      this.state.listOfStates.splice(this.state.currentStateIndex + 1);
      this.state.listOfStates.push(tempList);
      console.log(this.state.currentStateIndex);

      this.setState(
        (prevState) => ({
          ...prevState,
          currentStateIndex: prevState.currentStateIndex + 1,
          currentList: {
            ...prevState.currentList,
            items: [...tempList],
          },
        }),
        () => {
          this.db.mutationUpdateList(this.state.currentList);
        }
      );
    } else {
      console.log("no change");
    }
  };

  moveStateForward() {
    if (
      this.state.listOfStates.length - this.state.currentStateIndex - 1 === 0 ||
      this.state.currentStateIndex == null
    ) {
      console.log("nothing to undo");
    } else {
      this.setState(
        (prevState) => ({
          ...prevState,
          currentStateIndex: prevState.currentStateIndex + 1,
          currentList: {
            ...prevState.currentList,
            items: prevState.listOfStates[prevState.currentStateIndex + 1],
          },
        }),
        () => {
          this.db.mutationUpdateList(this.state.currentList);
        }
      );
    }
  }
  moveStateBackwards() {
    if (
      this.state.currentStateIndex === 0 ||
      this.state.currentStateIndex === null
    ) {
      console.log("nothing to undo");
    } else {
      this.setState(
        (prevState) => ({
          ...prevState,
          currentStateIndex: prevState.currentStateIndex - 1,
          currentList: {
            ...prevState.currentList,
            items: prevState.listOfStates[prevState.currentStateIndex - 1],
          },
        }),
        () => {
          this.db.mutationUpdateList(this.state.currentList);
        }
      );
    }
  }

  render() {
    return (
      <div id="app-root">
        <Banner
          title="Top 5 Lister"
          closeCallback={this.closeCurrentList}
          currentList={this.state.currentList}
          redoCallback={this.moveStateForward.bind(this)}
          undoCallback={this.moveStateBackwards.bind(this)}
          listOfStates={this.state.listOfStates}
          currentStateIndex={this.state.currentStateIndex}
        />
        <Sidebar
          heading="Your Lists"
          currentList={this.state.currentList}
          keyNamePairs={this.state.sessionData.keyNamePairs}
          createNewListCallback={this.createNewList}
          deleteListCallback={this.deleteList}
          loadListCallback={this.loadList}
          renameListCallback={this.renameList}
        />
        <Workspace
          currentList={this.state.currentList}
          listOfStates={this.state.listOfStates}
          currentStateIndex={this.state.currentStateIndex}
          renameListItemCallback={this.renameListItem.bind(this)}
        />
        <Statusbar currentList={this.state.currentList} />
        <DeleteModal
          listKeyPair={this.state.toDelete}
          hideDeleteListModalCallback={this.hideDeleteListModal}
          deleteListCallback={this.removeList.bind(this)}
        />
      </div>
    );
  }
}

export default App;
