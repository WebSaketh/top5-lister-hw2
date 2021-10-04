import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
  render() {
    const {
      title,
      closeCallback,
      currentList,
      undoCallback,
      redoCallback,
      listOfStates,
      currentStateIndex,
    } = this.props;
    return (
      <div id="top5-banner">
        {title}
        <EditToolbar
          closeCallback={closeCallback}
          currentList={currentList}
          redoCallback={redoCallback}
          undoCallback={undoCallback}
          listOfStates={listOfStates}
          currentStateIndex={currentStateIndex}
        />
      </div>
    );
  }
}
