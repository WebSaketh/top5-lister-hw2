import React from "react";
import App from "../App";

export default class ListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        id={`item-${this.props.index + 1}`}
        className="top5-item"
        draggable="true"
      >
        {this.props.text}
      </div>
    );
  }
}
