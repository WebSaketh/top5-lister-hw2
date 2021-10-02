import React from "react";
import ListItem from "./ListItem";

export default class Workspace extends React.Component {
  render() {
    const { currentList } = this.props;
    let items = [];
    if (currentList) {
      items = currentList.items;
    }
    return (
      <div id="top5-workspace">
        <div id="workspace-edit">
          <div id="edit-numbering">
            <div className="item-number">1.</div>
            <div className="item-number">2.</div>
            <div className="item-number">3.</div>
            <div className="item-number">4.</div>
            <div className="item-number">5.</div>
          </div>
          <div id="edit-items">
            {items.map((item, index) => (
              <ListItem key={index} text={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
