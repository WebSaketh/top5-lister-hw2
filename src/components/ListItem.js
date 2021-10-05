import React from "react";
import App from "../App";

export default class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editActive: false,
      text: this.props.text,
    };
  }

  handleClick = (event) => {
    if (event.detail === 2) {
      this.handleToggleEdit(event);
    }
  };
  handleToggleEdit = (event) => {
    this.setState(
      {
        editActive: !this.state.editActive,
      },
      () => {
        document.getElementById("item-" + (this.props.index + 1))?.focus();
      }
    );
  };
  handleUpdate = (event) => {
    this.setState({ text: event.target.value });
  };
  handleKeyPress = (event) => {
    if (event.code === "Enter") {
      this.handleBlur();
    }
  };
  handleBlur = () => {
    console.log(this.state.text);
    console.log(this.props.index);
    this.props.renameListItemCallback(this.props.index, this.state.text);
    this.handleToggleEdit();
  };

  onDragStart = (ev) => {
    document
      .getElementById(ev.target.attributes.id.nodeValue)
      ?.classList.add("middrag");
  };
  onDragEnd = (ev) => {
    document
      .getElementById(ev.target.attributes.id.nodeValue)
      ?.classList.remove("middrag");
    console.log(document.getElementsByClassName("top5-item"));
    let newState = [];
    Array.from(document.getElementsByClassName("top5-item")).map(
      (item, index) => (newState[index] = item.innerHTML)
    );
    console.log(newState);
    this.props.addState(newState);
  };

  onDragEnter = (ev) => {
    let first = ev.target.attributes.id.nodeValue;
    let second = document.querySelector(".middrag").id;
    if (first == second) {
    } else {
      document
        .getElementById(ev.target.attributes.id.nodeValue)
        ?.classList.add("target");
    }
  };

  onDragLeave = (ev) => {
    console.log(ev.target.attributes.id.nodeValue);
    document
      .getElementById(ev.target.attributes.id.nodeValue)
      ?.classList.remove("target");
  };

  render() {
    if (this.state.editActive) {
      return (
        <input
          id={`item-${this.props.index + 1}`}
          className="top5-item"
          draggable="true"
          onKeyPress={this.handleKeyPress}
          onClick={this.handleClick}
          onChange={this.handleUpdate}
          defaultValue={this.props.currentList.items[this.props.index]}
          onBlur={this.handleBlur}
        ></input>
      );
    } else {
      return (
        <div
          id={`item-${this.props.index + 1}`}
          className="top5-item"
          draggable="true"
          onClick={this.handleClick}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
          {this.props.currentList.items[this.props.index]}
        </div>
      );
    }
  }
}
