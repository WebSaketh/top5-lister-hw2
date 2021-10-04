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
    this.setState({
      editActive: !this.state.editActive,
    });
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

  render() {
    console.log(this.props);
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
        ></input>
      );
    } else {
      return (
        <div
          id={`item-${this.props.index + 1}`}
          className="top5-item"
          draggable="true"
          onClick={this.handleClick}
        >
          {this.props.currentList.items[this.props.index]}
        </div>
      );
    }
  }
}
